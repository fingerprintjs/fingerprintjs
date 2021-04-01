import { isDesktopSafari, isWebKit, isWebKit606OrNewer } from '../utils/browser'

const enum SpecialFingerprint {
  /** Making a fingerprint is skipped because the browser is known to always suspend audio context */
  KnownToSuspend = -1,
  /** The browser doesn't support audio context */
  NotSupported = -2,
  /** An unexpected timeout has happened */
  Timeout = -3,
}

const enum InnerErrorName {
  Timeout = 'timeout',
  Suspended = 'suspended',
}

/**
 * A deep description: https://fingerprintjs.com/blog/audio-fingerprinting/
 * Inspired by and based on https://github.com/cozylife/audio-fingerprint
 */
export default async function getAudioFingerprint(): Promise<number> {
  const w = window
  const AudioContext = w.OfflineAudioContext || w.webkitOfflineAudioContext
  if (!AudioContext) {
    return SpecialFingerprint.NotSupported
  }

  // In some browsers, audio context always stays suspended unless the context is started in response to a user action
  // (e.g. a click or a tap). It prevents audio fingerprint from being taken at an arbitrary moment of time.
  // Such browsers are old and unpopular, so the audio fingerprinting is just skipped in them.
  // See a similar case explanation at https://stackoverflow.com/questions/46363048/onaudioprocess-not-called-on-ios11#46534088
  if (doesCurrentBrowserSuspendAudioContext()) {
    return SpecialFingerprint.KnownToSuspend
  }

  const hashFromIndex = 4500
  const hashToIndex = 5000
  const context = new AudioContext(1, hashToIndex, 44100)

  const oscillator = context.createOscillator()
  oscillator.type = 'triangle'
  oscillator.frequency.value = 10000

  const compressor = context.createDynamicsCompressor()
  compressor.threshold.value = -50
  compressor.knee.value = 40
  compressor.ratio.value = 12
  compressor.attack.value = 0
  compressor.release.value = 0.25

  oscillator.connect(compressor)
  compressor.connect(context.destination)
  oscillator.start(0)

  let buffer: AudioBuffer
  try {
    buffer = await renderAudio(context)
  } catch (error) {
    if (error.name === InnerErrorName.Timeout || error.name === InnerErrorName.Suspended) {
      return SpecialFingerprint.Timeout
    }
    throw error
  }

  return getHash(buffer.getChannelData(0).subarray(hashFromIndex))
}

/**
 * Checks if the current browser is known to always suspend audio context
 */
function doesCurrentBrowserSuspendAudioContext() {
  return isWebKit() && !isDesktopSafari() && !isWebKit606OrNewer()
}

function renderAudio(context: OfflineAudioContext) {
  const resumeTriesMaxCount = 3
  const resumeRetryDelay = 500
  const runningTimeout = 1000

  return new Promise<AudioBuffer>((resolve, reject) => {
    context.oncomplete = (event) => resolve(event.renderedBuffer)

    let resumeTriesLeft = resumeTriesMaxCount

    const tryResume = () => {
      context.startRendering()

      switch (context.state) {
        case 'running':
          setTimeout(() => reject(makeInnerError(InnerErrorName.Timeout)), runningTimeout)
          break

        // Sometimes the audio context doesn't start after calling `startRendering` (in addition to the cases where
        // audio context doesn't start at all). A known case is starting an audio context when the browser tab is in
        // background on iPhone. Retries usually help in this case.
        case 'suspended':
          // The audio context can reject starting until the tab is in foreground. Long fingerprint duration
          // in background isn't a problem, therefore the retry attempts don't count in background. It can lead to
          // a situation when a fingerprint takes very long time and finishes successfully. FYI, the audio context
          // can be suspended when `document.hidden === false` and start running after a retry.
          if (!document.hidden) {
            resumeTriesLeft--
          }
          if (resumeTriesLeft > 0) {
            setTimeout(tryResume, resumeRetryDelay)
          } else {
            reject(makeInnerError(InnerErrorName.Suspended))
          }
          break
      }
    }

    tryResume()
  })
}

function getHash(signal: ArrayLike<number>): number {
  let hash = 0
  for (let i = 0; i < signal.length; ++i) {
    hash += Math.abs(signal[i])
  }
  return hash
}

function makeInnerError(name: InnerErrorName) {
  const error = new Error(name)
  error.name = name
  return error
}

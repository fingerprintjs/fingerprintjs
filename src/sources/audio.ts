const n = navigator
const w = window
const d = document

const enum InnerErrorName {
  Timeout = 'timeout',
  Suspended = 'suspended',
}

// Inspired by and based on https://github.com/cozylife/audio-fingerprint
export default async function getAudioFingerprint(): Promise<number> {
  // On iOS 11, audio context can only be used in response to user interaction.
  // We require users to explicitly enable audio fingerprinting on iOS 11.
  // See https://stackoverflow.com/questions/46363048/onaudioprocess-not-called-on-ios11#46534088
  if (doesCurrentBrowserSuspendAudioContext()) {
    // See comment for excludeUserAgent and https://stackoverflow.com/questions/46363048/onaudioprocess-not-called-on-ios11#46534088
    return -1
  }

  const AudioContext = w.OfflineAudioContext || w.webkitOfflineAudioContext

  if (!AudioContext) {
    return -2
  }

  const context = new AudioContext(1, 44100, 44100)

  const oscillator = context.createOscillator()
  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(10000, context.currentTime)

  const compressor = context.createDynamicsCompressor()
  for (const [name, value] of [
    ['threshold', -50],
    ['knee', 40],
    ['ratio', 12],
    ['reduction', -20],
    ['attack', 0],
    ['release', 0.25],
  ] as const) {
    const param = compressor[name]
    if (isAudioParam(param)) {
      param.setValueAtTime(value, context.currentTime)
    }
  }

  oscillator.connect(compressor)
  compressor.connect(context.destination)
  oscillator.start(0)

  let buffer: AudioBuffer
  try {
    buffer = await renderAudio(context)
  } catch (error) {
    if (error.name === InnerErrorName.Timeout || error.name === InnerErrorName.Suspended) {
      return -3
    }
    throw error
  } finally {
    oscillator.disconnect()
    compressor.disconnect()
  }

  return getHash(buffer.getChannelData(0))
}

/**
 * Checks if the current browser is known to always suspend audio context
 */
function doesCurrentBrowserSuspendAudioContext() {
  // todo: Find a way to detect iOS Safari 12+ without using user-agent
  const matches = n.userAgent.match(/OS (\d+).+Version\/(\d+).+Safari/)
  return !!matches && matches[1] === matches[2] && parseInt(matches[1]) < 12
}

function isAudioParam(value: unknown): value is AudioParam {
  return value && typeof (value as AudioParam).setValueAtTime === 'function'
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
        case 'suspended':
          if (d.visibilityState !== 'hidden') {
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
  for (let i = 4500; i < 5000; ++i) {
    hash += Math.abs(signal[i])
  }
  return hash
}

function makeInnerError(name: InnerErrorName) {
  const error = new Error(name)
  error.name = name
  return error
}

import { isDesktopWebKit, isWebKit, isWebKit606OrNewer } from '../utils/browser'
import { isPromise, suppressUnhandledRejectionWarning, wait } from '../utils/async'
import { whenDocumentVisible } from '../utils/dom'

export const enum SpecialFingerprint {
  /** The browser is known for always suspending audio context, thus making fingerprinting impossible */
  KnownForSuspending = -1,
  /** The browser doesn't support audio context */
  NotSupported = -2,
  /** An unexpected timeout has happened */
  Timeout = -3,
}

const sampleRate = 44100
const cloneCount = 40000
const stabilizationPrecision = 6.2

/**
 * A version of the entropy source with stabilization to make it suitable for static fingerprinting.
 * Audio signal is noised in private mode of Safari 17.
 */
export default async function getAudioFingerprint(): Promise<() => number> {
  const finish = await getUnstableAudioFingerprint()
  return () => {
    const rawFingerprint = finish()
    return stabilize(rawFingerprint, stabilizationPrecision)
  }
}

/**
 * A version of the entropy source without stabilization.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export async function getUnstableAudioFingerprint(): Promise<() => number> {
  let fingerprintResult: [true, number] | [false, unknown] | undefined

  // The timeout is not started until the browser tab becomes visible because some browsers may not want to render
  // an audio context in background.
  const timeoutPromise = whenDocumentVisible().then(() => wait(500))
  const fingerprintPromise = getBaseAudioFingerprint().then(
    (result) => (fingerprintResult = [true, result]),
    (error) => (fingerprintResult = [false, error]),
  )
  await Promise.race([timeoutPromise, fingerprintPromise])

  return () => {
    if (!fingerprintResult) {
      return SpecialFingerprint.Timeout
    }
    if (!fingerprintResult[0]) {
      throw fingerprintResult[1]
    }
    return fingerprintResult[1]
  }
}

async function getBaseAudioFingerprint(): Promise<number> {
  const w = window
  const AudioContext = w.OfflineAudioContext || w.webkitOfflineAudioContext
  if (!AudioContext) {
    return SpecialFingerprint.NotSupported
  }

  // In some browsers, audio context always stays suspended unless the context is started in response to a user action
  // (e.g. a click or a tap). It prevents audio fingerprint from being taken at an arbitrary moment of time.
  // Such browsers are old and unpopular, so the audio fingerprinting is just skipped in them.
  // See a similar case explanation at https://stackoverflow.com/questions/46363048/onaudioprocess-not-called-on-ios11#46534088
  if (doesBrowserSuspendAudioContext()) {
    return SpecialFingerprint.KnownForSuspending
  }

  const baseSignal = await getBaseSignal(AudioContext)
  if (!baseSignal) {
    return SpecialFingerprint.Timeout
  }

  // This context copies the last sample of the base signal many times.
  // The array of copies helps to cancel the noise.
  const context = new AudioContext(1, baseSignal.length - 1 + cloneCount, sampleRate)
  const sourceNode = context.createBufferSource()
  sourceNode.buffer = baseSignal
  sourceNode.loop = true
  sourceNode.loopStart = (baseSignal.length - 1) / sampleRate
  sourceNode.loopEnd = baseSignal.length / sampleRate
  sourceNode.connect(context.destination)
  sourceNode.start()

  const clonedSignal = await renderAudio(context)
  if (!clonedSignal) {
    return SpecialFingerprint.Timeout
  }
  const fingerprint = extractFingerprint(baseSignal, clonedSignal.getChannelData(0).subarray(baseSignal.length - 1))
  return Math.abs(fingerprint) // The fingerprint is made positive to avoid confusion with the special fingerprints
}

/**
 * Checks if the current browser is known for always suspending audio context.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function doesBrowserSuspendAudioContext() {
  // Mobile Safari 11 and older
  return isWebKit() && !isDesktopWebKit() && !isWebKit606OrNewer()
}

/**
 * Produces an arbitrary audio signal
 */
async function getBaseSignal(AudioContext: typeof OfflineAudioContext) {
  const targetSampleIndex = 3395
  const context = new AudioContext(1, targetSampleIndex + 1, sampleRate)

  const oscillator = context.createOscillator()
  oscillator.type = 'square'
  oscillator.frequency.value = 1000

  const compressor = context.createDynamicsCompressor()
  compressor.threshold.value = -70
  compressor.knee.value = 40
  compressor.ratio.value = 12
  compressor.attack.value = 0
  compressor.release.value = 0.25

  const filter = context.createBiquadFilter()
  filter.type = 'allpass'
  filter.frequency.value = 5.239622852977861
  filter.Q.value = 0.1

  oscillator.connect(compressor)
  compressor.connect(filter)
  filter.connect(context.destination)
  oscillator.start(0)

  return await renderAudio(context)
}

/**
 * Renders the given audio context with configured nodes.
 * Returns `null` when the rendering runs out of attempts.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function renderAudio(context: OfflineAudioContext) {
  return new Promise<AudioBuffer | null>((resolve, reject) => {
    const retryDelay = 200
    let attemptsLeft = 25

    context.oncomplete = (event) => resolve(event.renderedBuffer)

    const tryRender = () => {
      try {
        const renderingPromise = context.startRendering()

        // `context.startRendering` has two APIs: Promise and callback, we check that it's really a promise just in case
        if (isPromise(renderingPromise)) {
          // Suppresses all unhandled rejections in case of scheduled redundant retries after successful rendering
          suppressUnhandledRejectionWarning(renderingPromise)
        }

        // Sometimes the audio context doesn't start after calling `startRendering` (in addition to the cases where
        // audio context doesn't start at all). A known case is starting an audio context when the browser tab is in
        // background on iPhone. Retries usually help in this case.
        if (context.state === 'suspended') {
          // The audio context can reject starting until the tab is in foreground. Long fingerprint duration
          // in background isn't a problem, therefore the retry attempts don't count in background. It can lead to
          // a situation when a fingerprint takes very long time and finishes successfully. FYI, the audio context
          // can be suspended when `document.hidden === false` and start running after a retry.
          if (!document.hidden) {
            attemptsLeft--
          }
          if (attemptsLeft > 0) {
            setTimeout(tryRender, retryDelay)
          } else {
            resolve(null)
          }
        }
      } catch (error) {
        reject(error)
      }
    }

    tryRender()
  })
}

function extractFingerprint(baseSignal: AudioBuffer, clonedSample: Float32Array): number {
  let fingerprint = undefined
  let needsDenoising = false

  for (let i = 0; i < clonedSample.length; i += Math.floor(clonedSample.length / 10)) {
    if (clonedSample[i] === 0) {
      // In some cases the signal is 0 on a short range for some reason. Ignoring such samples.
    } else if (fingerprint === undefined) {
      fingerprint = clonedSample[i]
    } else if (fingerprint !== clonedSample[i]) {
      needsDenoising = true
      break
    }
  }

  // The looped buffer source works incorrectly in old Safari versions (>14 desktop, >15 mobile).
  // The looped signal contains only 0s. To fix it, the loop start should be `baseSignal.length - 1.00000000001` and
  // the loop end should be `baseSignal.length + 0.00000000001` (there can be 10 or 11 0s after the point). But this
  // solution breaks the looped signal in other browsers. Instead of checking the browser version, we check that the
  // looped signals comprises only 0s, and if it does, we return the last value of the base signal, because old Safari
  // versions don't add noise that we want to cancel.
  if (fingerprint === undefined) {
    fingerprint = baseSignal.getChannelData(0)[baseSignal.length - 1]
  } else if (needsDenoising) {
    fingerprint = getMiddle(clonedSample)
  }

  return fingerprint
}

/**
 * Calculates the middle between the minimum and the maximum array item
 */
export function getMiddle(signal: ArrayLike<number>): number {
  let min = Infinity
  let max = -Infinity

  for (let i = 0; i < signal.length; i++) {
    const value = signal[i]
    // In very rare cases the signal is 0 on a short range for some reason. Ignoring such samples.
    if (value === 0) {
      continue
    }
    if (value < min) {
      min = value
    }
    if (value > max) {
      max = value
    }
  }

  return (min + max) / 2
}

/**
 * Truncates some digits of the number to make it stable.
 * `precision` is the number of significant digits to keep. The number may be not integer:
 *  - If it ends with `.2`, the last digit is rounded to the nearest multiple of 5;
 *  - If it ends with `.5`, the last digit is rounded to the nearest even number;
 */
export function stabilize(value: number, precision: number): number {
  if (value === 0) {
    return value
  }

  const power = Math.floor(Math.log10(Math.abs(value)))
  const precisionPower = power - Math.floor(precision) + 1
  const precisionBase = 10 ** -precisionPower * ((precision * 10) % 10 || 1)
  return Math.round(value * precisionBase) / precisionBase
}

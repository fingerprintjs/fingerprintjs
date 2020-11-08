const n = navigator
const w = window

const timeoutErrorName = 'timeout'

// Inspired by and based on https://github.com/cozylife/audio-fingerprint
export default async function getAudioFingerprint(): Promise<number> {
  // On iOS 11, audio context can only be used in response to user interaction.
  // We require users to explicitly enable audio fingerprinting on iOS 11.
  // See https://stackoverflow.com/questions/46363048/onaudioprocess-not-called-on-ios11#46534088
  if (n.userAgent.match(/OS 11.+Version\/11.+Safari/)) {
    // See comment for excludeUserAgent and https://stackoverflow.com/questions/46363048/onaudioprocess-not-called-on-ios11#46534088
    return -1
  }

  const AudioContext = w.OfflineAudioContext || w.webkitOfflineAudioContext

  if (!AudioContext) {
    return -2
  }

  let result = 0
  for (let i = 0; i < 5; ++i) {
    console.log(`Getting an audio fingerprint, try #${i + 1}`)
    result = await tryGetAudioFingerprint(AudioContext)
    console.log(`Try #${i + 1} result:`, result)
    if (result > 0) {
      break
    }
  }
  return result
}

async function tryGetAudioFingerprint(AudioContext: typeof OfflineAudioContext) {
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

  try {
    const audioBuffer = await renderAudio(context)
    return audioBuffer
      .getChannelData(0)
      .slice(4500, 5000)
      .reduce((acc, val) => acc + Math.abs(val), 0)
  } catch (error) {
    return error.name === timeoutErrorName ? -3 : -4
  } finally {
    oscillator.disconnect()
    compressor.disconnect()
  }
}

function isAudioParam(value: unknown): value is AudioParam {
  return value && typeof (value as AudioParam).setValueAtTime === 'function'
}

function renderAudio(context: OfflineAudioContext, timeoutMs = 1000) {
  return new Promise<AudioBuffer>((resolve, reject) => {
    console.log('Before timeout', context.state)

    const audioTimeoutId = setTimeout(() => {
      context.oncomplete = null
      const error = new Error(timeoutErrorName)
      error.name = timeoutErrorName
      reject(error)
    }, timeoutMs)

    context.oncomplete = (event) => {
      clearTimeout(audioTimeoutId)
      resolve(event.renderedBuffer)
    }

    context.startRendering()
    console.log('After startRendering', context.state)

    setTimeout(() => console.log('After timeout', context.state), 500)
  })
}

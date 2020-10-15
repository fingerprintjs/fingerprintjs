const n = navigator
const w = window

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

  const context = new AudioContext(1, 44100, 44100)

  const oscillator = context.createOscillator()
  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(10000, context.currentTime)

  const compressor = context.createDynamicsCompressor()
  for (const [param, value] of [
    ['threshold', -50],
    ['knee', 40],
    ['ratio', 12],
    ['reduction', -20],
    ['attack', 0],
    ['release', 0.25],
  ] as const) {
    if (typeof (compressor[param] as AudioParam).setValueAtTime === 'function') {
      (compressor[param] as AudioParam).setValueAtTime(value, context.currentTime)
    }
  }

  oscillator.connect(compressor)
  compressor.connect(context.destination)
  oscillator.start(0)
  context.startRendering()

  return new Promise<number>((resolve) => {
    const audioTimeoutId = setTimeout(() => {
      context.oncomplete = () => {}
      resolve(-3)
    }, 1000)

    context.oncomplete = (event) => {
      let afp
      try {
        clearTimeout(audioTimeoutId)
        afp = event.renderedBuffer
          .getChannelData(0)
          .slice(4500, 5000)
          .reduce((acc, val) => acc + Math.abs(val), 0)
        oscillator.disconnect()
        compressor.disconnect()
      } catch (error) {
        resolve(-4)
        return
      }
      resolve(afp)
    }
  })
}

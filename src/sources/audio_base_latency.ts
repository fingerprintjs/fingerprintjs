import { isAndroid, isChromium } from '../utils/browser'

export default function getAudioContextBaseLatency(): number | undefined {
  // The signal emits warning in console, so is is enabled only on Android where it's less visible
  const isAllowedPlatform = isAndroid() && isChromium()
  if (!isAllowedPlatform) {
    return undefined
  }

  if (!window.AudioContext) {
    return undefined
  }

  return new AudioContext().baseLatency
}

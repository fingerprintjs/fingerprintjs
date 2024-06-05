import { isAndroid, isWebKit } from '../utils/browser'

export const enum SpecialFingerprint {
  /** The browser doesn't support AudioContext or baseLatency */
  NotSupported = -1,
  /** Entropy source is disabled because of console warnings */
  Disabled = -2,
}

export default function getAudioContextBaseLatency(): number {
  // The signal emits warning in Chrome and Firefox, therefore it is enabled on Safari where it doesn't produce warning
  // and on Android where it's less visible
  const isAllowedPlatform = isAndroid() || isWebKit()
  if (!isAllowedPlatform) {
    return SpecialFingerprint.Disabled
  }

  if (!window.AudioContext) {
    return SpecialFingerprint.NotSupported
  }
  return new AudioContext().baseLatency ?? SpecialFingerprint.NotSupported
}

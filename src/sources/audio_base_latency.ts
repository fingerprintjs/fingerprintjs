import { isAndroid, isWebKit } from '../utils/browser'

export const enum SpecialFingerprint {
  /** The browser doesn't support AudioContext or baseLatency */
  NotSupported = -1,
  /** Entropy source is disabled because of console warnings */
  Disabled = -2,
  /** Weird case where `baseLatency` is not a float number but `Infinity` instead */
  NotFinite = -3,
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

  const latency = new AudioContext().baseLatency

  if (latency === null || latency === undefined) {
    return SpecialFingerprint.NotSupported
  }

  if (!isFinite(latency)) {
    return SpecialFingerprint.NotFinite
  }

  return latency
}

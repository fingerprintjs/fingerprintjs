import { isDesktopWebKit, isWebKit } from '../utils/browser'

/**
 * @see https://www.w3.org/TR/mediaqueries-5/#dynamic-range
 */
export default function isHDR(): boolean | undefined {
  // Mobile WebKit (iOS/iPadOS) reports `standard` dynamic range while Low Power Mode is on, so the value is unstable.
  // See https://github.com/fingerprintjs/fingerprintjs/issues/809
  if (isWebKit() && !isDesktopWebKit()) {
    return undefined
  }
  if (doesMatch('high')) {
    return true
  }
  if (doesMatch('standard')) {
    return false
  }
  return undefined
}

function doesMatch(value: string) {
  return matchMedia(`(dynamic-range: ${value})`).matches
}

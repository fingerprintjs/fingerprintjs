import { isChromeWebKit, isFirefoxWebKit, isWebKit, isYandexWebKit } from '../utils/browser'

/**
 * 'none' means that this is either Safari or an unknown WebKit browser
 */
export type Flavor = 'none' | 'chrome' | 'firefox' | 'yandex'

/**
 * Tells iOS browsers apart that otherwise have the same fingerprint.
 * `undefined` means that the browser isn't based on WebKit.
 * Only somewhat popular browsers are considered.
 */
export default function getWebKitFlavor(): Flavor | undefined {
  if (!isWebKit()) {
    return undefined
  }
  if (isChromeWebKit()) {
    return 'chrome'
  }
  if (isFirefoxWebKit()) {
    return 'firefox'
  }
  if (isYandexWebKit()) {
    return 'yandex'
  }
  return 'none'
}

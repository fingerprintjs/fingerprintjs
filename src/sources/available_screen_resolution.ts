import { toInt } from '../utils/data'
import * as browser from '../utils/browser'

export default function getAvailableScreenResolution(): [number, number] | undefined {
  const { availWidth, availHeight } = screen

  if (!availWidth || !availHeight || !isStable()) {
    return undefined
  }

  // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
  // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
  const dimensions = [toInt(availWidth), toInt(availHeight)] as [number, number]
  dimensions.sort().reverse()
  return dimensions
}

/**
 * Checks whether the current browser is know to have stable available screen resolution. "Stable" means that it doesn't
 * change when the browser goes fullscreen (including via `requestFullscreen` and a UI button).
 *
 * @see https://github.com/fingerprintjs/fingerprintjs/issues/568#issuecomment-722272726 Based on research in November 2020
 */
function isStable() {
  return (
    (browser.isWindows() && ((browser.isChromium() && !browser.isChromium84OrNewer()) || browser.isGecko())) ||
    browser.isTrident() ||
    browser.isEdgeHTML() ||
    (browser.isWebKit() && browser.isDesktopSafari() && !browser.isWebKit606OrNewer()) ||
    (browser.isMacOS() && browser.isChromium() && browser.isChromium57OrNewer() && !browser.isChromium79OrNewer())
  )
}

import * as utils from '../../tests/utils'
import * as browser from './browser'

describe('Browser utilities', () => {
  describe('engine detection', () => {
    it('detects Trident', () => {
      expect(browser.isTrident()).toBe(utils.isTrident())
    })

    it('detects EdgeHTML', () => {
      expect(browser.isEdgeHTML()).toBe(utils.isEdgeHTML())
    })

    it('detects Chromium', () => {
      expect(browser.isChromium()).toBe(utils.isChromium())
    })

    it('detects Gecko', () => {
      expect(browser.isGecko()).toBe(utils.isGecko())
    })

    it('detects WebKit', () => {
      expect(browser.isWebKit()).toBe(utils.isWebKit())
    })

    it('detects desktop Safari', () => {
      if (!utils.isWebKit()) {
        pending('The case is for WebKit only')
      }
      if (!utils.isMobile()) {
        pending("Desktop Safari on BrowserStack Automate doesn't have `window.safari` for some reason")
        // We've tested manually that desktop Safaris 9–14 do have `window.safari`
      }
      expect(browser.isDesktopSafari()).toBe(!utils.isMobile())
    })

    it('detects Chromium 86+', () => {
      if (!utils.isChromium()) {
        pending('The case is for Chromium only')
      }
      expect(browser.isChromium86OrNewer()).toBe((utils.getBrowserEngineMajorVersion() ?? 0) >= 86)
    })
  })
})

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
        return
      }
      expect(browser.isDesktopSafari()).toBe(!utils.isMobile() && !utils.isTablet())
    })

    it('detects Chromium 86+', () => {
      if (!utils.isChromium()) {
        return
      }
      expect(browser.isChromium86OrNewer()).toBe((utils.getBrowserEngineMajorVersion() ?? 0) >= 86)
    })

    // WebKit has stopped telling its real version in the user-agent string since version 605.1.15,
    // therefore the browser version has to be checked instead of the engine version.
    it('detects Safari 12+', () => {
      if (!utils.isSafari()) {
        return
      }
      expect(browser.isWebKit606OrNewer()).toBe((utils.getBrowserMajorVersion() ?? 0) >= 12)
    })

    it('detects iPad', () => {
      // Unfortunately, UA-parser can't detect an iPad that pretends to be a Mac
      if (!utils.isWebKit() || !(utils.isMobile() || utils.isTablet())) {
        return
      }
      expect(browser.isIPad()).toBe(utils.isTablet())
    })
  })

  describe('platform detection', () => {
    it('detects Android', () => {
      expect(browser.isAndroid()).toBe(utils.isAndroid())
    })
  })
})

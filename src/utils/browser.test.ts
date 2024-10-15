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

    it('detects desktop WebKit', () => {
      if (!utils.isWebKit()) {
        return
      }
      expect(browser.isDesktopWebKit()).toBe(!utils.isMobile() && !utils.isTablet())
    })

    it('detects Chromium 86+', () => {
      if (!utils.isChromium()) {
        return
      }
      expect(browser.isChromium86OrNewer()).toBe((utils.getBrowserEngineMajorVersion() ?? 0) >= 86)
    })

    it('detects Chromium 122+', () => {
      if (!utils.isChromium()) {
        return
      }
      expect(browser.isChromium122OrNewer()).toBe((utils.getBrowserEngineMajorVersion() ?? 0) >= 122)
    })

    // WebKit has stopped telling its real version in the user-agent string since version 605.1.15,
    // therefore the browser version has to be checked instead of the engine version.
    it('detects Safari 12+', () => {
      if (!utils.isSafari()) {
        return
      }
      expect(browser.isWebKit606OrNewer()).toBe((utils.getBrowserMajorVersion() ?? 0) >= 12)
    })

    it('detects Safari 17+', () => {
      if (!utils.isSafari()) {
        return
      }
      expect(browser.isWebKit616OrNewer()).toBe((utils.getBrowserMajorVersion() ?? 0) >= 17)
    })

    it('detects iPad', () => {
      // Unfortunately, UA-parser can't detect an iPad that pretends to be a Mac
      if (!utils.isWebKit() || !(utils.isMobile() || utils.isTablet())) {
        return
      }
      expect(browser.isIPad()).toBe(utils.isTablet())
    })

    it('detects Safari', () => {
      const version = utils.getBrowserVersion()
      if (!utils.isWebKit() || !version || version.major < 15 || (version.major === 15 && version.minor < 4)) {
        return
      }
      expect(browser.isSafariWebKit()).toBe(utils.isSafari())
    })

    it('detects Samsung Internet', () => {
      if (!utils.isChromium()) {
        return
      }
      expect(browser.isSamsungInternet()).toBe(utils.isSamsungInternet())
    })
  })

  describe('platform detection', () => {
    it('detects Android', () => {
      expect(browser.isAndroid()).toBe(utils.isAndroid())
    })
  })
})

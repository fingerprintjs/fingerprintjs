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

    describe('Chromium', () => {
      it('detects the engine', () => {
        expect(browser.isChromium()).toBe(utils.isChromium())
      })

      it('detects version 86+', () => {
        if (!utils.isChromium()) {
          pending('The case is for Chromium only')
        }
        expect(browser.isChromium86OrNewer()).toBe((utils.getBrowserEngineMajorVersion() ?? 0) >= 86)
      })

      it('detects version 84+', () => {
        if (!utils.isChromium()) {
          pending('The case is for Chromium only')
        }
        expect(browser.isChromium84OrNewer()).toBe((utils.getBrowserEngineMajorVersion() ?? 0) >= 84)
      })

      it('detects version 79+', () => {
        if (!utils.isChromium()) {
          pending('The case is for Chromium only')
        }
        expect(browser.isChromium79OrNewer()).toBe((utils.getBrowserEngineMajorVersion() ?? 0) >= 79)
      })

      it('detects version 57+', () => {
        if (!utils.isChromium()) {
          pending('The case is for Chromium only')
        }
        expect(browser.isChromium57OrNewer()).toBe((utils.getBrowserEngineMajorVersion() ?? 0) >= 57)
      })
    })

    it('detects Gecko', () => {
      expect(browser.isGecko()).toBe(utils.isGecko())
    })

    describe('WebKit', () => {
      it('detects the engine', () => {
        expect(browser.isWebKit()).toBe(utils.isWebKit())
      })

      // WebKit has stopped telling its real version in the user-agent string since version 605.1.15,
      // therefore the browser version has to be checked instead of the engine version.
      it('detects Safari 12+', () => {
        if (!utils.isSafari()) {
          pending('The case is for Safari only')
        }
        expect(browser.isWebKit606OrNewer()).toBe((utils.getBrowserMajorVersion() ?? 0) >= 12)
      })
    })
  })

  describe('platform detection', () => {
    it('detects Windows', () => {
      expect(browser.isWindows()).toBe(utils.isWindows())
    })

    it('detects macOS', () => {
      expect(browser.isMacOS()).toBe(utils.isMacOS())
    })

    it('detects desktop Safari', () => {
      if (!utils.isWebKit()) {
        pending('The case is for WebKit only')
      }
      expect(browser.isDesktopSafari()).toBe(!utils.isMobile())
    })
  })
})

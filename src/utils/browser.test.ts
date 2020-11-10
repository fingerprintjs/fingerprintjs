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
      expect(browser.isDesktopSafari()).toBe(!utils.isMobile())
    })

    it('detects Chromium 86+', () => {
      if (!utils.isChromium()) {
        pending('The case is for Chromium only')
      }
      expect(browser.isChromium86OrNewer()).toBe((utils.getBrowserEngineMajorVersion() ?? 0) >= 86)
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

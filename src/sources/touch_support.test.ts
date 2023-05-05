import { getBrowserMajorVersion, isMobile, isSafari, isTablet, withMockProperties } from '../../tests/utils'
import getTouchSupport from './touch_support'

describe('Sources', () => {
  describe('touchSupport', () => {
    it('detects touchable device', () => {
      const touchSupport = getTouchSupport()

      if (isMobile() || isTablet()) {
        // Unavailable in Safari on iOS until version 13.
        if (isSafari() && (getBrowserMajorVersion() ?? 0) < 13) {
          expect(touchSupport.maxTouchPoints).toBe(0)
        } else {
          expect(touchSupport.maxTouchPoints).toBeGreaterThan(0)
        }

        expect(touchSupport.touchEvent).toBe(true)
        expect(touchSupport.touchStart).toBe(true)
      } else {
        expect(touchSupport.maxTouchPoints).toBe(0)
        expect(touchSupport.touchEvent).toBe(false)
        expect(touchSupport.touchStart).toBe(false)
      }
    })

    // Some browsers return a string value for `maxTouchPoints`.
    // This test checks that it's fetched as a number regardless.
    it('handles fake values', async () => {
      // Configuring the mock property as `{ value: '5' }` doesn't work in old browsers.
      await withMockProperties(navigator, { maxTouchPoints: { get: () => '5' } }, () => {
        const touchSupport = getTouchSupport()
        expect(touchSupport.maxTouchPoints).toBe(5)
      })
    })
  })
})

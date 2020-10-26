import { withMockProperties } from '../../tests/utils'
import getTouchSupport from './touch_support'

describe('Sources', () => {
  describe('touchSupport', () => {
    it('detects touchable device', () => {
      const touchSupport = getTouchSupport()
      expect(typeof touchSupport.maxTouchPoints).toBe('number')
      expect(typeof touchSupport.touchEvent).toBe('boolean')
      expect(typeof touchSupport.touchStart).toBe('boolean')
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

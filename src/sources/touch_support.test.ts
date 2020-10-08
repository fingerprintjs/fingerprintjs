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

    it('handles fake values', async () => {
      // Some browsers return a string value for `maxTouchPoints`.
      // This test checks that it's fetched as a number regardless.
      await withMockProperties(navigator, { maxTouchPoints: { value: '5' } }, () => {
        const touchSupport = getTouchSupport()
        expect(touchSupport.maxTouchPoints).toBe(5)
      })
    })
  })
})

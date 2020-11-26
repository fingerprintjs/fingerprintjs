import { withMockProperties } from '../../tests/utils'
import getDeviceMemory from './device_memory'

describe('Sources', () => {
  describe('deviceMemory', () => {
    it('returns number or undefined for the current browser', () => {
      const deviceMemory = getDeviceMemory()
      expect(['number', 'undefined'].indexOf(typeof deviceMemory)).not.toBe(-1)
      if (typeof deviceMemory === 'number') {
        expect(deviceMemory).not.toBeNaN()
        expect(deviceMemory).toBeGreaterThan(0)
      }
    })

    it('handles numeric values', async () => {
      // Configuring the mock property as `{ value: 8 }` doesn't work in old browsers.
      await withMockProperties(navigator, { deviceMemory: { get: () => 8 } }, () => {
        expect(getDeviceMemory()).toBe(8)
      })
    })

    it('handles undefined values', async () => {
      await withMockProperties(navigator, { deviceMemory: { get: () => undefined } }, () => {
        expect(getDeviceMemory()).toBeUndefined()
      })
    })

    // Some browsers return a string value for `deviceMemory`.
    // This test checks that it's fetched as a number regardless.
    it('converts fake string value to number', async () => {
      await withMockProperties(navigator, { deviceMemory: { get: () => '4' } }, () => {
        expect(getDeviceMemory()).toBe(4)
      })
    })
  })
})

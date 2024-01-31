import { withMockProperties } from '../../tests/utils'
import getTimezoneOffset from './timezone_offset'

describe('Sources', () => {
  describe('timezoneOffset', () => {
    it('returns expected value', () => {
      const result = getTimezoneOffset()
      expect(result).toEqual([jasmine.any(Number), jasmine.any(Number)])

      const minOffsetOnEarth = 14 * -60
      const maxOffsetOnEarth = -12 * -60
      expect(result[0]).toBeGreaterThanOrEqual(minOffsetOnEarth)
      expect(result[0]).toBeLessThanOrEqual(maxOffsetOnEarth)
      expect(result[1]).toBeGreaterThanOrEqual(minOffsetOnEarth)
      expect(result[1]).toBeLessThanOrEqual(maxOffsetOnEarth)
      expect(Math.abs(result[0] - result[1])).toBeLessThanOrEqual(60)
    })

    it("doesn't confuse the data", async () => {
      const januaryOffset = -60
      const julyOffset = -120

      class MockDate {
        args: unknown[]

        constructor(...args: unknown[]) {
          this.args = args
        }

        getFullYear() {
          return 2024
        }

        getTimezoneOffset() {
          if (this.args[1] === 0) {
            return januaryOffset
          }
          if (this.args[1] === 6) {
            return julyOffset
          }
          throw TypeError('Unexpected constructor arguments')
        }
      }

      await withMockProperties(window, { Date: { value: MockDate } }, () => {
        expect(getTimezoneOffset()).toEqual([januaryOffset, julyOffset])
      })
    })
  })
})

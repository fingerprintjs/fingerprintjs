import { getBrowserMajorVersion, isSafari } from '../../tests/utils'
import getScreenResolution from './screen_resolution'

describe('Sources', () => {
  describe('screenResolution', () => {
    it('handles browser native value', () => {
      const result = getScreenResolution()

      if (shouldTurnOff()) {
        expect(result).toBeUndefined()
        return
      }

      if (result === undefined) {
        throw new Error('Expected not to be undefined')
      }
      expect(result[0]).toBeGreaterThan(0)
      expect(result[1]).toBeGreaterThan(0)
    })

    it('returns stable values', () => {
      const first = getScreenResolution()
      const second = getScreenResolution()

      expect(second).toEqual(first)
    })
  })
})

function shouldTurnOff() {
  return isSafari() && (getBrowserMajorVersion() ?? 0) >= 17
}

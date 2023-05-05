import { getBrowserMajorVersion, isSafari } from '../../tests/utils'
import getHardwareConcurrency from './hardware_concurrency'

describe('Sources', () => {
  describe('hardwareConcurrency', () => {
    it('handles browser native value', () => {
      const result = getHardwareConcurrency()

      // In Safari the navigator.hardwareConcurrency is behind a build option,
      // on BrowserStack it seems available starting with version 15.
      if (!(isSafari() && (getBrowserMajorVersion() ?? 0) < 15)) {
        expect(result).toBeGreaterThan(0)
      }
    })

    it('returns a stable value', () => {
      const first = getHardwareConcurrency()
      const second = getHardwareConcurrency()

      expect(second).toBe(first)
    })
  })
})

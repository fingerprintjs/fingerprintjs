import { getBrowserVersion, isSafari } from '../../tests/utils'
import getHardwareConcurrency from './hardware_concurrency'

describe('Sources', () => {
  describe('hardwareConcurrency', () => {
    it('handles browser native value', () => {
      const result = getHardwareConcurrency()
      const version = getBrowserVersion() ?? { major: 0, minor: 0 }

      // In Safari the navigator.hardwareConcurrency is behind a build option,
      // on BrowserStack it seems available starting with version 15.4.
      if (isSafari() && (version.major < 15 || (version.major === 15 && version.minor < 4))) {
        expect(result).toBe(undefined)
        return
      }

      expect(result).toBeGreaterThan(0)
    })

    it('returns a stable value', () => {
      const first = getHardwareConcurrency()
      const second = getHardwareConcurrency()

      expect(second).toBe(first)
    })
  })
})

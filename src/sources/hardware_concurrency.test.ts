import { getBrowserMajorVersion, getBrowserVersion, isGecko, isSafari } from '../../tests/utils'
import getHardwareConcurrency, { getUnstableHardwareConcurrency } from './hardware_concurrency'

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

      // Firefox 143+ returns a tiered value (4 or 8) to stabilize fingerprint across browsing modes
      if (isFirefox143OrNewer()) {
        expect(result === 4 || result === 8).toBeTrue()
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

  describe('unstableHardwareConcurrency', () => {
    it('always returns the raw value regardless of browser', () => {
      const result = getUnstableHardwareConcurrency()
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
      const first = getUnstableHardwareConcurrency()
      const second = getUnstableHardwareConcurrency()

      expect(second).toBe(first)
    })
  })
})

function isFirefox143OrNewer() {
  const browserVersion = getBrowserMajorVersion() ?? 0
  return isGecko() && browserVersion >= 143
}

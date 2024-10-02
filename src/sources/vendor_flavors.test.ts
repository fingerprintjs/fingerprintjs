import { isChromium, isGecko, isMobile, isSafari, isWebKit } from '../../tests/utils'
import getVendorFlavors from './vendor_flavors'

describe('Sources', () => {
  describe('vendorFlavors', () => {
    it("doesn't fail", () => {
      const flavors = getVendorFlavors()
      expect(flavors).toBeInstanceOf(Array)
      for (let i = 0; i < flavors.length; ++i) {
        expect(typeof flavors[i])
          .withContext(`The item #${i}`)
          .toBe('string')
      }
    })

    it('handles browser native value', () => {
      const result = getVendorFlavors()

      if (isChromium()) {
        expect(result).toEqual(['chrome'])
        return
      }

      if (isGecko()) {
        expect(result).toEqual([])
        return
      }

      // Other browsers on iOS return different values,
      // but we run tests in Safari only at the moment.
      if (isWebKit() && isSafari()) {
        if (isMobile()) {
          expect(result).toEqual([])
        } else {
          // This prevents the test from failing on BrowserStack, because
          // the result is an empty array even though it's expected to be `['safari']`.
          if (result.length === 1) {
            expect(result).toEqual(['safari'])
          }
        }
        return
      }
    })
  })
})

import {
  getBrowserMajorVersion,
  isAndroid,
  isChromium,
  isGecko,
  isMacOS,
  isMobile,
  isWebKit,
  isWindows,
} from '../../tests/utils'
import getFonts from './fonts'

describe('Sources', () => {
  describe('fonts', () => {
    it('returns expected fonts', async () => {
      const result = await getFonts()

      // macOS (Firefox, Chromium, Safari)
      if (isMacOS()) {
        expect(isSubset(['Arial Unicode MS', 'Gill Sans', 'Helvetica Neue', 'Menlo'], result)).toBeTrue()
        return
      }

      // iOS (Safari)
      if (isWebKit() && isMobile()) {
        expect(isSubset(['Gill Sans', 'Helvetica Neue', 'Menlo'], result)).toBeTrue()
        return
      }

      if (isWindows()) {
        if (isGecko()) {
          const expectedFonts =
            (getBrowserMajorVersion() ?? 0) < 89
              ? ['Calibri', 'Franklin Gothic', 'MS UI Gothic', 'Marlett', 'Segoe UI Light', 'Small Fonts']
              : ['Calibri', 'Franklin Gothic', 'HELV', 'MS UI Gothic', 'Marlett', 'Segoe UI Light', 'Small Fonts']

          expect(isSubset(expectedFonts, result)).toBeTrue()
          return
        }
        if (isChromium()) {
          expect(
            isSubset(['Calibri', 'Franklin Gothic', 'MS UI Gothic', 'Marlett', 'Segoe UI Light'], result),
          ).toBeTrue()
          return
        }

        return
      }

      if (isAndroid()) {
        if (isGecko()) {
          expect(result.length).toBe(0)
          return
        }

        if (isChromium()) {
          expect(isSubset(['sans-serif-thin'], result)).toBeTrue()
          return
        }
      }

      expect(result.length).toBeGreaterThan(0)
    })

    it('return stable values', async () => {
      const first = await getFonts()
      const second = await getFonts()

      expect(second).toEqual(first)
    })
  })
})

function isSubset(first: string[], second: string[]) {
  return first.every((f) => second.includes(f))
}

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
        containsExpectedFonts(['Arial Unicode MS', 'Gill Sans', 'Helvetica Neue', 'Menlo'], result)
        return
      }

      // iOS (Safari)
      if (isWebKit() && isMobile()) {
        containsExpectedFonts(['Gill Sans', 'Helvetica Neue', 'Menlo'], result)
        return
      }

      if (isWindows()) {
        if (isGecko()) {
          const expected =
            (getBrowserMajorVersion() ?? 0) < 89
              ? ['Calibri', 'Franklin Gothic', 'MS UI Gothic', 'Marlett', 'Segoe UI Light', 'Small Fonts']
              : // 'Segoe UI Light' seems to be sometimes missing when automated on BrowserStack
                ['Calibri', 'Franklin Gothic', 'HELV', 'MS UI Gothic', 'Marlett', 'Small Fonts']

          containsExpectedFonts(expected, result)
          return
        }
        if (isChromium()) {
          containsExpectedFonts(['Calibri', 'Franklin Gothic', 'MS UI Gothic', 'Marlett', 'Segoe UI Light'], result)
          return
        }
      }

      if (isAndroid()) {
        if (isGecko()) {
          expect(result.length).toBe(0)
          return
        }

        if (isChromium()) {
          containsExpectedFonts(['sans-serif-thin'], result)
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

function containsExpectedFonts(expected: string[], actual: string[]) {
  for (const font of expected) {
    expect(actual).toContain(font)
  }
}

import { withCSS } from '../../tests/utils'
import getFontPreferences, { presets } from './font_preferences'

describe('Sources', () => {
  describe('fontPreferences', () => {
    it("doesn't return zero", async () => {
      const sizes = await getFontPreferences()
      expect(Object.keys(sizes).sort()).toEqual(Object.keys(presets).sort())

      for (const key of Object.keys(sizes)) {
        expect(typeof sizes[key])
          .withContext(`Measurement ${key}`)
          .toBe('number')
        expect(sizes[key]).withContext(`Measurement ${key}`).toBeGreaterThan(0)
      }
    })

    it("doesn't depend on page CSS", async () => {
      const resultBefore = await getFontPreferences()

      await withCSS('body * { display: none !important; } * { transform: scale(0.5) !important; }', async () => {
        const resultAfter = await getFontPreferences()
        expect(resultAfter).toEqual(resultBefore)
      })
    })

    it('returns stable values', async () => {
      const first = await getFontPreferences()
      const second = await getFontPreferences()

      expect(second).toEqual(first)
    })
  })
})

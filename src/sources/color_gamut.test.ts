import { withMockMatchMedia } from '../../tests/utils'
import getColorGamut from './color_gamut'

describe('Sources', () => {
  describe('colorGamut', () => {
    it('handles browser native value', () => {
      const colorGamut = getColorGamut()
      expect([undefined, 'srgb', 'p3', 'rec2020']).toContain(colorGamut)
    })

    it('handles missing browser support', async () => {
      await withMockMatchMedia({ 'color-gamut': [undefined] }, true, () => expect(getColorGamut()).toBeUndefined())
    })

    it('handles various color gamuts', async () => {
      await withMockMatchMedia({ 'color-gamut': ['srgb'] }, true, () => expect(getColorGamut()).toBe('srgb'))
      await withMockMatchMedia({ 'color-gamut': ['srgb', 'p3'] }, true, () => expect(getColorGamut()).toBe('p3'))
      await withMockMatchMedia({ 'color-gamut': ['srgb', 'p3', 'rec2020'] }, true, () =>
        expect(getColorGamut()).toBe('rec2020'),
      )
    })
  })
})

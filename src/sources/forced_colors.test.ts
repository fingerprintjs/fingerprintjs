import { withMockMatchMedia } from '../../tests/utils'
import areColorsForced from './forced_colors'

describe('Sources', () => {
  describe('forcedColors', () => {
    it('handles browser native value', () => {
      expect([undefined, true, false]).toContain(areColorsForced())
    })

    it('handles various cases', async () => {
      await withMockMatchMedia({ 'forced-colors': [undefined] }, true, () => expect(areColorsForced()).toBeUndefined())
      await withMockMatchMedia({ 'forced-colors': ['none'] }, true, () => expect(areColorsForced()).toBeFalse())
      await withMockMatchMedia({ 'forced-colors': ['active'] }, true, () => expect(areColorsForced()).toBeTrue())
    })
  })
})

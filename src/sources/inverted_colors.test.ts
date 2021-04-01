import { withMockMatchMedia } from '../../tests/utils'
import areColorsInverted from './inverted_colors'

describe('Sources', () => {
  describe('invertedColors', () => {
    it('handles browser native value', () => {
      expect([undefined, true, false]).toContain(areColorsInverted())
    })

    it('handles various cases', async () => {
      await withMockMatchMedia({ 'inverted-colors': [undefined] }, true, () =>
        expect(areColorsInverted()).toBeUndefined(),
      )
      await withMockMatchMedia({ 'inverted-colors': ['none'] }, true, () => expect(areColorsInverted()).toBeFalse())
      await withMockMatchMedia({ 'inverted-colors': ['inverted'] }, true, () => expect(areColorsInverted()).toBeTrue())
    })
  })
})

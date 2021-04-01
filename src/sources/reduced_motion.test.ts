import { withMockMatchMedia } from '../../tests/utils'
import isMotionReduced from './reduced_motion'

describe('Sources', () => {
  describe('reducedMotion', () => {
    it('handles browser native value', () => {
      expect([undefined, true, false]).toContain(isMotionReduced())
    })

    it('handles various cases', async () => {
      await withMockMatchMedia({ 'prefers-reduced-motion': [undefined] }, true, () =>
        expect(isMotionReduced()).toBeUndefined(),
      )
      await withMockMatchMedia({ 'prefers-reduced-motion': ['no-preference'] }, true, () =>
        expect(isMotionReduced()).toBeFalse(),
      )
      await withMockMatchMedia({ 'prefers-reduced-motion': ['reduce'] }, true, () =>
        expect(isMotionReduced()).toBeTrue(),
      )
    })
  })
})

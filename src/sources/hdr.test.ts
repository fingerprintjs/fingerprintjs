import { withMockMatchMedia } from '../../tests/utils'
import isHDR from './hdr'

describe('Sources', () => {
  describe('hdr', () => {
    it('handles browser native value', () => {
      expect([undefined, true, false]).toContain(isHDR())
    })

    it('handles various cases', async () => {
      await withMockMatchMedia({ 'dynamic-range': [undefined] }, true, () => expect(isHDR()).toBeUndefined())
      await withMockMatchMedia({ 'dynamic-range': ['high'] }, true, () => expect(isHDR()).toBeTrue())
      await withMockMatchMedia({ 'dynamic-range': ['standard'] }, true, () => expect(isHDR()).toBeFalse())
    })
  })
})

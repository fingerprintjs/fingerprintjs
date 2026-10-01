import { isMobile, isTablet, isWebKit, withMockMatchMedia } from '../../tests/utils'

import isHDR from './hdr'

describe('Sources', () => {
  describe('hdr', () => {
    it('handles browser native value', () => {
      expect([undefined, true, false]).toContain(isHDR())
    })

    it('handles various cases', async () => {
      // Mobile WebKit is excluded because the value changes in Low Power Mode
      if (isWebKit() && (isMobile() || isTablet())) {
        await withMockMatchMedia({ 'dynamic-range': ['high'] }, true, () => expect(isHDR()).toBeUndefined())
        await withMockMatchMedia({ 'dynamic-range': ['standard'] }, true, () => expect(isHDR()).toBeUndefined())
        return
      }

      await withMockMatchMedia({ 'dynamic-range': [undefined] }, true, () => expect(isHDR()).toBeUndefined())
      await withMockMatchMedia({ 'dynamic-range': ['high'] }, true, () => expect(isHDR()).toBeTrue())
      await withMockMatchMedia({ 'dynamic-range': ['standard'] }, true, () => expect(isHDR()).toBeFalse())
    })
  })
})

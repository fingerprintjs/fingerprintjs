import { withMockMatchMedia } from '../../tests/utils'
import getMonochromeDepth from './monochrome'

describe('Sources', () => {
  describe('monochrome', () => {
    it('handles browser native value', () => {
      expect(['undefined', 'number']).toContain(typeof getMonochromeDepth())
    })

    it('handles various cases', async () => {
      await withMockMatchMedia({ monochrome: [undefined] }, true, () => expect(getMonochromeDepth()).toBeUndefined())
      await withMockMatchMedia({ monochrome: [0] }, true, () => expect(getMonochromeDepth()).toBe(0))
      await withMockMatchMedia({ monochrome: [8] }, true, () => expect(getMonochromeDepth()).toBe(8))
      await withMockMatchMedia({ monochrome: [10] }, true, () => expect(getMonochromeDepth()).toBe(10))
    })

    it('returns a stable value', () => {
      const first = getMonochromeDepth()
      const second = getMonochromeDepth()

      expect(second).toBe(first)
    })
  })
})

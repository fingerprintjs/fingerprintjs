import getScreenResolution from './screen_resolution'

describe('Sources', () => {
  describe('screenResolution', () => {
    it('handles browser native value', () => {
      const result = getScreenResolution()

      expect(result[0]).toBeGreaterThan(0)
      expect(result[1]).toBeGreaterThan(0)
    })

    it('returns stable values', () => {
      const first = getScreenResolution()
      const second = getScreenResolution()

      expect(second).toEqual(first)
    })
  })
})

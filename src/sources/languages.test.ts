import getLanguages from './languages'

describe('Sources', () => {
  describe('languages', () => {
    it('handles browser native value', () => {
      const result = getLanguages()
      expect(result.length).toBeGreaterThan(0)
    })

    it('returns a stable value', () => {
      const first = getLanguages()
      const second = getLanguages()

      expect(second).toEqual(first)
    })
  })
})

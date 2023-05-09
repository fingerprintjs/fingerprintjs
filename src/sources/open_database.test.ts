import getOpenDatabase from './open_database'

describe('Sources', () => {
  describe('openDatabase', () => {
    it('returns boolean', () => {
      expect(getOpenDatabase()).toBeInstanceOf(Boolean)
    })
  })
})

import getIndexedDB from './indexed_db'

describe('Sources', () => {
  describe('indexedDB', () => {
    it('returns boolean or undefined depending on the browser', () => {
      expect(getIndexedDB()).toBeInstanceOf(Boolean)
    })
  })
})

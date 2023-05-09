import getLocalStorage from './local_storage'

describe('Sources', () => {
  describe('localStorage', () => {
    it('returns boolean', () => {
      expect(getLocalStorage()).toBeInstanceOf(Boolean)
    })
  })
})

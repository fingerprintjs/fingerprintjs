import getSessionStorage from './session_storage'

describe('Sources', () => {
  describe('sessionStorage', () => {
    it('returns boolean', () => {
      expect(getSessionStorage()).toBeInstanceOf(Boolean)
    })
  })
})

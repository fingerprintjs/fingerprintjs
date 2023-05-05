import getCookiesEnabled from './cookies_enabled'

describe('Sources', () => {
  describe('cookiesEnabled', () => {
    it('returns boolean', () => {
      expect(getCookiesEnabled()).toBeInstanceOf(Boolean)
    })
  })
})

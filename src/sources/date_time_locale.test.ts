import getDateTimeLocale from './date_time_locale'

describe('Sources', () => {
  describe('dateTimeLocale', () => {
    it('returns string representing dateTime locale', () => {
      const result = getDateTimeLocale()
      expect(typeof result).toBe('string')
      // The combinations returned as results for the current test suite specified browsers are: "en", "en-US", "en-GB".
      expect(result).toMatch(/^en(-[A-Z]{2})?$/)
    })
  })
})

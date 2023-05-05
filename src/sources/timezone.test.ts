import getTimezone from './timezone'

describe('Sources', () => {
  describe('timezone', () => {
    it('returns a tz identifier in all supported browsers', () => {
      const result = getTimezone()

      // We expect all modern browsers (with default settings) to return a TZ identifier,
      // like 'Europe/Berlin' and not 'UTC' or 'PST8PDT' as an example.
      expect(result).toMatch(/^[a-z]+\/[a-z_]+$/gi)
    })
  })
})

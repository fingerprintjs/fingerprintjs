import getTimezoneName from './timezone_name'

describe('Sources', () => {
  describe('timezoneName', () => {
    it('returns expected value', () => {
      const result = getTimezoneName()
      expect(result).toBeDefined()

      // Some devices on BrowserStack return 'UTC', some '+00:00'.
      if (result === 'UTC' || /^[+-]\d{2}:\d{2}$/.test(String(result))) {
        return
      }

      // We expect all modern browsers (with default settings) to return a timezone identifier,
      // like 'Europe/Berlin' or 'America/Argentina/Buenos_Aires'.
      expect(result).toMatch(/^([a-z]\/+)?[a-z]+\/[a-z_]+$/gi)
    })
  })
})

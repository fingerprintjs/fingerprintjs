import getDateTimeLocale from './date_time_locale'

// This interface is not exported from lib.es5.d.ts, so it has been copy/pasted here to allow referencing it during
// the initialization of the spy and to satisfy the TypeScript definition.
interface ResolvedDateTimeFormatOptions {
  locale: string
  calendar: string
  numberingSystem: string
  timeZone: string
}

describe('Sources', () => {
  describe('dateTimeLocale', () => {
    describe('cases for browsers that have support for DateTimeFormat locale', () => {
      it('returns string representing dateTime locale', () => {
        const result = getDateTimeLocale()
        expect(typeof result).toBe('string')
        // The combinations returned as results for the current test suite specified browsers are:
        // "en", "en-US", "en-GB".
        expect(result).toMatch(/^en(-[A-Z]{2})?$/)
      })
    })

    describe("edge cases for browsers that don't support Intl or locale", () => {
      let originalIntl: typeof Intl

      beforeEach(() => {
        originalIntl = window.Intl
      })

      afterEach(() => {
        window.Intl = originalIntl
      })
      it('should return an empty string if Intl.DateTimeFormat is not supported', () => {
        window.Intl = undefined as unknown as typeof Intl

        const result = getDateTimeLocale()
        expect(result).toBe('')
      })

      it('should return an empty string if resolvedOptions().locale is undefined', () => {
        spyOn(window.Intl, 'DateTimeFormat').and.returnValue({
          resolvedOptions: () => ({ locale: undefined } as unknown as ResolvedDateTimeFormatOptions),
          format: () => '',
          formatToParts: () => [],
        })

        const result = getDateTimeLocale()
        expect(result).toBe('')
      })
    })
  })
})

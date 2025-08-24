import getDateTimeLocale, { Status } from './date_time_locale'

describe('Sources', () => {
  describe('dateTimeLocale', () => {
    describe('cases for browsers that have support for DateTimeFormat locale', () => {
      it('should return string representing DateTimeFormat locale', () => {
        const result = getDateTimeLocale()
        expect(typeof result).toBe('string')
        // The combinations returned as results for the current test suite specified browsers on the BrowserStack are:
        // "en", "en-US", "en-GB",
        // However, we need to keep in mind that this is an open-source codebase, and developers who contribute might
        // be working in local environments that do not fall into this predefined set. Therefore, it is important
        // that our logic for detecting local test runs is flexible and inclusive, ensuring it works for all
        // contributors regardless of their setup.
        // Examples of locales: "en-US", "zh-Hans-CN", "fr-CA", "es-419", regex formed by following->
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions#:~:text=locale-,The%20BCP%2047,-language%20tag%20for
        // https://datatracker.ietf.org/doc/html/rfc4647#section-3.4
        const localeRegex = /^[a-z]{2,3}(-[A-Za-z]{4})?(-([A-Z]{2}|[0-9]{3}))?(-[A-Za-z0-9]+)*$/
        expect(result).toMatch(localeRegex)
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

      it('should return IntlApiNotSupported status when window.Intl is not available', () => {
        window.Intl = undefined as unknown as typeof Intl

        const result = getDateTimeLocale()
        expect(result).toBe(Status.IntlAPINotSupported)
      })

      it('should return DateTimeFormatNotSupported status when window.Intl.DateTimeFormat is not available', () => {
        window.Intl = {} as typeof Intl
        const result = getDateTimeLocale()
        expect(result).toBe(Status.DateTimeFormatNotSupported)
      })

      it('should return LocaleNotAvailable status if resolvedOptions().locale is undefined', () => {
        spyOn(window.Intl, 'DateTimeFormat').and.returnValue({
          resolvedOptions: () => ({ locale: undefined } as unknown as Intl.ResolvedDateTimeFormatOptions),
          format: () => '',
          formatToParts: () => [],
        })

        const result = getDateTimeLocale()
        expect(result).toBe(Status.LocaleNotAvailable)
      })

      it('should return empty string when resolvedOptions().locale is an empty string', () => {
        spyOn(window.Intl, 'DateTimeFormat').and.returnValue({
          resolvedOptions: () => ({ locale: '' } as Intl.ResolvedDateTimeFormatOptions),
          format: () => '',
          formatToParts: () => [],
        })

        const result = getDateTimeLocale()
        expect(result).toBe('')
      })
    })
  })
})

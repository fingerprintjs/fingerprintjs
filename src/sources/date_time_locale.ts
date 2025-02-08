export const enum Status {
  /** The browser doesn't support Intl API */
  IntlAPINotSupported = -1,
  /** The browser doesn't support DateTimeFormat constructor */
  DateTimeFormatNotSupported = -2,
  /** DateTimeFormat locale is undefined or null */
  LocaleNotAvailable = -3,
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions
 *
 * The return type is a union instead of a const enum due to the difficulty of embedding const enums in other projects.
 * This makes integration simpler and more elegant.
 */
export default function getDateTimeLocale(): string | -1 | -2 | -3 {
  if (!window.Intl) {
    return Status.IntlAPINotSupported
  }

  const DateTimeFormat = window.Intl.DateTimeFormat

  if (!DateTimeFormat) {
    return Status.DateTimeFormatNotSupported
  }

  const locale = DateTimeFormat().resolvedOptions().locale

  if (!locale && locale !== '') {
    return Status.LocaleNotAvailable
  }

  return locale
}

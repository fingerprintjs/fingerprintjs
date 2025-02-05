export const enum SpecialFingerprint {
  /** The browser doesn't support Intl api */
  IntlApiNotSupported = -1,
  /** The browser doesn't support Intl api */
  DateTimeFormatNotSupported = -2,
  /** DateTimeFormat locale is undefined or null */
  LocaleNotAvailable = -3,
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions
 */
export default function getDateTimeLocale(): string | SpecialFingerprint {
  if (!window.Intl) {
    return SpecialFingerprint.IntlApiNotSupported
  }

  const DateTimeFormat = window.Intl.DateTimeFormat

  if (!DateTimeFormat) {
    return SpecialFingerprint.DateTimeFormatNotSupported
  }

  const locale = DateTimeFormat().resolvedOptions().locale

  if (!locale && locale !== '') {
    return SpecialFingerprint.LocaleNotAvailable
  }

  return locale
}

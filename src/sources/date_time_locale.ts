/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions
 */
export default function getDateTimeLocale(): string {
  const DateTimeFormat = window.Intl?.DateTimeFormat
  if (DateTimeFormat) {
    const locale = new DateTimeFormat().resolvedOptions().locale
    if (locale) {
      return locale
    }
  }

  return ''
}

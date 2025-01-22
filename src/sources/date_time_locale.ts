/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions
 */
export default function getDateTimeLocale(): string {
  return getLocaleFromResolvedOption()
}

function getLocaleFromResolvedOption(): string {
  return window.Intl?.DateTimeFormat().resolvedOptions().locale || ''
}

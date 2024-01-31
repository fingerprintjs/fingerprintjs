import { toFloat } from '../utils/data'

export default function getTimezone(): string {
  const DateTimeFormat = window.Intl?.DateTimeFormat
  if (DateTimeFormat) {
    const timezone = new DateTimeFormat().resolvedOptions().timeZone
    if (timezone) {
      return timezone
    }
  }

  // For browsers that don't support timezone names
  // The minus is intentional because the JS offset is opposite to the real offset
  const offset = -getTimezoneOffset()
  return `UTC${offset >= 0 ? '+' : ''}${offset}`
}

function getTimezoneOffset(): number {
  const currentYear = new Date().getFullYear()
  // The timezone offset may change over time due to daylight saving time (DST) shifts.
  // The non-DST timezone offset is used as the result timezone offset.
  // Since the DST season differs in the northern and the southern hemispheres,
  // both January and July timezones offsets are considered.
  return Math.max(
    // `getTimezoneOffset` returns a number as a string in some unidentified cases
    toFloat(new Date(currentYear, 0, 1).getTimezoneOffset()),
    toFloat(new Date(currentYear, 6, 1).getTimezoneOffset()),
  )
}

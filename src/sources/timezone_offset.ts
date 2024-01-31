import { toFloat } from '../utils/data'

export default function getTimezoneOffset(): [number, number] {
  const currentYear = new Date().getFullYear()
  // The timezone offset may change over time due to daylight saving time (DST) shifts,
  // so both January and July timezone offsets are collected.
  return [
    // `getTimezoneOffset` returns a number as a string in some unidentified cases
    toFloat(new Date(currentYear, 0, 1).getTimezoneOffset()),
    toFloat(new Date(currentYear, 6, 1).getTimezoneOffset()),
  ]
}

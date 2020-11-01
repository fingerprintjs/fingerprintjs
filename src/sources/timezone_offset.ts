import { toFloat } from '../utils/data'

export default function getTimezoneOffset(): number {
  // `getTimezoneOffset` returns a number as a string in some unidentified cases
  return toFloat(new Date().getTimezoneOffset())
}

/**
 * @see https://www.w3.org/TR/mediaqueries-5/#dynamic-range
 */
export default function isHDR(): boolean | undefined {
  if (doesMatch('high')) {
    return true
  }
  if (doesMatch('standard')) {
    return false
  }
  return undefined
}

function doesMatch(value: string) {
  return matchMedia(`(dynamic-range: ${value})`).matches
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/inverted-colors
 */
function doesMatch(value: string) {
  return matchMedia(`(inverted-colors: ${value})`).matches
}

export default function areColorsInverted(): boolean | undefined {
  if (doesMatch('inverted')) {
    return true
  }
  if (doesMatch('none')) {
    return false
  }
  return undefined
}

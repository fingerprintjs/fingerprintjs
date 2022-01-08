/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
 */

function doesMatch(value: string) {
  return matchMedia(`(prefers-reduced-motion: ${value})`).matches
}

export default function isMotionReduced(): boolean | undefined {
  if (doesMatch('reduce')) {
    return true
  }
  if (doesMatch('no-preference')) {
    return false
  }
  return undefined
}

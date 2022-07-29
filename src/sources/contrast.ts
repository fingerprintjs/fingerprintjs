export const enum ContrastPreference {
  Less = -1,
  None = 0,
  More = 1,
  // "Max" can be added in future
  ForcedColors = 10,
}

/**
 * @see https://www.w3.org/TR/mediaqueries-5/#prefers-contrast
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast
 */
export default function getContrastPreference(): number | undefined {
  if (doesMatch('no-preference')) {
    return ContrastPreference.None
  }
  // The sources contradict on the keywords. Probably 'high' and 'low' will never be implemented.
  // Need to check it when all browsers implement the feature.
  if (doesMatch('high') || doesMatch('more')) {
    return ContrastPreference.More
  }
  if (doesMatch('low') || doesMatch('less')) {
    return ContrastPreference.Less
  }
  if (doesMatch('forced')) {
    return ContrastPreference.ForcedColors
  }
  return undefined
}

function doesMatch(value: string) {
  return matchMedia(`(prefers-contrast: ${value})`).matches
}

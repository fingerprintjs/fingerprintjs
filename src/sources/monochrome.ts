const maxValueToCheck = 100

/**
 * If the display is monochrome (e.g. black&white), the value will be ≥0 and will mean the number of bits per pixel.
 * If the display is not monochrome, the returned value will be 0.
 * If the browser doesn't support this feature, the returned value will be undefined.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/monochrome
 */
export default function getMonochromeDepth(): number | undefined {
  if (!matchMedia('(min-monochrome: 0)').matches) {
    // The media feature isn't supported by the browser
    return undefined
  }

  // A variation of binary search algorithm can be used here.
  // But since expected values are very small (≤10), there is no sense in adding the complexity.
  for (let i = 0; i <= maxValueToCheck; ++i) {
    if (matchMedia(`(max-monochrome: ${i})`).matches) {
      return i
    }
  }

  throw new Error('Too high value')
}

export type ColorGamut = 'srgb' | 'p3' | 'rec2020'

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color-gamut
 */
export default function getColorGamut(): ColorGamut | undefined {
  // rec2020 includes p3 and p3 includes srgb
  for (const gamut of ['rec2020', 'p3', 'srgb'] as const) {
    if (matchMedia(`(color-gamut: ${gamut})`).matches) {
      return gamut
    }
  }
  return undefined
}

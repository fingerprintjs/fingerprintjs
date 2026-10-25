import { isGecko, isSafariWebKit, isWebKit, isWebKit616OrNewer } from '../utils/browser'
import { replaceNaN, toInt } from '../utils/data'

type ScreenResolution = [number | null, number | null]
type ScreenDimension = 'width' | 'height'

/**
 * A version of the entropy source with stabilization to make it suitable for static fingerprinting.
 * The window resolution is always the document size in private mode of Safari 17,
 * so the window resolution is not used in Safari 17.
 */
export default function getScreenResolution(): ScreenResolution | undefined {
  if (isWebKit() && isWebKit616OrNewer() && isSafariWebKit()) {
    return undefined
  }

  // In Firefox `screen.width` and `screen.height` are reported in CSS pixels that depend on the page zoom, so the
  // component (and therefore the visitor identifier) changes when the page is zoomed.
  // See https://github.com/fingerprintjs/fingerprintjs/issues/98
  if (isGecko()) {
    return getPhysicalScreenResolution()
  }

  return getUnstableScreenResolution()
}

/**
 * A version of the entropy source without stabilization.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function getUnstableScreenResolution(): ScreenResolution {
  const s = screen

  // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
  // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
  // Some browsers even return  screen resolution as not numbers.
  const parseDimension = (value: unknown) => replaceNaN(toInt(value), null)
  const dimensions = [parseDimension(s.width), parseDimension(s.height)] as ScreenResolution
  dimensions.sort().reverse()
  return dimensions
}

/**
 * Returns the physical screen resolution in Firefox, which doesn't depend on the page zoom.
 * In Firefox `devicePixelRatio` is the number of physical pixels per CSS pixel including the page zoom,
 * so the screen size in CSS pixels multiplied by `devicePixelRatio` is the physical screen size.
 */
function getPhysicalScreenResolution(): ScreenResolution {
  const devicePixelRatio = window.devicePixelRatio || 1
  const dimensions = [
    getPhysicalDimension('width', screen.width, devicePixelRatio),
    getPhysicalDimension('height', screen.height, devicePixelRatio),
  ] as ScreenResolution
  // Sorted numerically (largest first) so that the order doesn't depend on the digits of the values
  return dimensions.sort((first, second) => (second ?? 0) - (first ?? 0))
}

function getPhysicalDimension(dimension: ScreenDimension, cssValue: unknown, devicePixelRatio: number): number | null {
  const roundedCssValue = replaceNaN(toInt(cssValue), null)
  if (roundedCssValue === null) {
    return null
  }
  const exactCssValue = getExactDeviceDimension(dimension, roundedCssValue)
  if (exactCssValue === null) {
    // Multiplying the rounded CSS value instead would leave up to ±devicePixelRatio/2 px of zoom-dependent noise,
    // so the dimension is reported as unknown to keep the component stable
    return null
  }
  return Math.round(exactCssValue * devicePixelRatio)
}

/** Firefox stores lengths in app units, 1/60 of a CSS pixel, so there is no sense in finding a more precise value */
const appUnitsPerCssPixel = 60

/**
 * `screen.width` and `screen.height` are rounded to integers, but Firefox evaluates media queries against the exact
 * fractional screen size in CSS pixels, so the exact value is found with a binary search over `min-device-width` and
 * `min-device-height`. Inspired by detect-zoom, which uses the same technique to find the exact device pixel ratio.
 * Returns `null` if the media features behave unexpectedly, e.g. they aren't supported or
 * `screen.width`/`screen.height` are spoofed by an extension while the media queries aren't.
 *
 * @see https://github.com/tombigel/detect-zoom/blob/master/detect-zoom.js The binary search over media queries
 */
function getExactDeviceDimension(dimension: ScreenDimension, roundedValue: number): number | null {
  const matchesMinDeviceDimension = (value: number) => matchMedia(`(min-device-${dimension}: ${value}px)`).matches
  const low = roundedValue - 1
  const high = roundedValue + 1
  // The exact value is within ±0.5px of the rounded one, so these checks fail only if the media features are broken
  if (!matchesMinDeviceDimension(low) || matchesMinDeviceDimension(high)) {
    return null
  }
  return binarySearch(matchesMinDeviceDimension, low, high, 1 / appUnitsPerCssPixel)
}

/**
 * Finds the greatest value in the `[low, high)` range for which `doesMatch` returns `true`, with the given precision.
 * `doesMatch` must be monotonic: `true` up to the sought value and `false` above it.
 */
function binarySearch(doesMatch: (value: number) => boolean, low: number, high: number, precision: number): number {
  // A safety limit that only prevents an endless loop in case the range stops shrinking
  const maxIterations = 20
  for (let i = 0; high - low > precision && i < maxIterations; ++i) {
    const middle = (low + high) / 2
    if (doesMatch(middle)) {
      low = middle
    } else {
      high = middle
    }
  }
  return (low + high) / 2
}

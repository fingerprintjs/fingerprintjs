import { replaceNaN, toInt } from '../utils/data'
import { isSafariWebKit, isWebKit, isWebKit616OrNewer } from '../utils/browser'

type ScreenResolution = [number | null, number | null]

/**
 * A version of the entropy source with stabilization to make it suitable for static fingerprinting.
 * The window resolution is always the document size in private mode of Safari 17,
 * so the window resolution is not used in Safari 17.
 */
export default function getScreenResolution(): ScreenResolution | undefined {
  if (isWebKit() && isWebKit616OrNewer() && isSafariWebKit()) {
    return undefined
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

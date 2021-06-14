import { replaceNaN, toInt } from '../utils/data'

export default function getScreenResolution(): [number | null, number | null] {
  const s = screen

  // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
  // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
  // Some browsers even return  screen resolution as not numbers.
  const parseDimension = (value: unknown) => replaceNaN(toInt(value), null)
  const dimensions = [parseDimension(s.width), parseDimension(s.height)] as [number | null, number | null]
  dimensions.sort().reverse()
  return dimensions
}

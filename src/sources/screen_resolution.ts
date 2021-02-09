import { toInt } from '../utils/data'

export default function getScreenResolution(): [number, number] {
  const s = screen

  // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
  // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
  const dimensions = [toInt(s.width), toInt(s.height)] as [number, number]
  dimensions.sort().reverse()
  return dimensions
}

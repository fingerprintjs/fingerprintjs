import { toInt } from '../utils/data'

export default function getAvailableScreenResolution(): [number, number] | undefined {
  const s = screen

  if (s.availWidth && s.availHeight) {
    // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
    // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
    const dimensions = [toInt(s.availWidth), toInt(s.availHeight)] as [number, number]
    dimensions.sort().reverse()
    return dimensions
  }

  return undefined
}

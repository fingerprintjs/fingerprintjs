import { replaceNaN, toFloat } from '../utils/data'

export default function getDeviceMemory(): number | undefined {
  // `navigator.deviceMemory` is a string containing a number in some unidentified cases
  return replaceNaN(toFloat(navigator.deviceMemory), undefined)
}

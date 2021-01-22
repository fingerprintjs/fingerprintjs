import { replaceNaN, toInt } from '../utils/data'

export default function getHardwareConcurrency(): number | undefined {
  // sometimes hardware concurrency is a string
  return replaceNaN(toInt(navigator.hardwareConcurrency), undefined)
}

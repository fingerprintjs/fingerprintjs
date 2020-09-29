import { toInt } from '../utils/data'

export default function getHardwareConcurrency(): number {
  try {
    // sometimes hardware concurrency is a string
    const concurrency = toInt(navigator.hardwareConcurrency)
    return isNaN(concurrency) ? 1 : concurrency
  } catch (e) {
    return 1
  }
}

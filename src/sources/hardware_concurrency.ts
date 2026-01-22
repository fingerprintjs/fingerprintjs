import { isGecko, isGecko120OrNewer } from '../utils/browser'
import { replaceNaN, toInt } from '../utils/data'

export default function getHardwareConcurrency(): number | undefined {
  // Firefox 120+ spoofs hardwareConcurrency in private browsing and strict ETP mode
  if (isGecko() && isGecko120OrNewer()) {
    return undefined
  }

  // sometimes hardware concurrency is a string
  return replaceNaN(toInt(navigator.hardwareConcurrency), undefined)
}

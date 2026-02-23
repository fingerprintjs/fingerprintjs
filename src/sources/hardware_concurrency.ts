import { isGecko, isGecko143OrNewer } from '../utils/browser'
import { replaceNaN, toInt } from '../utils/data'

/**
 * A version of the entropy source with stabilization to make it suitable for static fingerprinting.
 *
 * Firefox 143+ spoofs hardwareConcurrency (NavigatorHWConcurrency) in private browsing and strict ETP mode,
 * so the value is not used in Firefox 143+.
 *
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=1978414 Firefox processor count spoofing
 */
export default function getHardwareConcurrency(): number | undefined {
  if (isGecko() && isGecko143OrNewer()) {
    return undefined
  }

  return getUnstableHardwareConcurrency()
}

/**
 * A version of the entropy source without stabilization.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function getUnstableHardwareConcurrency(): number | undefined {
  // sometimes hardware concurrency is a string
  return replaceNaN(toInt(navigator.hardwareConcurrency), undefined)
}

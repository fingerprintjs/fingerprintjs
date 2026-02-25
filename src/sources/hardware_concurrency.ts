import { isGecko, isGecko143OrNewer } from '../utils/browser'
import { replaceNaN, toInt } from '../utils/data'

/**
 * A version of the entropy source with stabilization to make it suitable for static fingerprinting.
 *
 * Firefox 143+ spoofs hardwareConcurrency (NavigatorHWConcurrency) in private browsing and strict ETP mode
 * using tiered values: ≤4 cores -> 4, >4 cores -> 8. We apply the same tiering to stabilize the fingerprint
 * across all browsing modes, since the tiering function is idempotent.
 *
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=1978414 Firefox processor count spoofing
 * @see https://searchfox.org/firefox-main/source/dom/workers/RuntimeService.cpp#2057:~:text=if%20(MOZ_UNLIKELY(aRFPTiered))%20%7B
 */
export default function getHardwareConcurrency(): number | undefined {
  const value = getUnstableHardwareConcurrency()

  if (value !== undefined && isGecko() && isGecko143OrNewer()) {
    return value >= 8 ? 8 : 4
  }

  return value
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

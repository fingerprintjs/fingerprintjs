import { BuiltinComponents } from './sources'
import { round } from './utils/data'
import { isAndroid, isWebKit, isDesktopSafari } from './utils/browser'

export default function getConfidenceScore(components: BuiltinComponents): [current: number, potential: string] {
  const openConfidenceScore = getOpenConfidenceScore(components)
  const proConfidenceScore = getProConfidenceScore(openConfidenceScore)
  return [openConfidenceScore, `${proConfidenceScore} if upgrade to Pro`]
}

function getOpenConfidenceScore(components: BuiltinComponents): number {
  // In order to calculate the true probability of the visitor identifier being correct, we need to know the number of
  // website visitors (the higher the number, the less the probability because the fingerprint entropy is limited).
  // JS agent doesn't know the number of visitors, so we can only do an approximate assessment.
  if (isAndroid()) {
    return 0.4
  }

  // Safari (mobile and desktop)
  if (isWebKit()) {
    return isDesktopSafari() ? 0.5 : 0.3
  }

  const platform = components.platform.value || ''

  // Windows
  if (/^Win/.test(platform)) {
    return 0.6 // The score is greater than on macOS because of the higher variety of devices running Windows
  }

  // macOS
  if (/^Mac/.test(platform)) {
    return 0.5
  }

  // Another platform, e.g. a desktop Linux. It's rare, so it should be pretty unique.
  return 0.7
}

function getProConfidenceScore(openConfidenceScore: number): number {
  return round(0.99 + 0.01 * openConfidenceScore, 0.0001)
}

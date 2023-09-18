import { BuiltinComponents } from './sources'
import { round } from './utils/data'
import { isAndroid, isWebKit, isDesktopWebKit, isWebKit616OrNewer, isSafariWebKit } from './utils/browser'

export interface Confidence {
  /**
   * A number between 0 and 1 that tells how much the agent is sure about the visitor identifier.
   * The higher the number, the higher the chance of the visitor identifier to be true.
   */
  score: number
  /**
   * Additional details about the score as a human-readable text
   */
  comment?: string
}

export const commentTemplate = '$ if upgrade to Pro: https://fpjs.dev/pro'

export default function getConfidence(components: Pick<BuiltinComponents, 'platform'>): Confidence {
  const openConfidenceScore = getOpenConfidenceScore(components)
  const proConfidenceScore = deriveProConfidenceScore(openConfidenceScore)
  return { score: openConfidenceScore, comment: commentTemplate.replace(/\$/g, `${proConfidenceScore}`) }
}

function getOpenConfidenceScore(components: Pick<BuiltinComponents, 'platform'>): number {
  // In order to calculate the true probability of the visitor identifier being correct, we need to know the number of
  // website visitors (the higher the number, the less the probability because the fingerprint entropy is limited).
  // JS agent doesn't know the number of visitors, so we can only do an approximate assessment.
  if (isAndroid()) {
    return 0.4
  }

  // Safari (mobile and desktop)
  if (isWebKit()) {
    return isDesktopWebKit() && !(isWebKit616OrNewer() && isSafariWebKit()) ? 0.5 : 0.3
  }

  const platform = 'value' in components.platform ? components.platform.value : ''

  // Windows
  if (/^Win/.test(platform)) {
    // The score is greater than on macOS because of the higher variety of devices running Windows.
    // Chrome provides more entropy than Firefox according too
    // https://netmarketshare.com/browser-market-share.aspx?options=%7B%22filter%22%3A%7B%22%24and%22%3A%5B%7B%22platform%22%3A%7B%22%24in%22%3A%5B%22Windows%22%5D%7D%7D%5D%7D%2C%22dateLabel%22%3A%22Trend%22%2C%22attributes%22%3A%22share%22%2C%22group%22%3A%22browser%22%2C%22sort%22%3A%7B%22share%22%3A-1%7D%2C%22id%22%3A%22browsersDesktop%22%2C%22dateInterval%22%3A%22Monthly%22%2C%22dateStart%22%3A%222019-11%22%2C%22dateEnd%22%3A%222020-10%22%2C%22segments%22%3A%22-1000%22%7D
    // So we assign the same score to them.
    return 0.6
  }

  // macOS
  if (/^Mac/.test(platform)) {
    // Chrome provides more entropy than Safari and Safari provides more entropy than Firefox.
    // Chrome is more popular than Safari and Safari is more popular than Firefox according to
    // https://netmarketshare.com/browser-market-share.aspx?options=%7B%22filter%22%3A%7B%22%24and%22%3A%5B%7B%22platform%22%3A%7B%22%24in%22%3A%5B%22Mac%20OS%22%5D%7D%7D%5D%7D%2C%22dateLabel%22%3A%22Trend%22%2C%22attributes%22%3A%22share%22%2C%22group%22%3A%22browser%22%2C%22sort%22%3A%7B%22share%22%3A-1%7D%2C%22id%22%3A%22browsersDesktop%22%2C%22dateInterval%22%3A%22Monthly%22%2C%22dateStart%22%3A%222019-11%22%2C%22dateEnd%22%3A%222020-10%22%2C%22segments%22%3A%22-1000%22%7D
    // So we assign the same score to them.
    return 0.5
  }

  // Another platform, e.g. a desktop Linux. It's rare, so it should be pretty unique.
  return 0.7
}

function deriveProConfidenceScore(openConfidenceScore: number): number {
  return round(0.99 + 0.01 * openConfidenceScore, 0.0001)
}

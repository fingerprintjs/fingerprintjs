type HighEntropyValues = {
  architecture?: string
  bitness?: string
  model?: string
  platformVersion?: string
}

// https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData
interface NavigatorUAData {
  brands: Array<{ brand: string; version: string }>
  mobile: boolean
  platform: string
  getHighEntropyValues(hints: string[]): Promise<HighEntropyValues>
}

// GREASE (Generate Random Extensions and Sustain Extensibility) brands are
// intentionally fake entries added by browsers to prevent API ossification.
// They match patterns like "Not_A Brand", "Not(A:Brand", " Not;A Brand", etc.
//
// Chromium reference:
// https://chromium.googlesource.com/chromium/src/+/a893d7b670a423c604b1a1bbdc98f79dc16b2b79/components/embedder_support/user_agent_utils.cc

function isGreaseBrand(brand: string): boolean {
  return /not/i.test(brand)
}

export const enum HighEntropyStatus {
  /** getHighEntropyValues() was blocked by a Permissions Policy */
  NotAllowed = 'not_allowed',
}

export type StableUserAgentData = {
  brands: string[]
  mobile: boolean
  platform: string
  architecture?: string
  bitness?: string
  model?: string
  platformVersion?: string
  /**
   * Present only when high-entropy value collection was blocked by a Permissions Policy.
   * The value is a stable string so it contributes to the fingerprint hash.
   */
  highEntropyStatus?: 'not_allowed'
}

/**
 * Collects browser and OS identity data from the User-Agent Client Hints API.
 * Only available in Chromium-based browsers (Chrome, Edge, Opera, Brave).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/User-Agent_Client_Hints_API
 */
export default async function getUserAgentData(): Promise<StableUserAgentData | undefined> {
  const uaData = (navigator as unknown as { userAgentData?: NavigatorUAData }).userAgentData

  if (!uaData) {
    return undefined
  }

  const filteredBrands = uaData.brands.filter(({ brand }) => !isGreaseBrand(brand)).map(({ brand }) => brand)

  const brands = filteredBrands.length > 1 ? filteredBrands.filter((b) => b !== 'Chromium') : filteredBrands

  const result: StableUserAgentData = {
    brands,
    mobile: uaData.mobile,
    platform: uaData.platform,
  }

  if (uaData.getHighEntropyValues) {
    try {
      const highEntropy = await uaData.getHighEntropyValues(['architecture', 'bitness', 'model', 'platformVersion'])
      result.architecture = highEntropy.architecture
      result.bitness = highEntropy.bitness
      result.model = highEntropy.model
      result.platformVersion = highEntropy.platformVersion
    } catch (error) {
      if (typeof DOMException !== 'undefined' && error instanceof DOMException && error.name === 'NotAllowedError') {
        result.highEntropyStatus = HighEntropyStatus.NotAllowed
      } else {
        throw error
      }
    }
  }

  return result
}

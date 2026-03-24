// https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData
interface UADataValues {
  brands: Array<{ brand: string; version: string }>
  mobile: boolean
  platform: string
  platformVersion: string
  architecture: string
  bitness: string
  model: string
}

interface NavigatorUAData {
  brands: Array<{ brand: string; version: string }>
  mobile: boolean
  platform: string
  getHighEntropyValues(hints: string[]): Promise<Partial<UADataValues>>
}

// GREASE (Generate Random Extensions and Sustain Extensibility) brands are
// intentionally fake entries added by browsers to prevent API ossification.
// They match patterns like "Not_A Brand", "Not(A:Brand", " Not;A Brand", etc.
const isGreaseBrand = (brand: string): boolean => /not/i.test(brand)

export interface StableUserAgentData {
  brands: string[]
  mobile: boolean
  platform: string
  architecture?: string
  bitness?: string
  model?: string
  platformVersion?: string
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

  const brands = uaData.brands
    .filter(({ brand }) => !isGreaseBrand(brand) && brand !== 'Chromium')
    .map(({ brand }) => brand)

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
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        // getHighEntropyValues() can be blocked by a Permissions Policy
      } else {
        throw error
      }
    }
  }

  return result
}

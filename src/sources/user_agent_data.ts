// https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData
interface UADataValues {
    brands: Array<{ brand: string; version: string }>
    mobile: boolean
    platform: string
    platformVersion: string
    architecture: string
    model: string
    uaFullVersion: string
}

interface NavigatorUAData {
    brands: Array<{ brand: string; version: string }>
    mobile: boolean
    platform: string
    getHighEntropyValues(hints: string[]): Promise<Partial<UADataValues>>
}

export type UserAgentData = Pick<UADataValues, 'brands' | 'mobile' | 'platform'> &
    Partial<Pick<UADataValues, 'platformVersion' | 'architecture' | 'model' | 'uaFullVersion'>>

/**
 * Collects browser and OS identity data from the User-Agent Client Hints API.
 * Only available in Chromium-based browsers (Chrome, Edge, Opera, Brave).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/User-Agent_Client_Hints_API
 */
export default async function getUserAgentData(): Promise<UserAgentData | undefined> {
    const uaData = (navigator as unknown as { userAgentData?: NavigatorUAData }).userAgentData

    if (!uaData) {
        return undefined
    }

    const result: UserAgentData = {
        brands: uaData.brands,
        mobile: uaData.mobile,
        platform: uaData.platform,
    }

    if (uaData.getHighEntropyValues) {
        try {
            const highEntropy = await uaData.getHighEntropyValues([
                'architecture',
                'model',
                'platformVersion',
                'uaFullVersion',
            ])
            result.platformVersion = highEntropy.platformVersion
            result.architecture = highEntropy.architecture
            result.model = highEntropy.model
            result.uaFullVersion = highEntropy.uaFullVersion
        } catch {
            // getHighEntropyValues() can be blocked by a Permissions Policy
        }
    }

    return result
}

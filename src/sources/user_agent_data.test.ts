import { isChromium, withMockProperties } from '../../tests/utils'
import getUserAgentData from './user_agent_data'

describe('Sources', () => {
    describe('userAgentData', () => {
        it('returns undefined on non-Chromium browsers', async () => {
            if (isChromium()) {
                return
            }
            expect(await getUserAgentData()).toBeUndefined()
        })

        it('returns an object with the expected shape on Chromium browsers', async () => {
            if (!isChromium()) {
                return
            }
            const result = await getUserAgentData()
            expect(result).not.toBeUndefined()
            expect(Array.isArray(result!.brands)).toBe(true)
            expect(typeof result!.mobile).toBe('boolean')
            expect(typeof result!.platform).toBe('string')
        })

        it('returns undefined when userAgentData is absent', async () => {
            await withMockProperties(navigator, { userAgentData: { get: () => undefined } }, async () => {
                expect(await getUserAgentData()).toBeUndefined()
            })
        })

        it('returns low-entropy fields when getHighEntropyValues is absent', async () => {
            const mockUAData = {
                brands: [{ brand: 'Chromium', version: '120' }],
                mobile: false,
                platform: 'Windows',
            }
            await withMockProperties(navigator, { userAgentData: { get: () => mockUAData } }, async () => {
                const result = await getUserAgentData()
                expect(result).toEqual({
                    brands: [{ brand: 'Chromium', version: '120' }],
                    mobile: false,
                    platform: 'Windows',
                })
            })
        })

        it('includes high-entropy fields when getHighEntropyValues resolves', async () => {
            const mockUAData = {
                brands: [{ brand: 'Google Chrome', version: '120' }],
                mobile: false,
                platform: 'Windows',
                getHighEntropyValues: async () => ({
                    platformVersion: '10.0.0',
                    architecture: 'x86',
                    model: '',
                    uaFullVersion: '120.0.6099.129',
                }),
            }
            await withMockProperties(navigator, { userAgentData: { get: () => mockUAData } }, async () => {
                const result = await getUserAgentData()
                expect(result?.platformVersion).toBe('10.0.0')
                expect(result?.architecture).toBe('x86')
                expect(result?.model).toBe('')
                expect(result?.uaFullVersion).toBe('120.0.6099.129')
            })
        })

        it('falls back to low-entropy fields when getHighEntropyValues throws', async () => {
            const mockUAData = {
                brands: [{ brand: 'Google Chrome', version: '120' }],
                mobile: false,
                platform: 'Linux',
                getHighEntropyValues: async () => {
                    throw new Error('NotAllowedError: Permissions policy violation')
                },
            }
            await withMockProperties(navigator, { userAgentData: { get: () => mockUAData } }, async () => {
                const result = await getUserAgentData()
                expect(result).toEqual({
                    brands: [{ brand: 'Google Chrome', version: '120' }],
                    mobile: false,
                    platform: 'Linux',
                })
            })
        })
    })
})

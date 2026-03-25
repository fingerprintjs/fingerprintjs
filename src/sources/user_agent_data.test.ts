import { withMockProperties } from '../../tests/utils'
import getUserAgentData from './user_agent_data'

describe('Sources', () => {
  describe('userAgentData', () => {
    it('returns undefined when userAgentData API is not available', async () => {
      if ((navigator as unknown as { userAgentData?: unknown }).userAgentData) {
        return
      }
      expect(await getUserAgentData()).toBeUndefined()
    })

    it('returns an object with the expected shape when userAgentData is available', async () => {
      if (!(navigator as unknown as { userAgentData?: unknown }).userAgentData) {
        return
      }
      const result = await getUserAgentData()
      expect(result).toBeDefined()
      if (result === undefined) {
        return
      }
      expect(Array.isArray(result.brands)).toBe(true)
      expect(result.brands.every((b) => typeof b === 'string')).toBe(true)
      expect(typeof result.mobile).toBe('boolean')
      expect(typeof result.platform).toBe('string')
      expect('uaFullVersion' in result).toBe(false)
    })

    it('returns undefined when userAgentData is absent', async () => {
      await withMockProperties(navigator, { userAgentData: { get: () => undefined } }, async () => {
        expect(await getUserAgentData()).toBeUndefined()
      })
    })

    it('returns normalized brands without version numbers when getHighEntropyValues is absent', async () => {
      const mockUAData = {
        brands: [{ brand: 'Google Chrome', version: '120' }],
        mobile: false,
        platform: 'Windows',
      }
      await withMockProperties(navigator, { userAgentData: { get: () => mockUAData } }, async () => {
        const result = await getUserAgentData()
        expect(result).toEqual({
          brands: ['Google Chrome'],
          mobile: false,
          platform: 'Windows',
        })
      })
    })

    it('filters out GREASE brands', async () => {
      const mockUAData = {
        brands: [
          { brand: 'Not_A Brand', version: '99' },
          { brand: 'Not(A:Brand', version: '8' },
          { brand: ' Not;A Brand', version: '99' },
          { brand: 'Google Chrome', version: '120' },
        ],
        mobile: false,
        platform: 'Windows',
      }
      await withMockProperties(navigator, { userAgentData: { get: () => mockUAData } }, async () => {
        const result = await getUserAgentData()
        expect(result?.brands).toEqual(['Google Chrome'])
      })
    })

    it('removes Chromium from the brand list', async () => {
      const mockUAData = {
        brands: [
          { brand: 'Chromium', version: '120' },
          { brand: 'Google Chrome', version: '120' },
        ],
        mobile: false,
        platform: 'Windows',
      }
      await withMockProperties(navigator, { userAgentData: { get: () => mockUAData } }, async () => {
        const result = await getUserAgentData()
        expect(result?.brands).toEqual(['Google Chrome'])
        expect(result?.brands).not.toContain('Chromium')
      })
    })

    it('returns brands as version-free strings', async () => {
      const mockUAData = {
        brands: [
          { brand: 'Google Chrome', version: '120' },
          { brand: 'Microsoft Edge', version: '120' },
        ],
        mobile: false,
        platform: 'Windows',
      }
      await withMockProperties(navigator, { userAgentData: { get: () => mockUAData } }, async () => {
        const result = await getUserAgentData()
        expect(result?.brands).toEqual(['Google Chrome', 'Microsoft Edge'])
      })
    })

    it('includes high-entropy fields including bitness when getHighEntropyValues resolves', async () => {
      const mockUAData = {
        brands: [{ brand: 'Google Chrome', version: '120' }],
        mobile: false,
        platform: 'Windows',
        getHighEntropyValues: async () => ({
          platformVersion: '10.0.0',
          architecture: 'x86',
          bitness: '64',
          model: '',
        }),
      }
      await withMockProperties(navigator, { userAgentData: { get: () => mockUAData } }, async () => {
        const result = await getUserAgentData()
        if (result === undefined) {
          throw new Error('Expected userAgentData result to be defined')
        }
        expect(result.platformVersion).toBe('10.0.0')
        expect(result.architecture).toBe('x86')
        expect(result.bitness).toBe('64')
        expect(result.model).toBe('')
        expect('uaFullVersion' in result).toBe(false)
      })
    })

    it('does not include uaFullVersion in the result', async () => {
      const mockUAData = {
        brands: [{ brand: 'Google Chrome', version: '120' }],
        mobile: false,
        platform: 'Windows',
        getHighEntropyValues: async () => ({
          platformVersion: '10.0.0',
          architecture: 'x86',
          bitness: '64',
          model: '',
        }),
      }
      await withMockProperties(navigator, { userAgentData: { get: () => mockUAData } }, async () => {
        const result = await getUserAgentData()
        expect('uaFullVersion' in Object(result)).toBe(false)
      })
    })

    it('falls back to low-entropy fields only when getHighEntropyValues throws NotAllowedError', async () => {
      const mockUAData = {
        brands: [{ brand: 'Google Chrome', version: '120' }],
        mobile: false,
        platform: 'Linux',
        getHighEntropyValues: async () => {
          throw new DOMException('Permission denied', 'NotAllowedError')
        },
      }
      await withMockProperties(navigator, { userAgentData: { get: () => mockUAData } }, async () => {
        const result = await getUserAgentData()
        expect(result).toEqual({
          brands: ['Google Chrome'],
          mobile: false,
          platform: 'Linux',
        })
      })
    })

    it('returns a stable value', async () => {
      const first = await getUserAgentData()
      const second = await getUserAgentData()

      expect(second).toEqual(first)
    })

    it('re-throws unexpected errors from getHighEntropyValues', async () => {
      const unexpectedError = new TypeError('Internal browser error')
      const mockUAData = {
        brands: [{ brand: 'Google Chrome', version: '120' }],
        mobile: false,
        platform: 'Windows',
        getHighEntropyValues: async () => {
          throw unexpectedError
        },
      }
      await withMockProperties(navigator, { userAgentData: { get: () => mockUAData } }, async () => {
        await expectAsync(getUserAgentData()).toBeRejectedWith(unexpectedError)
      })
    })
  })
})

import { getBrowserMajorVersion, isChromium, isGecko, isMobile, isSafari, isWebKit } from '../../tests/utils'
import getAudioFingerprint, { getMiddle, SpecialFingerprint, stabilize } from './audio'

describe('Sources', () => {
  describe('audio', () => {
    it('returns expected value', async () => {
      const result = (await getAudioFingerprint())()

      if (doesBrowserSuspendAudioContext()) {
        expect(result).toBe(SpecialFingerprint.KnownForSuspending)
      } else if (isGecko()) {
        expect(result).toBeGreaterThan(0.000169)
        expect(result).toBeLessThan(0.00017)
      } else if (isWebKit()) {
        if ('OfflineAudioContext' in window) {
          expect(result).toBeGreaterThan(0.000058)
          expect(result).toBeLessThan(0.000066)
        } else {
          expect(result).toBeGreaterThan(0.000113)
          expect(result).toBeLessThan(0.000114)
        }
      } else if (isChromium()) {
        expect(result).toBeGreaterThan(0.00006)
        expect(result).toBeLessThan(0.00009)
      } else {
        throw new Error('Unexpected browser')
      }
    })

    it('returns a stable value', async () => {
      const finishFirst = await getAudioFingerprint()
      const first = finishFirst()
      const finishSecond = await getAudioFingerprint()
      const second = finishSecond()
      expect(first).toBe(second)
      expect(finishFirst()).toBe(first)
    })
  })

  describe('getMiddle helper', () => {
    it('calculates properly and ignores zeros', () => {
      const signal = [
        0, -5.92384345, -3.39578492, -4.39564854, 0, -3.89384529, -8.92384234, -5.01429423, -4.12045834, -3.93298453, 0,
      ]
      expect(getMiddle(signal)).toEqual(-6.15981363)
    })
  })

  describe('stabilize helper', () => {
    it('calculates properly', () => {
      expect(stabilize(0.000123456789, 2)).toBe(0.00012)
      expect(stabilize(0.000000012345, 2)).toBe(0.000000012)
      expect(stabilize(-0.000123456789, 2)).toBe(-0.00012)
      expect(stabilize(0.000123456789, 7)).toBe(0.0001234568)
      expect(stabilize(0.000123456789, 2.2)).toBe(0.000125)
      expect(stabilize(0.000123456789, 2.5)).toBe(0.000124)
      expect(stabilize(0.000123456789, 6.2)).toBe(0.000123457)
      expect(stabilize(0.000123456789, 15.5)).toBe(0.000123456789)
      expect(stabilize(0.000123456789, 5.2)).toBe(0.000123455)
      expect(stabilize(0.000123456789, 5.5)).toBe(0.000123456)
    })
  })
})

function doesBrowserSuspendAudioContext() {
  // WebKit has stopped telling its real version in the user-agent string since version 605.1.15,
  // therefore the browser version has to be checked instead of the engine version.
  return isSafari() && isMobile() && (getBrowserMajorVersion() ?? 0) < 12
}

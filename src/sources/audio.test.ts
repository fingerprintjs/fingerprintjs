import { getBrowserMajorVersion, isMobile, isSafari, isTrident } from '../../tests/utils'
import getAudioFingerprint, { audioFingerprintSource, SpecialFingerprint } from './audio'

describe('Sources', () => {
  describe('audio', () => {
    it('returns expected value type depending on the browser', async () => {
      const result = await getAudioFingerprint()

      if (isTrident()) {
        expect(result).toBe(SpecialFingerprint.NotSupported)
      } else if (isSafari() && isMobile() && (getBrowserMajorVersion() ?? 0) < 12) {
        // WebKit has stopped telling its real version in the user-agent string since version 605.1.15,
        // therefore the browser version has to be checked instead of the engine version.
        expect(result).toBe(SpecialFingerprint.KnownToSuspend)
      } else {
        expect(result).toBeGreaterThanOrEqual(0)
      }
    })
  })

  describe('audio2', () => {
    it('returns expected value type depending on the browser', async () => {
      const result = audioFingerprintSource()

      if (isTrident()) {
        expect(result).toBe(SpecialFingerprint.NotSupported)
      } else if (isSafari() && isMobile() && (getBrowserMajorVersion() ?? 0) < 12) {
        // WebKit has stopped telling its real version in the user-agent string since version 605.1.15,
        // therefore the browser version has to be checked instead of the engine version.
        expect(result).toBe(SpecialFingerprint.KnownToSuspend)
      } else {
        // A type guard
        if (typeof result !== 'function') {
          throw new Error('Expected to be a function')
        }
        let fingerprint = await result()
        expect(fingerprint).toBeGreaterThanOrEqual(0)
        fingerprint = await result()
        expect(fingerprint).toBeGreaterThanOrEqual(0)
      }
    })
  })
})

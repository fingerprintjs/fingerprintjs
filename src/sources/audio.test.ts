import { getBrowserMajorVersion, isMobile, isSafari, isTrident } from '../../tests/utils'
import getAudioFingerprint, { SpecialFingerprint } from './audio'

describe('Sources', () => {
  describe('audio', () => {
    it('returns expected value type depending on the browser', async () => {
      const result = getAudioFingerprint()

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
        const fingerprint = await result()
        expect(fingerprint).toBeGreaterThanOrEqual(0)
        const newFingerprint = await result()
        expect(newFingerprint).toBe(newFingerprint)
      }
    })
  })
})

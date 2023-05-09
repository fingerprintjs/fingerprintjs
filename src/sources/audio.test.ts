import { getBrowserMajorVersion, isMobile, isSafari } from '../../tests/utils'
import getAudioFingerprint, { SpecialFingerprint } from './audio'

describe('Sources', () => {
  describe('audio', () => {
    it('returns expected value type depending on the browser', async () => {
      const result = getAudioFingerprint()

      if (isUnsupportedBrowser()) {
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

    it('returns a stable value', async () => {
      if (isUnsupportedBrowser()) {
        return
      }

      const first = getAudioFingerprint()
      const second = getAudioFingerprint()

      if (typeof first !== 'function' || typeof second !== 'function') {
        throw new Error('Expected to be a function')
      }

      expect(await second()).toBe(await first())
    })
  })
})

function isUnsupportedBrowser() {
  // WebKit has stopped telling its real version in the user-agent string since version 605.1.15,
  // therefore the browser version has to be checked instead of the engine version.
  return isSafari() && isMobile() && (getBrowserMajorVersion() ?? 0) < 12
}

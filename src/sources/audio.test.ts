import { getBrowserMajorVersion, isMobile, isSafari, isTrident } from '../../tests/utils'
import getAudioFingerprint from './audio'

describe('Sources', () => {
  describe('audio', () => {
    it('returns expected value type depending on the browser', async () => {
      const result = await getAudioFingerprint()

      if (isTrident()) {
        expect(result).toBe(-2)
      } else if (isSafari() && isMobile() && (getBrowserMajorVersion() ?? 0) < 12) {
        // WebKit has stopped telling its real version in the user-agent string since version 605.1.15,
        // therefore the browser version has to be checked instead of the engine version.
        expect(result).toBe(-1)
      } else {
        expect(result).toBeGreaterThanOrEqual(0)
      }
    })
  })
})

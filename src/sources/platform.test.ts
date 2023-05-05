import { isAndroid, isMacOS, isMobile, isSafari, isTablet, isWindows } from '../../tests/utils'
import getPlatform from './platform'

describe('Sources', () => {
  describe('platform', () => {
    it('handles browser native value', () => {
      const result = getPlatform()

      if (isWindows()) {
        expect(['Win32', 'Win64']).toContain(result)
        return
      }

      if (isMacOS()) {
        expect(result).toBe('MacIntel')
        return
      }

      if (isAndroid()) {
        expect(['Linux armv8l', 'Linux aarch64', 'Linux armv81', 'Linux armv7l']).toContain(result)
        return
      }

      if (isSafari() && (isMobile() || isTablet())) {
        expect(result).toBe(isMobile() ? 'iPhone' : 'iPad')
        return
      }
    })
  })
})

import { isChromium, isGecko, isWebKit } from '../../tests/utils'
import getVendor from './vendor'

describe('Sources', () => {
  describe('vendor', () => {
    it('handles browser native value', () => {
      const result = getVendor()

      if (isChromium()) {
        expect(result).toBe('Google Inc.')
        return
      }

      if (isWebKit()) {
        expect(result).toBe('Apple Computer, Inc.')
        return
      }

      if (isGecko()) {
        expect(result).toBe('')
        return
      }
    })
  })
})

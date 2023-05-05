import { isGecko } from '../utils/browser'
import getOsCpu from './os_cpu'

describe('Sources', () => {
  describe('osCpu', () => {
    it('handles browser native value', () => {
      const result = getOsCpu()

      if (isGecko()) {
        expect(typeof result).toBe('string')
        expect(result?.length).toBeGreaterThan(0)
        return
      }

      expect(result).toBe(undefined)
    })
  })
})

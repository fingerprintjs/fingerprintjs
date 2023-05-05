import getHardwareConcurrency from './hardware_concurrency'

describe('Sources', () => {
  describe('hardwareConcurrency', () => {
    it('handles browser native value', () => {
      const result = getHardwareConcurrency()
      expect(result).toBeGreaterThan(0)
    })

    it('returns a stable value', () => {
      const first = getHardwareConcurrency()
      const second = getHardwareConcurrency()

      expect(second).toBe(first)
    })
  })
})

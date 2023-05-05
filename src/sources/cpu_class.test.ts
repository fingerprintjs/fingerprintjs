import getCpuClass from './cpu_class'

describe('Sources', () => {
  describe('cpuClass', () => {
    it('handles browser native value', () => {
      const result = getCpuClass()
      expect(result).toBe(undefined)
    })
  })
})

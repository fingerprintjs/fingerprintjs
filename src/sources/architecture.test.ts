import getArchitecture from './architecture'

describe('Sources', () => {
  describe('architecture', () => {
    it("doesn't fail", () => {
      const result = getArchitecture()
      expect([127, 255]).toContain(result)
    })
  })
})

import getCanvasFingerprint from './canvas'

describe('Sources', () => {
  describe('canvas', () => {
    it('returns stable values', async () => {
      const first = await getCanvasFingerprint()
      const second = await getCanvasFingerprint()

      expect(isDataURL(first.geometry)).toBeTrue()
      expect(isDataURL(first.text)).toBeTrue()

      expect(first.geometry.length).toBeGreaterThan(1000)
      expect(first.text.length).toBeGreaterThan(1000)

      expect(second).toEqual(first)
    })
  })
})

function isDataURL(url: string) {
  return /^data:image\/png;base64,([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(url)
}

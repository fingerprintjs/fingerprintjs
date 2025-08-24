import { getBrowserMajorVersion, isSafari, isSamsungInternet } from '../../tests/utils'
import getCanvasFingerprint, { ImageStatus } from './canvas'

describe('Sources', () => {
  describe('canvas', () => {
    it('returns expected value', async () => {
      const { winding, text, geometry } = await getCanvasFingerprint()

      expect(winding).toBeTrue()

      if (shouldSkip()) {
        expect(text).toBe(ImageStatus.Skipped)
        expect(geometry).toBe(ImageStatus.Skipped)
      } else if (shouldBeUnstable()) {
        expect(text).toBe(ImageStatus.Unstable)
        expect(geometry).toBe(ImageStatus.Unstable)
      } else {
        expect(isDataURL(geometry)).toBeTrue()
        expect(isDataURL(text)).toBeTrue()

        expect(geometry.length).toBeGreaterThan(1000)
        expect(text.length).toBeGreaterThan(1000)
      }
    })

    it('returns stable values', async () => {
      const first = await getCanvasFingerprint()
      const second = await getCanvasFingerprint()
      expect(second).toEqual(first)
    })
  })
})

function shouldSkip() {
  return isSafari() && (getBrowserMajorVersion() ?? 0) >= 17
}

function shouldBeUnstable() {
  return isSamsungInternet() && (getBrowserMajorVersion() ?? 0) < 28
}

function isDataURL(url: string) {
  return /^data:image\/png;base64,([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(url)
}

import getVideoCard from './video_card'
import { isGecko, getBrowserMajorVersion } from '../../tests/utils'

function isWebGLSupported() {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  if (gl && gl instanceof WebGLRenderingContext) {
    return true
  }
  return false
}

describe('Sources', () => {
  describe('videoCard', () => {
    it('to be correctly typed if defined', () => {
      const videoCard = getVideoCard()

      if (!isWebGLSupported()) {
        expect(videoCard).toBeUndefined()
        return
      }

      if (!isGecko() || (getBrowserMajorVersion() ?? Infinity) >= 53) {
        expect(videoCard).toBeTruthy()
      }

      if (videoCard) {
        expect(videoCard).toEqual({
          vendor: jasmine.any(String),
          renderer: jasmine.any(String),
        })
      }
    })
  })
})

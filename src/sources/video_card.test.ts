import getVideoCard from './video_card'
import { isGecko, getBrowserMajorVersion } from '../../tests/utils'

describe('Sources', () => {
  describe('videoCard', () => {
    it('to be correctly typed if defined', () => {
      const videoCard = getVideoCard()

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

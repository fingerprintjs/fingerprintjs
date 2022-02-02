import getVideoCard from './video_card'
import { isGecko } from '../utils/browser'
import { getBrowserMajorVersion } from '../../tests/utils'

describe('Sources', () => {
  describe('videoCard', () => {
    const videoCard = getVideoCard()

    it('to be defined', () => {
      if (!isGecko() || (getBrowserMajorVersion() ?? Infinity) >= 53) {
        expect(videoCard).toBeTruthy()
      }
    })

    it('to be correctly typed if defined', () => {
      if (videoCard) {
        expect(videoCard).toEqual({
          vendor: jasmine.any(String),
          renderer: jasmine.any(String),
        })
      }
    })
  })
})

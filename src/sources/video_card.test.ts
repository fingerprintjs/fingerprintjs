import getVideoCard from './video_card'

describe('Sources', () => {
  describe('videoCard', () => {
    it('to be correctly typed if defined', () => {
      const videoCard = getVideoCard()

      if (videoCard) {
        expect(videoCard).toEqual({
          vendor: jasmine.any(String),
          renderer: jasmine.any(String),
        })
      }
    })
  })
})

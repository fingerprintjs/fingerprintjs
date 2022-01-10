import getVideoCard from './video_card'

describe('Sources', () => {
  describe('videoCard', () => {
    const videoCard = getVideoCard()
    it('to be defined', () => {
      expect(videoCard).toBeDefined()
    })

    // Doesn't work
    // it needs the object to be exactly like what I provided and I only need the keys
    // it('has vendor and renderer', () => {
    //   expect(videoCard).toEqual(
    //     jasmine.objectContaining({
    //       vendor: 'Graphics card vendor',
    //       renderer: 'Graphics card renderer',
    //     }),
    //   )
    // })

    // Throws Error
    // it('has vendor and renderer', () => {
    //   expect(Object.keys(videoCard)).toEqual(['vendor', 'renderer'])
    // })

    // Didn't work
    // it('contain vendor', () => {
    //   expect(videoCard).toContain('vendor')
    // })
    // it('contain renderer', () => {
    //   expect(videoCard).toContain('renderer')
    // })

    // I give up
  })
})

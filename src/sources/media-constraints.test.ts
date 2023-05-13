import getSupportedMediaConstraints from './media-constraints'

describe('getSupportedMediaConstraints', () => {
  it('should return undefined if navigator.mediaDevices.getSupportedConstraints is not supported', async () => {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {},
    })
    const constraints = await getSupportedMediaConstraints()
    expect(constraints).toBeUndefined()
  })
})

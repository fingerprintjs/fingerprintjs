import getMediaRecorderSupportedTypes from './media_recorder'

describe('getMediaRecorderSupportedTypes', () => {
  it('returns an array of strings', () => {
    const supportedTypes = getMediaRecorderSupportedTypes() ?? []
    expect(Array.isArray(supportedTypes)).toBe(true)
    supportedTypes.forEach((type) => {
      expect(typeof type).toBe('string')
    })
  })

  it('returns undefined if MediaRecorder.isTypeSupported is undefined', () => {
    MediaRecorder.isTypeSupported = undefined as unknown as typeof MediaRecorder['isTypeSupported']
    const supportedTypes = getMediaRecorderSupportedTypes()
    expect(supportedTypes).toEqual(undefined)
  })
})

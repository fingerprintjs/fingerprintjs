const MIME_TYPES = [
  'video/webm',
  'audio/webm',
  'video/x-matroska',
  'video/x-matroska;codecs=h264',
  'audio/ogg',
  'video/mp4',
  'audio/mp4',
]

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/isTypeSupported_static
 */
export default function getMediaRecorderSupportedTypes(): string[] | undefined {
  if (typeof MediaRecorder?.isTypeSupported === 'undefined') {
    return undefined
  }
  return MIME_TYPES.filter(MediaRecorder.isTypeSupported)
}

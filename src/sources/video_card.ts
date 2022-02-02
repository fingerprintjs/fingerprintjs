export interface VideoCard {
  vendor: string
  renderer: string
}

/**
 * @see Credits: https://stackoverflow.com/a/49267844
 */
export default function getVideoCard(): VideoCard | undefined {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl')
  if (gl && 'getExtension' in gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    if (debugInfo) {
      return {
        vendor: (gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '').toString(),
        renderer: (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '').toString(),
      }
    }
  }
  return undefined
}

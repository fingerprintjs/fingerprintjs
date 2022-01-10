/*
 * Credits: https://stackoverflow.com/a/49267844
 */

export interface VideoCard {
  vendor: string
  renderer: string
}

export default function getVideoCard(): VideoCard | undefined {
  const gl = document.createElement('canvas').getContext('webgl')
  if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    if (debugInfo) {
      return {
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
      }
    }
  }
  return undefined
}

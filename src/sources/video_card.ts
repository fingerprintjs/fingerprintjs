/*
 * Credits: https://stackoverflow.com/a/49267844
 */

import { withIframe } from '../utils/dom'

export default function getVideoCard() {
  return withIframe((_, { document }) => {
    const gl = document.createElement('canvas').getContext('webgl')
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      }
    }
    return undefined
  })
}

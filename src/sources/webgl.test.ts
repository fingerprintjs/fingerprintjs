import { withMockProperties } from '../../tests/utils'
import { getWebGlBasics, getWebGlExtensions, STATUS_GET_PARAMETER_NOT_A_FUNCTION, STATUS_NO_GL_CONTEXT } from './webgl'

function isWebGLSupported() {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  // Report the result.
  return gl && gl instanceof WebGLRenderingContext
}

describe('Sources', () => {
  const options = {
    cache: {},
  }

  function withMissingGetParameter(action: () => void) {
    return withMockProperties(
      document,
      { createElement: { value: () => ({ getContext: () => ({}), addEventListener: () => undefined }) } },
      action,
    )
  }

  describe('webGlBasics', () => {
    it('should work', () => {
      if (!isWebGLSupported()) {
        expect(getWebGlBasics(options)).toBe(STATUS_NO_GL_CONTEXT)
        return
      }

      const result = getWebGlBasics(options)

      // Type guard
      if (typeof result === 'number') {
        throw new Error('WebGL is missing')
      }

      expect(result.vendor.length).toBeGreaterThan(0)
      expect(result.version.toLocaleLowerCase()).toContain('webgl')
    })

    it('returns corresponding status when `context.getParameter` is absent', async () => {
      await withMissingGetParameter(() => {
        expect(
          getWebGlBasics({
            cache: {},
          }),
        ).toBe(STATUS_GET_PARAMETER_NOT_A_FUNCTION)
      })
    })

    it('is stable', () => {
      const first = getWebGlBasics({ cache: {} })
      const second = getWebGlBasics({ cache: {} })

      expect(first).toEqual(second)
    })
  })

  describe('webGlExtensions', () => {
    it('should work', () => {
      if (!isWebGLSupported()) {
        expect(getWebGlExtensions(options)).toBe(STATUS_NO_GL_CONTEXT)
        return
      }

      const result = getWebGlExtensions(options)

      // Type guard
      if (typeof result === 'number') {
        throw new Error('WebGL is missing')
      }

      for (const [key, value] of Object.entries(result)) {
        if (value === null) {
          expect(key).toBe('extensions')
        } else {
          expect(value).withContext(key).toBeInstanceOf(Array)
          for (let i = 0; i < value.length; ++i) {
            expect(value[i]).withContext(`${key}[${i}]`).toBeInstanceOf(String)
          }
        }
      }
    })

    it('returns corresponding status when `context.getParameter` is absent', async () => {
      await withMissingGetParameter(() => {
        expect(
          getWebGlExtensions({
            cache: {},
          }),
        ).toBe(STATUS_GET_PARAMETER_NOT_A_FUNCTION)
      })
    })

    it('is stable', () => {
      const first = getWebGlExtensions({ cache: {} })
      const second = getWebGlExtensions({ cache: {} })

      expect(first).toEqual(second)
    })
  })
})

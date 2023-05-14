import getHighestSupportedJSVersion, { createScriptElement, JS_VERSION_KEY, takeSupportedJSVersion } from './js-version'

describe('getHighestSupportedJSVersion', () => {
  const jsVersion = '1.2'
  const nonce = 'ABC123'

  describe('createScriptElement', () => {
    beforeAll(() => {
      const currentScript = document.createElement('script')
      Object.defineProperty(document, 'currentScript', {
        value: currentScript,
        writable: true,
      })
      Object.defineProperty(currentScript, 'nonce', {
        value: nonce,
        writable: true,
      })
    })

    it('should return an HTMLScriptElement with the correct language attribute', () => {
      const scriptElement = createScriptElement(jsVersion)
      expect(scriptElement.tagName).toBe('SCRIPT')
      expect(scriptElement.getAttribute('language')).toBe(`JavaScript${jsVersion}`)
    })

    it('should set the nonce attribute if the current script element has a nonce attribute', () => {
      // Call the function you want to test
      const scriptElement = createScriptElement(jsVersion)
      // Expect that the nonce attribute was set correctly
      expect(scriptElement.getAttribute('nonce')).toBe(nonce)
    })

    it('should set the text content of the script element to the correct value', () => {
      const scriptElement = createScriptElement(jsVersion)
      expect(scriptElement.textContent).toBe(`${JS_VERSION_KEY} = "${jsVersion}"`)
    })
  })

  describe('takeSupportedJSVersion', () => {
    it('should return the value of the JS_VERSION_KEY variable', () => {
      window[JS_VERSION_KEY] = jsVersion
      const version = takeSupportedJSVersion()
      expect(version).toBe(jsVersion)
    })

    it('should delete the JS_VERSION_KEY variable from the window object', () => {
      window[JS_VERSION_KEY] = jsVersion
      takeSupportedJSVersion()
      expect(window[JS_VERSION_KEY]).toBeUndefined()
    })
  })

  describe('getHighestSupportedJSVersion', () => {
    it('should return the highest supported JS version by the browser', () => {
      const supportedVersion = getHighestSupportedJSVersion()
      expect(supportedVersion).toBe('1.5')
    })
  })
})

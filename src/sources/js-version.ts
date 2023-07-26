/*
 * Because this value will be used as a key on the window,
 * we make it a uuid, so it can't interfere with the application's code
 */
export const JS_VERSION_KEY = 'bc1ef781503449e5964fce8c9dd3b8a9'
const JS_VERSIONS = [
  '1.1',
  '1.2',
  '1.3',
  '1.4',
  '1.5',
  '1.6',
  '1.7',
  '1.8',
  '1.8.1',
  '1.8.2',
  '1.8.5',
  '1.9',
  '1.10',
  '1.11',
]

export function createScriptElement(jsVersion: string): HTMLScriptElement {
  const scriptElement = document.createElement('script')
  scriptElement.setAttribute('language', `JavaScript${jsVersion}`)

  /*
   * This ensures that the dynamically created <script> element has a nonce attribute with the same
   * value as the current script element's nonce attribute.
   * This is a security feature that helps to prevent cross-site scripting (XSS)
   * attacks by allowing only scripts with a valid nonce attribute to execute.
   */
  const currentScript = document.currentScript
  if (currentScript?.nonce) {
    scriptElement.setAttribute('nonce', currentScript.nonce)
  }
  /*
   * If the version of JS, that is set in the language attribute is supported by the browser,
   * this code will execute and write the version to the window, we can later collect this value.
   */
  scriptElement.text = `${JS_VERSION_KEY} = "${jsVersion}"`
  return scriptElement
}

export function takeSupportedJSVersion(): string | undefined {
  const supportedVersion = window[JS_VERSION_KEY as keyof Window] as string
  delete window[JS_VERSION_KEY as keyof Window]
  return supportedVersion
}

export default function getHighestSupportedJSVersion(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }

  try {
    const head = document.head
    for (const jsVersion of JS_VERSIONS) {
      const scriptElement = createScriptElement(jsVersion)
      head.appendChild(scriptElement)
      head.removeChild(scriptElement)
    }

    return takeSupportedJSVersion()
  } catch (error) {
    return undefined
  }
}

import { wait } from './async'
import { parseSimpleCssSelector } from './data'

/**
 * Creates and keeps an invisible iframe while the given function runs.
 * The given function is called when the iframe is loaded and has a body.
 * The iframe allows to measure DOM sizes inside itself.
 *
 * Notice: passing an initial HTML code doesn't work in IE.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export async function withIframe<T>(
  action: (iframe: HTMLIFrameElement, iWindow: Window) => Promise<T> | T,
  initialHtml?: string,
  domPollInterval = 50,
): Promise<T> {
  const d = document

  // document.body can be null while the page is loading
  while (!d.body) {
    await wait(domPollInterval)
  }

  const iframe = d.createElement('iframe')

  try {
    await new Promise((resolve, reject) => {
      iframe.onload = resolve
      iframe.onerror = reject
      const { style } = iframe
      style.setProperty('display', 'block', 'important') // Required for browsers to calculate the layout
      style.position = 'absolute'
      style.top = '0'
      style.left = '0'
      style.visibility = 'hidden'
      d.body.appendChild(iframe)

      // The order is important here.
      // The `iframe.srcdoc = ...` expression must go after the `body.appendChild(iframe)` expression,
      // otherwise the iframe will never load nor fail in WeChat built-in browser.
      // See https://github.com/fingerprintjs/fingerprintjs/issues/645#issuecomment-828189330
      if (initialHtml && 'srcdoc' in iframe) {
        iframe.srcdoc = initialHtml
      } else {
        iframe.src = 'about:blank'
      }
    })

    while (!iframe.contentWindow?.document.body) {
      await wait(domPollInterval)
    }

    return await action(iframe, iframe.contentWindow)
  } finally {
    iframe.parentNode?.removeChild(iframe)
  }
}

/**
 * Creates a DOM element that matches the given selector.
 * Only single element selector are supported (without operators like space, +, >, etc).
 */
export function selectorToElement(selector: string): HTMLElement {
  const [tag, attributes] = parseSimpleCssSelector(selector)
  const element = document.createElement(tag ?? 'div')
  for (const name of Object.keys(attributes)) {
    element.setAttribute(name, attributes[name].join(' '))
  }
  return element
}

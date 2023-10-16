import { MaybePromise, wait } from './async'
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
  action: (iframe: HTMLIFrameElement, iWindow: Window) => MaybePromise<T>,
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
    await new Promise<void>((_resolve, _reject) => {
      let isComplete = false
      const resolve = () => {
        isComplete = true
        _resolve()
      }
      const reject = (error: unknown) => {
        isComplete = true
        _reject(error)
      }

      iframe.onload = resolve
      iframe.onerror = reject
      const { style } = iframe
      style.setProperty('display', 'block', 'important') // Required for browsers to calculate the layout
      style.position = 'absolute'
      style.top = '0'
      style.left = '0'
      style.visibility = 'hidden'
      if (initialHtml && 'srcdoc' in iframe) {
        iframe.srcdoc = initialHtml
      } else {
        iframe.src = 'about:blank'
      }
      d.body.appendChild(iframe)

      // WebKit in WeChat doesn't fire the iframe's `onload` for some reason.
      // This code checks for the loading state manually.
      // See https://github.com/fingerprintjs/fingerprintjs/issues/645
      const checkReadyState = () => {
        // The ready state may never become 'complete' in Firefox despite the 'load' event being fired.
        // So an infinite setTimeout loop can happen without this check.
        // See https://github.com/fingerprintjs/fingerprintjs/pull/716#issuecomment-986898796
        if (isComplete) {
          return
        }

        // Make sure iframe.contentWindow and iframe.contentWindow.document are both loaded
        // The contentWindow.document can miss in JSDOM (https://github.com/jsdom/jsdom).
        if (iframe.contentWindow?.document?.readyState === 'complete') {
          resolve()
        } else {
          setTimeout(checkReadyState, 10)
        }
      }
      checkReadyState()
    })

    while (!iframe.contentWindow?.document?.body) {
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
    const value = attributes[name].join(' ')
    // Changing the `style` attribute can cause a CSP error, therefore we change the `style.cssText` property.
    // https://github.com/fingerprintjs/fingerprintjs/issues/733
    if (name === 'style') {
      addStyleString(element.style, value)
    } else {
      element.setAttribute(name, value)
    }
  }
  return element
}

/**
 * Adds CSS styles from a string in such a way that doesn't trigger a CSP warning (unsafe-inline or unsafe-eval)
 */
export function addStyleString(style: CSSStyleDeclaration, source: string): void {
  // We don't use `style.cssText` because browsers must block it when no `unsafe-eval` CSP is presented: https://csplite.com/csp145/#w3c_note
  // Even though the browsers ignore this standard, we don't use `cssText` just in case.
  for (const property of source.split(';')) {
    const match = /^\s*([\w-]+)\s*:\s*(.+?)(\s*!([\w-]+))?\s*$/.exec(property)
    if (match) {
      const [, name, value, , priority] = match
      style.setProperty(name, value, priority || '') // The last argument can't be undefined in IE11
    }
  }
}

/**
 * The returned promise resolves when the tab becomes visible (in foreground).
 * If the tab is already visible, resolves immediately.
 */
export function whenDocumentVisible(): Promise<void> {
  return new Promise((resolve) => {
    const d = document
    const eventName = 'visibilitychange'
    const handleVisibilityChange = () => {
      if (!d.hidden) {
        d.removeEventListener(eventName, handleVisibilityChange)
        resolve()
      }
    }
    d.addEventListener(eventName, handleVisibilityChange)
    handleVisibilityChange()
  })
}

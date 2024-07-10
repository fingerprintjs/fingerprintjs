import { isAnyParentCrossOrigin } from '../utils/dom'

export const enum ApplePayState {
  /* Apple Pay is disabled on the user device. Seems like it's never returned on iOS (based on few observations). */
  Disabled = 0,
  /** Apple Pay is enabled on the user device */
  Enabled = 1,
  /** The browser doesn't have the API to work with Apple Pay */
  NoAPI = -1,
  /** Using Apple Pay isn't allowed because the page context isn't secure (not HTTPS) */
  NotAvailableInInsecureContext = -2,
  /**
   * Using Apple Pay isn't allowed because the code runs in a frame,
   * and the frame origin doesn't match all parent page origins.
   */
  NotAvailableInFrame = -3,
}

/**
 * The return type is a union instead of the enum, because it's too challenging to embed the const enum into another
 * project. Turning it into a union is a simple and an elegant solution.
 */
export default function getApplePayState(): 0 | 1 | -1 | -2 | -3 {
  const { ApplePaySession } = window

  if (typeof ApplePaySession?.canMakePayments !== 'function') {
    return ApplePayState.NoAPI
  }

  if (willPrintConsoleError()) {
    return ApplePayState.NotAvailableInFrame
  }

  try {
    return ApplePaySession.canMakePayments() ? ApplePayState.Enabled : ApplePayState.Disabled
  } catch (error) {
    return getStateFromError(error)
  }
}

/**
 * Starting from Safari 15 calling `ApplePaySession.canMakePayments()` produces this error message when FingerprintJS
 * runs in an iframe with a cross-origin parent page, and the iframe on that page has no allow="payment *" attribute:
 *   Feature policy 'Payment' check failed for element with origin 'https://example.com' and allow attribute ''.
 * This function checks whether the error message is expected.
 *
 * We check for cross-origin parents, which is prone to false-positive results. Instead, we should check for allowed
 * feature/permission, but we can't because none of these API works in Safari yet:
 *   navigator.permissions.query({ name: ‘payment' })
 *   navigator.permissions.query({ name: ‘payment-handler' })
 *   document.featurePolicy
 */
const willPrintConsoleError = isAnyParentCrossOrigin

export function getStateFromError(error: unknown): ApplePayState.NotAvailableInInsecureContext {
  // See full expected error messages in the test
  if (error instanceof Error && error.name === 'InvalidAccessError' && /\bfrom\b.*\binsecure\b/i.test(error.message)) {
    return ApplePayState.NotAvailableInInsecureContext
  }

  throw error
}

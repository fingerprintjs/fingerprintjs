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
   * and the frame origin doesn't match the top level page origin.
   */
  NotAvailableInFrame = -3,
}

export default function getApplePayState(): ApplePayState {
  const { ApplePaySession } = window

  if (typeof ApplePaySession?.canMakePayments !== 'function') {
    return ApplePayState.NoAPI
  }

  try {
    return ApplePaySession.canMakePayments() ? ApplePayState.Enabled : ApplePayState.Disabled
  } catch (error) {
    return getStateFromError(error)
  }
}

/**
 * The return type is a union instead of the enum, because it's too challenging to embed the const enum into another
 * project. Turning it into a union is a simple and an elegant solution.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function getStateFromError(error: unknown): -2 | -3 {
  if (error instanceof Error) {
    // See full expected error messages in the test
    if (error.name === 'InvalidAccessError') {
      if (/\bfrom\b.*\binsecure\b/i.test(error.message)) {
        return ApplePayState.NotAvailableInInsecureContext
      }
      if (/\bdifferent\b.*\borigin\b.*top.level\b.*\bframe\b/i.test(error.message)) {
        return ApplePayState.NotAvailableInFrame
      }
    }
    if (error.name === 'SecurityError') {
      if (/\bthird.party iframes?.*\bnot.allowed\b/i.test(error.message)) {
        return ApplePayState.NotAvailableInFrame
      }
    }
  }

  throw error
}

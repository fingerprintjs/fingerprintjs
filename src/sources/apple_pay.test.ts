import * as utils from '../../tests/utils'
import getApplePayState, { ApplePayState, getStateFromError } from './apple_pay'

describe('Sources', () => {
  describe('applePay', () => {
    it('handles native browser state', async () => {
      // The document must be in "visible" state, otherwise the timeout timer may never complete
      const result = getApplePayState()

      if (!utils.isSafari() || (utils.getBrowserMajorVersion() ?? 0) < 10) {
        expect(result).toBe(ApplePayState.NoAPI)
      } else if (location.protocol !== 'https:') {
        expect(result).toBe(ApplePayState.NotAvailableInInsecureContext)
      } else {
        expect(result).toBeGreaterThanOrEqual(0)
      }
    })

    it('handles API not available', async () => {
      await utils.withMockProperties(
        window,
        {
          ApplePaySession: undefined,
        },
        async () => {
          expect(getApplePayState()).toBe(ApplePayState.NoAPI)
        },
      )
    })

    it('handles expected errors', () => {
      const makeError = (name: string, message: string) => {
        const error = new Error(message)
        error.name = name
        return error
      }

      // Safari 10
      expect(
        getStateFromError(
          makeError('InvalidAccessError', 'Trying to call an ApplePaySession API from an insecure document.'),
        ),
      ).toBe(ApplePayState.NotAvailableInInsecureContext)

      // Safari 11-16
      expect(
        getStateFromError(
          makeError('InvalidAccessError', 'Trying to start an Apple Pay session from an insecure document.'),
        ),
      ).toBe(ApplePayState.NotAvailableInInsecureContext)

      expect(() => getStateFromError(makeError('TypeError', 'Other error'))).toThrowMatching(
        (thrown) => thrown.name === 'TypeError' && thrown.message === 'Other error',
      )
    })
  })
})

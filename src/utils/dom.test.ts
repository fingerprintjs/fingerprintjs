import { withMockProperties } from '../../tests/utils'

import { addStyleString, isAnyParentCrossOrigin, withIframe } from './dom'

describe('DOM utilities', () => {
  it('adds style string', () => {
    const element = document.createElement('div')
    addStyleString(element.style, '; width : 450px ; ; display: block  !important; text-align :center')
    expect((element.getAttribute('style') || '').split(/; */).sort()).toEqual([
      '',
      jasmine.stringMatching(/^display: block ! ?important$/),
      'text-align: center',
      'width: 450px',
    ])
  })

  it('checks for cross-origin iframe', () => {
    // Assuming the tests run only with Karma, which doesn't run tests inside an iframe
    expect(isAnyParentCrossOrigin()).toBeFalse()
  })

  describe('withIframe', () => {
    it("doesn't fail when document loading is delayed", async () => {
      try {
        let result: Promise<unknown> | null = null
        jasmine.clock().install()
        await withMockProperties(document, { body: { get: () => null } }, async () => {
          result = withIframe(() => ({}))
          // Ensure the promise remains pending while document.body is not available - for 500 ms
          jasmine.clock().tick(500)
          await expectAsync(result).toBePending()
        })
        // Advance (fake) time by 50ms to ensure that enough time is simulated for the withIframe function's default
        // polling interval to detect that document.body is available, allowing the promise in result to resolve.
        // This is necessary because withIframe performs repeated checks to ensure the DOM is ready before proceeding.
        jasmine.clock().tick(50)
        await expectAsync(result).toBeResolved()
      } finally {
        jasmine.clock().uninstall()
      }
    })

    it('falls back to an empty document when the initial HTML is rejected by Trusted Types', async () => {
      const result = await withMockProperties(
        HTMLIFrameElement.prototype,
        {
          srcdoc: {
            set: () => {
              throw new TypeError("This document requires 'TrustedHTML' assignment.")
            },
          },
        },
        () => withIframe((iframe, iWindow) => [iframe.getAttribute('src'), !!iWindow.document.body], '<!doctype html>'),
      )
      expect(result).toEqual(['about:blank', true])
    })

    it('rethrows unexpected errors when setting the initial HTML', async () => {
      const error = new Error('Unexpected')
      await withMockProperties(
        HTMLIFrameElement.prototype,
        {
          srcdoc: {
            set: () => {
              throw error
            },
          },
        },
        async () => {
          await expectAsync(withIframe(() => null, '<!doctype html>')).toBeRejectedWith(error)
        },
      )
    })
  })
})

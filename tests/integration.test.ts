import * as FPJS from '../src'

/*
 * Checks that the distributive file works in a browser.
 * Build the minified script before running this test.
 */

declare const FingerprintJS: typeof FPJS

describe('Integration', () => {
  it('gets visitor id', async () => {
    // Uses the global FingerprintJS value left by the distributive script
    expect(FingerprintJS).toBeInstanceOf(Object)
    expect(typeof FingerprintJS.load).toBe('function')

    const fp = await FingerprintJS.load()
    expect(typeof fp).toBe('object')

    const result = await fp.get()
    expect(result).toBeInstanceOf(Object)
    expect(typeof result.visitorId).toBe('string')
    expect(result.confidence.score).toBeGreaterThan(0.1)
    expect(result.confidence.score).toBeLessThan(0.9)
    expect(result.components).toBeInstanceOf(Object)
  }, 10000) // Such tests can take too much time to complete on BrowserStack
})

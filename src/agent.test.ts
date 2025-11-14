import { version } from '../package.json'
import { load as loadAgent } from './agent'
import { sources } from './sources'
import { isSourceLoaded } from './sources/cpu_class'
import { wait } from './utils/async'

describe('Agent', () => {
  it('collects all components without unexpected errors and makes visitorId', async () => {
    const agent = await loadAgent({ delayFallback: 0 })
    const result = await agent.get()
    expect(typeof result.visitorId).toBe('string')
    expect(result.visitorId).not.toEqual('')
    expect(typeof result.confidence.score).toBe('number')
    expect(typeof result.confidence.comment).toBe('string')
    expect(result.version).toBe(version)

    const expectedComponents = Object.keys(sources).sort() as Array<keyof typeof sources>
    expect(expectedComponents.length).toBeGreaterThan(10) // To check the test itself
    expect(Object.keys(result.components).sort()).toEqual(expectedComponents)
    for (const componentName of expectedComponents) {
      const component = result.components[componentName]
      expect('error' in component ? component.error : undefined)
        .withContext(`Unexpected error in the "${componentName}" component`)
        .toBeUndefined()
    }
  })

  it('loads entropy sources when created', async () => {
    isSourceLoaded.x = false
    const agent = await loadAgent({ delayFallback: 0 })

    // The entropy sources may be not loaded yet at this moment of time, so we need to wait
    for (let i = 0; i < 20 && !isSourceLoaded.x; ++i) {
      await wait(50)
    }

    expect(isSourceLoaded.x).withContext('Entropy sources are not loaded').toBeTrue()
    await agent.get() // To wait until the background processes complete
  })

  describe('monitoring option', () => {
    let mockXHR: {
      open: jasmine.Spy
      send: jasmine.Spy
    }
    let xmlHttpRequestSpy: jasmine.Spy

    beforeEach(() => {
      mockXHR = {
        open: jasmine.createSpy('open'),
        send: jasmine.createSpy('send'),
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      xmlHttpRequestSpy = spyOn(window as any, 'XMLHttpRequest').and.returnValue(mockXHR)
    })

    it('respects the monitoring option when set to false', async () => {
      spyOn(Math, 'random').and.returnValue(0)
      const agent = await loadAgent({ delayFallback: 0, monitoring: false })
      await agent.get()

      expect(xmlHttpRequestSpy).not.toHaveBeenCalled()
      expect(mockXHR.open).not.toHaveBeenCalled()
      expect(mockXHR.send).not.toHaveBeenCalled()
    })

    it('enables monitoring by default and when explicitly set to true', async () => {
      spyOn(Math, 'random').and.returnValue(0)
      const agent = await loadAgent({ delayFallback: 0 })
      await agent.get()

      expect(xmlHttpRequestSpy).toHaveBeenCalled()
      expect(mockXHR.open).toHaveBeenCalledWith(
        'get',
        jasmine.stringMatching(/fingerprintjs\/v.*\/npm-monitoring/),
        true,
      )
      expect(mockXHR.send).toHaveBeenCalled()
    })
  })
})

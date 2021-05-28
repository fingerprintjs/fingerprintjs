import { holdLoop } from '../../tests/utils'
import { wait } from '../utils/async'
import { getComponents, loadSource2, loadSources2 } from './index'

describe('Sources', () => {
  describe('getComponents', () => {
    it('handles errors', async () => {
      const sources = {
        success1: () => 'foo',
        throwsErrorObject: () => {
          throw new Error('bar')
        },
        throwsErrorString: () => {
          throw 'baz'
        },
        success2: () => 'baq',
      }

      const components = await getComponents(sources, undefined, [])

      expect(Object.keys(components).sort()).toEqual(['success1', 'success2', 'throwsErrorObject', 'throwsErrorString'])
      expect(components.success1.error).toBeUndefined()
      expect(components.success1.value).toBe('foo')
      expect(components.success2.error).toBeUndefined()
      expect(components.success2.value).toBe('baq')
      expect(components.throwsErrorObject.value).toBeUndefined()
      expect(components.throwsErrorObject.error).toBeInstanceOf(Error)
      expect(components.throwsErrorObject.error!.message).toBe('bar') // eslint-disable-line @typescript-eslint/no-non-null-assertion
      expect(components.throwsErrorString.value).toBeUndefined()
      expect(components.throwsErrorString.error).toEqual({ message: 'baz' })
    })

    it('measures duration', async () => {
      const sources = {
        instant: () => true,
        delayedResult: () => new Promise((resolve) => setTimeout(resolve, 50)),
        delayedError: () => new Promise((_resolve, reject) => setTimeout(() => reject('test'), 50)),
      }

      const components = await getComponents(sources, undefined, [])

      expect(components.instant.duration).toBeLessThan(25)
      expect(components.delayedResult.duration).toBeGreaterThan(25)
      expect(components.delayedError.duration).toBeGreaterThan(25)
    })

    it('excludes', async () => {
      const sources = {
        toBe: () => true,
        notToBe: () => false,
      }

      const components = await getComponents(sources, undefined, ['notToBe'])

      expect(Object.keys(components)).toEqual(['toBe'])
      expect(components.toBe.value).toBe(true)
    })
  })

  describe('loadSource', () => {
    it('passes source options', async () => {
      const sourceGetter = jasmine.createSpy()
      const sourceLoader = jasmine.createSpy().and.returnValue(sourceGetter)

      const loadedSource = loadSource2(sourceLoader, '12345')
      await loadedSource()
      expect(sourceLoader).toHaveBeenCalledWith('12345')
      expect(sourceGetter).toHaveBeenCalledWith()
    })

    it("returns source's result", async () => {
      const source = () => () => 'unpredictable value'
      const loadedSource = loadSource2(source, undefined)
      const component = await loadedSource()
      expect(component).toEqual({ value: 'unpredictable value', duration: jasmine.anything() })
    })

    it("returns source's loading error", async () => {
      const source = () => {
        throw 'Failed to load'
      }

      const loadedSource = loadSource2(source, undefined)
      const component = await loadedSource()
      expect(component).toEqual({ error: { message: 'Failed to load' }, duration: jasmine.anything() })
    })

    it("returns source's getting error", async () => {
      const source = () => () => {
        throw new Error('Failed to get')
      }

      const loadedSource = loadSource2(source, undefined)
      const component = await loadedSource()
      expect(component).toEqual({ error: new Error('Failed to get'), duration: jasmine.anything() })
    })

    it('runs source\'s "load" phase once in total and "get" phase once per each getter call', async () => {
      const sourceGetter = jasmine.createSpy().and.returnValues('one', 'two', 'three')
      const sourceLoader = jasmine.createSpy().and.returnValue(sourceGetter)

      const loadedSource = loadSource2(sourceLoader, undefined)
      await wait(5)
      expect(sourceLoader).toHaveBeenCalledTimes(1)
      expect(sourceGetter).not.toHaveBeenCalled()

      expect(await loadedSource()).toEqual({ value: 'one', duration: jasmine.anything() })
      expect(await loadedSource()).toEqual({ value: 'two', duration: jasmine.anything() })
      expect(await loadedSource()).toEqual({ value: 'three', duration: jasmine.anything() })
      expect(sourceLoader).toHaveBeenCalledTimes(1)
      expect(sourceGetter).toHaveBeenCalledTimes(3)
    })

    it('allows getting the component before source is loaded', async () => {
      let isSourceReallyLoaded = false
      const source = async () => {
        await wait(10)
        isSourceReallyLoaded = true
        return () => 'unpredictable value'
      }

      const loadedSource = loadSource2(source, undefined)
      expect(isSourceReallyLoaded).toBeFalse()
      expect(await loadedSource()).toEqual({ value: 'unpredictable value', duration: jasmine.anything() })
      expect(isSourceReallyLoaded).toBeTrue()
    })

    it('measures duration in case of success', async () => {
      const source = () => {
        holdLoop(7) // setTimeout is too inaccurate
        return () => holdLoop(5)
      }

      const loadedSource = loadSource2(source, undefined)
      await wait(50) // To make a pause between the loading completes and the getting starts
      const component = await loadedSource()
      expect(component.duration).toBeGreaterThanOrEqual(7 + 5)
      expect(component.duration).toBeLessThan(50 + 5)
    })

    it('measures duration in case of error in "load" phase', async () => {
      const source = () => {
        holdLoop(5) // setTimeout is too inaccurate
        throw new Error('Failed to load')
      }

      const loadedSource = loadSource2(source, undefined)
      await wait(50) // To make a pause between the loading completes and the getting starts
      const component = await loadedSource()
      expect(component.duration).toBeGreaterThanOrEqual(5)
      expect(component.duration).toBeLessThan(50)
    })

    it('measures duration in case of error in "get" phase', async () => {
      const source = () => {
        holdLoop(7) // setTimeout is too inaccurate
        return () => {
          holdLoop(5)
          throw new Error('Failed to get')
        }
      }

      const loadedSource = loadSource2(source, undefined)
      await wait(50) // To make a pause between the loading completes and the getting starts
      const component = await loadedSource()
      expect(component.duration).toBeGreaterThanOrEqual(7 + 5)
      expect(component.duration).toBeLessThan(50 + 5)
    })
  })

  describe('loadSources', () => {
    it('passes source options', async () => {
      const sources = {
        foo: jasmine.createSpy().and.returnValue(() => ''),
        bar: jasmine.createSpy().and.returnValue(() => ''),
        baz: jasmine.createSpy().and.returnValue(() => ''),
      }

      const loadedSources = loadSources2(sources, '12345', [])
      await loadedSources()
      expect(sources.foo).toHaveBeenCalledWith('12345')
      expect(sources.bar).toHaveBeenCalledWith('12345')
      expect(sources.baz).toHaveBeenCalledWith('12345')
    })

    it("returns sources' values and errors", async () => {
      const sources = {
        success: () => wait(10, () => 'qwerty'),
        loadFail: async () => {
          await wait(5)
          throw new Error('Failed to load')
        },
        getFail: () => async () => {
          await wait(15)
          throw 'Failed to get'
        },
      }

      const loadedSources = loadSources2(sources, undefined, [])
      const components = await loadedSources()
      expect(components).toEqual({
        success: { value: 'qwerty', duration: jasmine.anything() },
        loadFail: { error: new Error('Failed to load'), duration: jasmine.anything() },
        getFail: { error: { message: 'Failed to get' }, duration: jasmine.anything() },
      })
    })

    it("keeps the sources' order", async () => {
      const sources = {
        one: () => wait(15, () => wait(10, '')),
        two: () => wait(5, () => wait(15, '')),
        three: () => wait(10, () => wait(5, '')),
        four: () => wait(5, () => wait(5, '')),
      }

      const loadedSources = loadSources2(sources, undefined, [])
      const components = await loadedSources()
      expect(Object.keys(components)).toEqual(['one', 'two', 'three', 'four'])
    })

    it('excludes', async () => {
      const sources = {
        one: jasmine.createSpy().and.returnValue(() => 1),
        two: jasmine.createSpy().and.returnValue(() => 2),
        three: jasmine.createSpy().and.returnValue(() => 3),
        four: jasmine.createSpy().and.returnValue(() => 4),
        five: jasmine.createSpy().and.returnValue(() => 5),
      }

      const loadedSources = loadSources2(sources, undefined, ['four', 'two'])
      const components = await loadedSources()
      expect(components).toEqual({
        one: { value: 1, duration: jasmine.anything() },
        three: { value: 3, duration: jasmine.anything() },
        five: { value: 5, duration: jasmine.anything() },
      })
      expect(sources.one).toHaveBeenCalledTimes(1)
      expect(sources.two).not.toHaveBeenCalled()
      expect(sources.three).toHaveBeenCalledTimes(1)
      expect(sources.four).not.toHaveBeenCalled()
      expect(sources.five).toHaveBeenCalledTimes(1)
    })

    it('runs source\'s "load" phase once in total and "get" phase once per each getter call', async () => {
      const sourceGetters = {
        foo: jasmine.createSpy().and.returnValues('one', 'two', 'three'),
        bar: jasmine.createSpy().and.returnValues(1, 2, 3),
      }
      const sourceLoaders = {
        foo: jasmine.createSpy().and.returnValue(sourceGetters.foo),
        bar: jasmine.createSpy().and.returnValue(sourceGetters.bar),
      }

      const loadedSources = loadSources2(sourceLoaders, undefined, [])
      await wait(5)
      expect(sourceLoaders.foo).toHaveBeenCalledTimes(1)
      expect(sourceLoaders.bar).toHaveBeenCalledTimes(1)
      expect(sourceGetters.foo).not.toHaveBeenCalled()
      expect(sourceGetters.bar).not.toHaveBeenCalled()

      expect(await loadedSources()).toEqual({
        foo: { value: 'one', duration: jasmine.anything() },
        bar: { value: 1, duration: jasmine.anything() },
      })
      expect(await loadedSources()).toEqual({
        foo: { value: 'two', duration: jasmine.anything() },
        bar: { value: 2, duration: jasmine.anything() },
      })
      expect(await loadedSources()).toEqual({
        foo: { value: 'three', duration: jasmine.anything() },
        bar: { value: 3, duration: jasmine.anything() },
      })
      expect(sourceLoaders.foo).toHaveBeenCalledTimes(1)
      expect(sourceLoaders.bar).toHaveBeenCalledTimes(1)
      expect(sourceGetters.foo).toHaveBeenCalledTimes(3)
      expect(sourceGetters.bar).toHaveBeenCalledTimes(3)
    })

    it('releases the JS event loop for asynchronous events', async () => {
      const makeSource = () => () => {
        holdLoop(10)
        return () => {
          holdLoop(10)
        }
      }
      const sources = {
        0: makeSource(),
        1: makeSource(),
        2: makeSource(),
        3: makeSource(),
        4: makeSource(),
        5: makeSource(),
        6: makeSource(),
        7: makeSource(),
      }
      let intervalFireCounter = 0
      const intervalId = setInterval(() => ++intervalFireCounter, 1)
      try {
        const loadedSources = loadSources2(sources, undefined, [])
        await loadedSources()
      } finally {
        clearInterval(intervalId)
      }
      expect(intervalFireCounter).toBeGreaterThan(1)
    })

    it('runs source\'s "load" phase once even when a signal isn\'t loaded when getter is called', async () => {
      const sources = {
        one: () => {
          // This pause will cause `loadSources` to release the JS event loop
          // which will let the getter run before the next source starts loading
          holdLoop(20)
          return () => ''
        },
        two: jasmine.createSpy().and.returnValue(() => ''),
      }

      const loadedSources = loadSources2(sources, undefined, [])
      expect(sources.two).not.toHaveBeenCalled()
      await Promise.all([loadedSources(), loadedSources(), loadedSources()])
      expect(sources.two).toHaveBeenCalledTimes(1)
    })
  })
})

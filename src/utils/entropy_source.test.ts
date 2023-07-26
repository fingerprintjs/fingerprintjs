import { holdLoop } from '../../tests/utils'
import { isPromise, wait } from './async'
import { Component, loadSource, loadSources, Source, transformSource } from './entropy_source'

describe('Entropy source utilities', () => {
  describe('loadSource', () => {
    it('passes source options', async () => {
      const sourceGetter = jasmine.createSpy()
      const sourceLoader = jasmine.createSpy().and.returnValue(sourceGetter)

      const loadedSource = loadSource(sourceLoader, '12345')
      await loadedSource()
      expect(sourceLoader).toHaveBeenCalledWith('12345')
      expect(sourceGetter).toHaveBeenCalledWith()
    })

    describe('result handling', () => {
      const value = 'unpredictable value'

      async function checkSource(source: Source<undefined, unknown>) {
        const loadedSource = loadSource(source, undefined)
        const component = await loadedSource()
        expect(component).toEqual({ value, duration: jasmine.any(Number) })
      }

      describe('synchronous "load" phase', () => {
        it('with no "get" phase', async () => {
          const source = () => value
          await checkSource(source)
        })

        it('with synchronous "get" phase', async () => {
          const source = () => () => value
          await checkSource(source)
        })

        it('with asynchronous "get" phase', async () => {
          const source = () => () => wait(5, value)
          await checkSource(source)
        })
      })

      describe('asynchronous "load" phase', () => {
        it('with no "get" phase', async () => {
          const source = () => wait(5, value)
          await checkSource(source)
        })

        it('with synchronous "get" phase', async () => {
          const source = () => wait(5, () => value)
          await checkSource(source)
        })

        it('with asynchronous "get" phase', async () => {
          const source = () => wait(5, () => wait(5, value))
          await checkSource(source)
        })
      })
    })

    describe('error handling', () => {
      const error = new Error('Fail')

      async function checkSource(source: Source<undefined, never>) {
        const loadedSource = loadSource(source, undefined)
        const component = await loadedSource()
        expect(component).toEqual({ error: jasmine.anything(), duration: jasmine.any(Number) })
        if ('error' in component) {
          expect(component.error).toBe(error)
        }
      }

      describe('synchronous "load" phase', () => {
        it('with no "get" phase', async () => {
          await checkSource(() => {
            throw error
          })
        })

        it('with synchronous "get" phase', async () => {
          await checkSource(() => () => {
            throw error
          })
        })

        it('with asynchronous "get" phase', async () => {
          await checkSource(() => async () => {
            await wait(5)
            throw error
          })
        })
      })

      describe('asynchronous "load" phase', () => {
        it('with no "get" phase', async () => {
          await checkSource(async () => {
            await wait(5)
            throw error
          })
        })

        it('with synchronous "get" phase', async () => {
          await checkSource(async () => {
            await wait(5)
            return () => {
              throw error
            }
          })
        })

        it('with asynchronous "get" phase', async () => {
          await checkSource(async () => {
            await wait(5)
            return async () => {
              await wait(5)
              throw error
            }
          })
        })
      })

      it('throws exotic error types as is', async () => {
        async function checkSource(phase: 'load' | 'get', error: unknown, context = '') {
          const source = phase === 'load' ? () => Promise.reject(error) : () => () => Promise.reject(error)
          const loadedSource = loadSource(source, undefined)
          const component = await loadedSource()
          expect(component)
            .withContext(context)
            .toEqual({ error, duration: jasmine.any(Number) })
        }

        await checkSource('load', 'Just a string')
        await checkSource('get', 1234, 'A number')
        await checkSource('load', '', 'An empty string, which is a falsy value')
        await checkSource('get', false)
        await checkSource('load', undefined)
      })
    })

    it('runs source\'s "load" phase once in total and "get" phase once per each getter call', async () => {
      const sourceGetter = jasmine.createSpy().and.returnValues('one', 'two', 'three')
      const sourceLoader = jasmine.createSpy().and.returnValue(sourceGetter)

      const loadedSource = loadSource(sourceLoader, undefined)
      await wait(5)
      expect(sourceLoader).toHaveBeenCalledTimes(1)
      expect(sourceGetter).not.toHaveBeenCalled()

      expect(await loadedSource()).toEqual({ value: 'one', duration: jasmine.any(Number) })
      expect(await loadedSource()).toEqual({ value: 'two', duration: jasmine.any(Number) })
      expect(await loadedSource()).toEqual({ value: 'three', duration: jasmine.any(Number) })
      expect(sourceLoader).toHaveBeenCalledTimes(1)
      expect(sourceGetter).toHaveBeenCalledTimes(3)
    })

    it('allows getting the component before source is loaded', async () => {
      let isSourceReallyLoaded = false
      const source = async () => {
        await wait(10)
        isSourceReallyLoaded = true
        return 'unpredictable value'
      }

      const loadedSource = loadSource(source, undefined)
      expect(isSourceReallyLoaded).toBeFalse()
      expect(await loadedSource()).toEqual({ value: 'unpredictable value', duration: jasmine.any(Number) })
      expect(isSourceReallyLoaded).toBeTrue()
    })

    it('measures duration in case of success', async () => {
      const source = () => {
        holdLoop(7) // setTimeout is too inaccurate
        return () => holdLoop(5)
      }

      const loadedSource = loadSource(source, undefined)
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

      const loadedSource = loadSource(source, undefined)
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

      const loadedSource = loadSource(source, undefined)
      await wait(50) // To make a pause between the loading completes and the getting starts
      const component = await loadedSource()
      expect(component.duration).toBeGreaterThanOrEqual(7 + 5)
      expect(component.duration).toBeLessThan(50 + 5)
    })

    it('throws in case of an unexpected error outside the source', async () => {
      const source = {
        bind() {
          throw new Error('Artificial')
        },
      } as unknown as Source<undefined, never>
      const loadedSource = loadSource(source, undefined)
      await wait(1) // To let potential unhandled promise rejections happen
      await expectAsync(loadedSource()).toBeRejectedWith(new Error('Artificial'))
    })
  })

  describe('loadSources', () => {
    it('passes source options', async () => {
      const sources = {
        foo: jasmine.createSpy(),
        bar: jasmine.createSpy(),
        baz: jasmine.createSpy(),
      }

      const loadedSources = loadSources(sources, '12345', [])
      await loadedSources()
      expect(sources.foo).toHaveBeenCalledWith('12345')
      expect(sources.bar).toHaveBeenCalledWith('12345')
      expect(sources.baz).toHaveBeenCalledWith('12345')
    })

    it("returns sources' values and errors", async () => {
      const sources = {
        success: () => wait(10, 'qwerty'),
        loadFail: async () => {
          await wait(5)
          throw new Error('Failed to load')
        },
        getFail: () => async () => {
          await wait(15)
          throw 'Failed to get'
        },
      }

      const loadedSources = loadSources(sources, undefined, [])
      const components = await loadedSources()
      expect(components).toEqual({
        success: { value: 'qwerty', duration: jasmine.any(Number) },
        loadFail: { error: new Error('Failed to load'), duration: jasmine.any(Number) },
        getFail: { error: 'Failed to get', duration: jasmine.any(Number) },
      })
    })

    it("keeps the sources' order", async () => {
      const sources = {
        one: () => wait(15, () => wait(10, '')),
        two: () => wait(5, () => wait(15, '')),
        three: () => wait(10, () => wait(5, '')),
        four: () => wait(5, () => wait(5, '')),
      }

      const loadedSources = loadSources(sources, undefined, [])
      const components = await loadedSources()
      expect(Object.keys(components)).toEqual(['one', 'two', 'three', 'four'])
    })

    it('excludes', async () => {
      const sources = {
        one: jasmine.createSpy().and.returnValue(1),
        two: jasmine.createSpy().and.returnValue(2),
        three: jasmine.createSpy().and.returnValue(3),
        four: jasmine.createSpy().and.returnValue(4),
        five: jasmine.createSpy().and.returnValue(5),
      }

      const loadedSources = loadSources(sources, undefined, ['four', 'two'])
      const components = await loadedSources()
      expect(components).toEqual({
        one: { value: 1, duration: jasmine.any(Number) },
        three: { value: 3, duration: jasmine.any(Number) },
        five: { value: 5, duration: jasmine.any(Number) },
      })
      expect(sources.one).toHaveBeenCalledTimes(1)
      expect(sources.two).not.toHaveBeenCalled()
      expect(sources.three).toHaveBeenCalledTimes(1)
      expect(sources.four).not.toHaveBeenCalled()
      expect(sources.five).toHaveBeenCalledTimes(1)
    })

    it('runs sources\' "load" phase once in total and "get" phase once per each getter call', async () => {
      const sourceGetters = {
        foo: jasmine.createSpy().and.returnValues('one', 'two', 'three'),
        bar: jasmine.createSpy().and.returnValues(1, 2, 3),
      }
      const sourceLoaders = {
        foo: jasmine.createSpy().and.returnValue(sourceGetters.foo),
        bar: jasmine.createSpy().and.returnValue(sourceGetters.bar),
      }

      const loadedSources = loadSources(sourceLoaders, undefined, [])
      await wait(5)
      expect(sourceLoaders.foo).toHaveBeenCalledTimes(1)
      expect(sourceLoaders.bar).toHaveBeenCalledTimes(1)
      expect(sourceGetters.foo).not.toHaveBeenCalled()
      expect(sourceGetters.bar).not.toHaveBeenCalled()

      expect(await loadedSources()).toEqual({
        foo: { value: 'one', duration: jasmine.any(Number) },
        bar: { value: 1, duration: jasmine.any(Number) },
      })
      expect(await loadedSources()).toEqual({
        foo: { value: 'two', duration: jasmine.any(Number) },
        bar: { value: 2, duration: jasmine.any(Number) },
      })
      expect(await loadedSources()).toEqual({
        foo: { value: 'three', duration: jasmine.any(Number) },
        bar: { value: 3, duration: jasmine.any(Number) },
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
        const loadedSources = loadSources(sources, undefined, [])
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
          return ''
        },
        two: jasmine.createSpy(),
      }

      const loadedSources = loadSources(sources, undefined, [])
      expect(sources.two).not.toHaveBeenCalled()
      await Promise.all([loadedSources(), loadedSources(), loadedSources()])
      expect(sources.two).toHaveBeenCalledTimes(1)
    })

    it('throws in case of an unexpected error outside the source', async () => {
      const sources = {
        corrupt: {
          bind() {
            throw new Error('Artificial')
          },
        } as unknown as Source<undefined, never>,
      }
      const loadedSources = loadSources(sources, undefined, [])
      await wait(1) // To let potential unhandled promise rejections happen
      await expectAsync(loadedSources()).toBeRejectedWith(new Error('Artificial'))
    })
  })

  describe('transformSource', () => {
    const transformValue = (value: number) => value * 2
    const sourceError = new Error('Testing')

    describe('keeps the source properties', () => {
      function transformComponentValue<T1, T2>(component: Component<T1>, transformValue: (value: T1) => T2) {
        return 'error' in component ? component : { ...component, value: transformValue(component.value) }
      }

      function removeDuration<T>(component: Component<T>) {
        const { duration, ...withoutDuration } = component
        return withoutDuration
      }

      /** Gets the entropy source structure description (number of phases, whether each phase is sync/async) */
      async function getExecutionTrace<T extends unknown[]>(func: (...a: T) => unknown, ...args: T): Promise<string> {
        let trace = 'executing function, '

        let returned: unknown
        try {
          returned = func(...args)
        } catch {
          return `${trace}function failed`
        }

        let resolved: unknown
        if (isPromise(returned)) {
          trace += 'resolving promise, '
          try {
            resolved = await returned
          } catch {
            return `${trace}promise rejected`
          }
        } else {
          resolved = returned
        }

        if (typeof resolved === 'function') {
          return `${trace}${await getExecutionTrace(resolved as () => unknown)}`
        }
        return `${trace}returning result`
      }

      /** Checks that the entropy source is identical to it's transformed version in every aspect except the result */
      async function checkSource(source: Source<undefined, number>) {
        const options = undefined
        const transformedSource = transformSource(source, transformValue)
        const transformedComponent = removeDuration(await loadSource(transformedSource, options)())
        const expectedComponent = removeDuration(
          transformComponentValue(await loadSource(source, options)(), transformValue),
        )
        expect(transformedComponent).toEqual(expectedComponent)
        expect(await getExecutionTrace(transformedSource, options)).toEqual(await getExecutionTrace(source, options))
      }

      describe('synchronous "load" phase', () => {
        it('with no "get" phase', async () => {
          await checkSource(() => 3)
          await checkSource(() => {
            throw sourceError
          })
        })

        it('with synchronous "get" phase', async () => {
          await checkSource(() => () => 3)
          await checkSource(() => () => {
            throw sourceError
          })
        })

        it('with asynchronous "get" phase', async () => {
          await checkSource(() => () => Promise.resolve(3))
          await checkSource(() => () => Promise.reject(sourceError))
        })
      })

      describe('asynchronous "load" phase', () => {
        it('with no "get" phase', async () => {
          await checkSource(() => Promise.resolve(3))
          await checkSource(() => Promise.reject(sourceError))
        })

        it('with synchronous "get" phase', async () => {
          await checkSource(() => Promise.resolve(() => 3))
          await checkSource(() =>
            Promise.resolve(() => {
              throw sourceError
            }),
          )
        })

        it('with asynchronous "get" phase', async () => {
          await checkSource(() => Promise.resolve(() => Promise.resolve(3)))
          await checkSource(() => Promise.resolve(() => Promise.reject(sourceError)))
        })
      })
    })

    it('passes source options', async () => {
      const source = jasmine.createSpy()
      const transformedSource = transformSource(source, transformValue)
      const options = { foo: 'bar' }
      transformedSource(options)
      expect(source.calls.allArgs()).toEqual([[options]])
    })
  })
})

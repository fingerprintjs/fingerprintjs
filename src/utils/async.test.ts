import { holdLoop } from '../../tests/utils'
import { awaitIfAsync, mapWithBreaks, wait } from './async'

describe('Async utilities', () => {
  describe('awaitIfAsync', () => {
    describe('synchronous', () => {
      it('succeeds before microtasks', (done) => {
        let microtaskStarted = false
        Promise.resolve().then(() => (microtaskStarted = true))
        awaitIfAsync(
          () => 2 + 2,
          () => {
            expect(microtaskStarted).toBeFalse()
            done()
          },
        )
      })

      it('fails before microtasks', (done) => {
        let microtaskStarted = false
        Promise.resolve().then(() => (microtaskStarted = true))
        awaitIfAsync(
          () => {
            throw new Error()
          },
          () => {
            expect(microtaskStarted).toBeFalse()
            done()
          },
        )
      })

      it('provides successful result', (done) => {
        awaitIfAsync(
          () => 'Qwerty',
          (isSuccess, result) => {
            expect(isSuccess).toBeTrue()
            expect(result).toBe('Qwerty')
            done()
          },
        )
      })

      it('provides error', (done) => {
        awaitIfAsync(
          () => {
            throw new Error('A test error')
          },
          (isSuccess, result) => {
            expect(isSuccess).toBeFalse()
            expect(result).toEqual(new Error('A test error'))
            done()
          },
        )
      })
    })

    describe('asynchronous', () => {
      it('provides successful result', (done) => {
        awaitIfAsync(
          () => wait(1, 'A quick fox'),
          (isSuccess, result) => {
            expect(isSuccess).toBeTrue()
            expect(result).toBe('A quick fox')
            done()
          },
        )
      })

      it('provides synchronous error', (done) => {
        awaitIfAsync(
          async () => {
            throw new Error('An eager error')
          },
          (isSuccess, result) => {
            expect(isSuccess).toBeFalse()
            expect(result).toEqual(new Error('An eager error'))
            done()
          },
        )
      })

      it('provides asynchronous error', (done) => {
        awaitIfAsync(
          async () => {
            await wait(1)
            throw new Error('A lazy error')
          },
          (isSuccess, result) => {
            expect(isSuccess).toBeFalse()
            expect(result).toEqual(new Error('A lazy error'))
            done()
          },
        )
      })
    })
  })

  describe('forEachWithBreaks', () => {
    it('invokes the callback for every item and returns the results', async () => {
      const items = [3, 1, 4, 1, 5, 9, 2]
      const transformation = (value: number) => value ** 2
      const invokedIndices: number[] = []
      const invokedItems: number[] = []
      const results = await mapWithBreaks(
        items,
        (item, index) => {
          invokedIndices.push(index)
          invokedItems.push(item)
          holdLoop(1)
          return transformation(item)
        },
        2,
      )
      expect(invokedIndices).toEqual([0, 1, 2, 3, 4, 5, 6])
      expect(invokedItems).toEqual(items)
      expect(results).toEqual(items.map(transformation))
    })

    it("doesn't change the input array", async () => {
      await mapWithBreaks(Object.freeze([3, 1, 4, 1, 5, 9, 2]), () => undefined)
    })

    it('releases the JS event loop for asynchronous events', async () => {
      let intervalFireCounter = 0
      const intervalId = setInterval(() => ++intervalFireCounter, 1)
      try {
        await mapWithBreaks(Array(10), () => holdLoop(5), 10)
      } finally {
        clearInterval(intervalId)
      }
      expect(intervalFireCounter).toBeGreaterThan(1)
    })

    it("doesn't wait for asynchronous callback", async () => {
      let hasAsyncCallbackCompleted = false
      await mapWithBreaks(['foo', 'bar'], async () => {
        await wait(5)
        hasAsyncCallbackCompleted = true
      })
      expect(hasAsyncCallbackCompleted).toBeFalse()
    })

    it('rejects if a callback throws', async () => {
      const error = new Error('Test')
      await expectAsync(
        mapWithBreaks([1, 2], () => {
          throw error
        }),
      ).toBeRejectedWith(error)
    })
  })
})

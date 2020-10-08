import { getComponents } from './index'

describe('Sources', () => {
  describe('getComponents', () => {
    it('handles errors', async () => {
      const sources = {
        success1: () => 'foo',
        throwsErrorObject: () => { throw new Error('bar') },
        throwsErrorString: () => { throw 'baz' },
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
      expect(components.throwsErrorObject.error!.message).toBe('bar')
      expect(components.throwsErrorString.value).toBeUndefined()
      expect(components.throwsErrorString.error).toEqual({ message: 'baz' })
    })

    it('measures duration', async () => {
      const sources = {
        instant: () => true,
        delayedResult: () => new Promise((resolve) => setTimeout(resolve, 10)),
        delayedError: () => new Promise((_resolve, reject) => setTimeout(() => reject('test'), 10)),
      }
      const components = await getComponents(sources, undefined, [])
      expect(components.instant.duration).toBeLessThan(5)
      expect(components.delayedResult.duration).toBeGreaterThan(5)
      expect(components.delayedError.duration).toBeGreaterThan(5)
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
})

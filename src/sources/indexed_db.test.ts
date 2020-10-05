import { isEdgeHTML } from '../../tests/utils'
import getIndexedDB from './indexed_db'

describe('Source', () => {
  describe('indexedDB', () => {
    it('returns boolean everywhere except Edge', () => {
      if (isEdgeHTML()) {
       pending('The case isn\'t for Edge')
      }
      expect(typeof getIndexedDB()).toBe('boolean')
    })

    it('returns undefined in Edge', () => {
      if (!isEdgeHTML()) {
       pending('The case is for Edge only')
      }
      expect(getIndexedDB()).toBeUndefined()
    })
  })
})

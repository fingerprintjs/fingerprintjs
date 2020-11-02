import { isEdgeHTML, isTrident } from '../../tests/utils'
import getIndexedDB from './indexed_db'

describe('Sources', () => {
  describe('indexedDB', () => {
    it('returns boolean everywhere except IE and Edge', () => {
      if (isTrident() || isEdgeHTML()) {
        pending("The case isn't for IE and Edge")
      }
      expect(typeof getIndexedDB()).toBe('boolean')
    })

    it('returns undefined in IE and Edge', () => {
      if (!isTrident() && !isEdgeHTML()) {
        pending('The case is for IE and Edge only')
      }
      expect(getIndexedDB()).toBeUndefined()
    })
  })
})

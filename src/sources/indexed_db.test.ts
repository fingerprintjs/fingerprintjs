import { isEdgeHTML, isTrident } from '../../tests/utils'
import getIndexedDB from './indexed_db'

describe('Sources', () => {
  describe('indexedDB', () => {
    it('returns boolean or undefined depending on the browser', () => {
      expect(typeof getIndexedDB()).toBe(isTrident() || isEdgeHTML() ? 'undefined' : 'boolean')
    })
  })
})

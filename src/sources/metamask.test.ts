import { withMockProperties } from '../../tests/utils'
import isMetaMaskIsntalled from './metamask'

describe('Sources', () => {
  describe('metamask', () => {
    it('should detect metamask', async () => {
      await withMockProperties(
        window,
        {
          ethereum: { get: () => Object.create(null) }
        },
        () => {
          console.log(window.ethereum)
          expect(isMetaMaskIsntalled()).toBe(true)
        }
      )
    })

    it('should return false for Brave', async () => {
      await withMockProperties(
        navigator,
        {
          brave: { get: () => Object.create(null) }
        },
        () => {
          expect(isMetaMaskIsntalled()).toBe(false)
        }
      )
    })
  })
})

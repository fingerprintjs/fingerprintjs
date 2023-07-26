import * as utils from '../../tests/utils'
import getPrivateClickMeasurement from './private_click_measurement'

describe('Sources', () => {
  describe('privateClickMeasurement', () => {
    it('returns expected value', () => {
      const value = getPrivateClickMeasurement()
      const { major, minor } = utils.getBrowserVersion() ?? { major: 0, minor: 0 }

      if (!utils.isSafari() || major < 14 || (major === 14 && minor < 1)) {
        expect(value).toBe(undefined)
      } else if (major < 15) {
        expect(value).toBe('')
      } else {
        expect(value).toBe('0')
      }
    })
  })
})

import { withMockProperties } from '../../tests/utils'
import getTimezone from './timezone'

describe('Sources', () => {
  describe('timezone', () => {
    it('returns a tz identifier in all supported browsers', () => {
      const result = getTimezone()

      // Some devices on BrowserStack return 'UTC', some '+00:00'.
      if (result === 'UTC' || /^[+-]\d{2}:\d{2}$/.test(String(result))) {
        return
      }

      // We expect all modern browsers (with default settings) to return a TZ identifier,
      // like 'Europe/Berlin' or 'America/Argentina/Buenos_Aires'.
      expect(result).toMatch(/^([a-z]\/+)?[a-z]+\/[a-z_]+$/gi)
    })

    describe('fallbacks', () => {
      function withNoTimezone(januaryOffset: number, julyOffset: number, action: () => void) {
        class MockDate {
          args: unknown[]

          constructor(...args: unknown[]) {
            this.args = args
          }

          getFullYear() {
            return 2024
          }

          getTimezoneOffset() {
            if (this.args[1] === 0) {
              return januaryOffset
            }
            if (this.args[1] === 6) {
              return julyOffset
            }
            throw TypeError('Unexpected constructor arguments')
          }
        }

        return withMockProperties(window, { Date: { value: MockDate }, Intl: undefined }, action)
      }

      it('in the northern eastern hemisphere (Berlin)', async () => {
        await withNoTimezone(1 * -60, 2 * -60, () => {
          expect(getTimezone()).toEqual('UTC+60')
        })
      })

      it('in the southern western hemisphere (Santiago)', async () => {
        await withNoTimezone(-3 * -60, -4 * -60, () => {
          expect(getTimezone()).toEqual('UTC-240')
        })
      })

      it('in the middle', async () => {
        await withNoTimezone(0, 0, () => {
          expect(getTimezone()).toEqual('UTC+0')
        })
      })
    })
  })
})

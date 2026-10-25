import { getBrowserMajorVersion, isGecko, isSafari, withMockMatchMedia, withMockProperties } from '../../tests/utils'

import getScreenResolution from './screen_resolution'

describe('Sources', () => {
  describe('screenResolution', () => {
    it('handles browser native value', () => {
      const result = getScreenResolution()

      if (shouldTurnOff()) {
        expect(result).toBeUndefined()
        return
      }

      if (result === undefined) {
        throw new Error('Expected not to be undefined')
      }
      expect(result[0]).toBeGreaterThan(0)
      expect(result[1]).toBeGreaterThan(0)
    })

    it('returns stable values', () => {
      const first = getScreenResolution()
      const second = getScreenResolution()

      expect(second).toEqual(first)
    })

    // In Firefox `screen.width`/`screen.height` depend on the page zoom, so the source returns the physical resolution.
    // See https://github.com/fingerprintjs/fingerprintjs/issues/98
    describe('in Firefox', () => {
      const physicalWidth = 2940
      const physicalHeight = 1912

      /**
       * Emulates Firefox: `min-device-width`/`min-device-height` media queries are evaluated against the exact
       * fractional screen size in CSS pixels, while `screen.width`/`screen.height` return `reportedScreen`,
       * which is the exact size rounded to integers by default (as Firefox does)
       */
      const getResolutionWithMockedScreen = (
        devicePixelRatio: number,
        reportedScreen?: [number | string, number | string],
        areDeviceMediaFeaturesSupported = true,
      ) => {
        const exactWidth = physicalWidth / devicePixelRatio
        const exactHeight = physicalHeight / devicePixelRatio
        const [width, height] = reportedScreen ?? [Math.round(exactWidth), Math.round(exactHeight)]
        const mediaFeatures = areDeviceMediaFeaturesSupported
          ? { 'device-width': [`${exactWidth}px`], 'device-height': [`${exactHeight}px`] }
          : { 'device-width': [undefined], 'device-height': [undefined] }

        const windowProperties = {
          devicePixelRatio: { get: () => devicePixelRatio },
          screen: { get: () => ({ width, height }) },
        }

        return withMockMatchMedia(mediaFeatures, false, () =>
          withMockProperties(window, windowProperties, () => getScreenResolution()),
        )
      }

      it('returns the physical resolution regardless of the page zoom', async () => {
        if (!isGecko()) {
          return
        }
        // 100% zoom on a Retina display: the CSS size is 1470×956
        expect(await getResolutionWithMockedScreen(2)).toEqual([physicalWidth, physicalHeight])
        // 150% zoom: the CSS size is 980×637.33, and Firefox reports the height as 637
        expect(await getResolutionWithMockedScreen(3)).toEqual([physicalWidth, physicalHeight])
      })

      it('converts fake string values to numbers', async () => {
        if (!isGecko()) {
          return
        }
        expect(await getResolutionWithMockedScreen(2, ['1470', '956'])).toEqual([physicalWidth, physicalHeight])
      })

      it('reports unknown dimensions when the screen size disagrees with the media queries', async () => {
        if (!isGecko()) {
          return
        }
        // E.g. an extension spoofs `screen.width`/`screen.height` but can't spoof the CSS media queries.
        // The width is spoofed above the real value and the height below it to check both bounds
        expect(await getResolutionWithMockedScreen(2, [2000, 500])).toEqual([null, null])
      })

      it('reports unknown dimensions when the device media features are unsupported', async () => {
        if (!isGecko()) {
          return
        }
        expect(await getResolutionWithMockedScreen(3, undefined, false)).toEqual([null, null])
      })
    })
  })
})

function shouldTurnOff() {
  return isSafari() && (getBrowserMajorVersion() ?? 0) >= 17
}

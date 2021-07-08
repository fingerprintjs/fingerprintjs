import { isAndroid, isMacOS, isMobile, isSafari, isTablet, isWindows } from '../tests/utils'
import { loadSources } from './utils/entropy_source'
import getPlatform from './sources/platform'
import { BuiltinComponents } from './sources'
import getConfidenceScore from './confidence_score'

describe('Confidence score', () => {
  it('matches the current platform', async () => {
    const getComponents = loadSources({ platform: getPlatform }, undefined, [])
    const components = await getComponents()
    const confidence = getConfidenceScore(components as BuiltinComponents)

    if (isAndroid()) {
      expect(confidence).toEqual([0.4, '0.994 if upgrade to Pro'])
    } else if (isSafari()) {
      if (isMobile() || isTablet()) {
        expect(confidence).toEqual([0.3, '0.993 if upgrade to Pro'])
      } else {
        expect(confidence).toEqual([0.5, '0.995 if upgrade to Pro'])
      }
    } else if (isWindows()) {
      expect(confidence).toEqual([0.6, '0.996 if upgrade to Pro'])
    } else if (isMacOS()) {
      expect(confidence).toEqual([0.5, '0.995 if upgrade to Pro'])
    } else {
      expect(confidence).toEqual([0.7, '0.997 if upgrade to Pro'])
    }
  })
})

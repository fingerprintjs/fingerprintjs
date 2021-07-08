import { isAndroid, isMacOS, isMobile, isSafari, isTablet, isWindows } from '../tests/utils'
import { loadSources } from './utils/entropy_source'
import getPlatform from './sources/platform'
import { BuiltinComponents } from './sources'
import getConfidenceScore, { updateToProURL } from './confidence'

describe('Confidence', () => {
  it('matches the current platform', async () => {
    const getComponents = loadSources({ platform: getPlatform }, undefined, [])
    const components = await getComponents()
    const confidence = getConfidenceScore(components as BuiltinComponents)

    if (isAndroid()) {
      expect(confidence).toEqual({ score: 0.4, details: `0.994 if upgrade to Pro: ${updateToProURL}` })
    } else if (isSafari()) {
      if (isMobile() || isTablet()) {
        expect(confidence).toEqual({ score: 0.3, details: `0.993 if upgrade to Pro: ${updateToProURL}` })
      } else {
        expect(confidence).toEqual({ score: 0.5, details: `0.995 if upgrade to Pro: ${updateToProURL}` })
      }
    } else if (isWindows()) {
      expect(confidence).toEqual({ score: 0.6, details: `0.996 if upgrade to Pro: ${updateToProURL}` })
    } else if (isMacOS()) {
      expect(confidence).toEqual({ score: 0.5, details: `0.995 if upgrade to Pro: ${updateToProURL}` })
    } else {
      expect(confidence).toEqual({ score: 0.7, details: `0.997 if upgrade to Pro: ${updateToProURL}` })
    }
  })
})

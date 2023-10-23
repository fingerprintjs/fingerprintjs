import { getBrowserMajorVersion, isAndroid, isMacOS, isMobile, isSafari, isTablet, isWindows } from '../tests/utils'
import { loadSources } from './utils/entropy_source'
import getPlatform from './sources/platform'
import getConfidence, { commentTemplate } from './confidence'

describe('Confidence', () => {
  it('matches the current platform', async () => {
    const getComponents = loadSources({ platform: getPlatform }, undefined, [])
    const components = await getComponents()
    const confidence = getConfidence(components)

    if (isAndroid()) {
      expect(confidence).toEqual({ score: 0.4, comment: commentTemplate.replace(/\$/g, '0.994') })
    } else if (isSafari()) {
      if (isMobile() || isTablet() || (getBrowserMajorVersion() ?? 0) >= 17) {
        expect(confidence).toEqual({ score: 0.3, comment: commentTemplate.replace(/\$/g, '0.993') })
      } else {
        expect(confidence).toEqual({ score: 0.5, comment: commentTemplate.replace(/\$/g, '0.995') })
      }
    } else if (isWindows()) {
      expect(confidence).toEqual({ score: 0.6, comment: commentTemplate.replace(/\$/g, '0.996') })
    } else if (isMacOS()) {
      expect(confidence).toEqual({ score: 0.5, comment: commentTemplate.replace(/\$/g, '0.995') })
    } else {
      expect(confidence).toEqual({ score: 0.7, comment: commentTemplate.replace(/\$/g, '0.997') })
    }
  })
})

import { isChromium } from '../../tests/utils'
import { selectorToElement } from '../utils/dom'
import { parseSimpleCssSelector } from '../utils/data'
import { MaybePromise } from '../utils/async'
import getDomBlockers, { getFilters, isApplicable } from './dom_blockers'

async function withBlockedSelectors<T>(selectors: string[], action: () => MaybePromise<T>): Promise<T> {
  const styleElement = document.createElement('style')

  try {
    styleElement.textContent = `${selectors.join(', ')} { display: none !important; }`
    document.head.appendChild(styleElement)

    return await action()
  } finally {
    styleElement.parentNode?.removeChild(styleElement)
  }
}

describe('Sources', () => {
  describe('domBlockers', () => {
    const filters = getFilters()

    describe('the filter list', () => {
      const selectors = ([] as string[]).concat(
        ...Object.keys(filters).map((filterName) => filters[filterName as keyof typeof filters]),
      )

      it('has no complex selectors', () => {
        for (const selector of selectors) {
          const selectorWithNoAllowedSpaces = selector.trim().replace(/\[.*?\]/g, '[]')
          expect(selectorWithNoAllowedSpaces)
            .withContext(`Unexpected complex selector '${selector}'`)
            .not.toContain(' ')
        }
      })

      it('has no selectors with duplicating attributes', () => {
        for (const selector of selectors) {
          const [, attributes] = parseSimpleCssSelector(selector)
          for (const name of Object.keys(attributes)) {
            if (name !== 'class') {
              expect(attributes[name].length)
                .withContext(
                  `Selector '${selector}' has a duplicating attribute '${name}'. ` +
                    `Please rewrite it so that the attribute doesn't repeat ` +
                    `and a DOM element created from the rewritten selector matches the original selector.`,
                )
                .toBeLessThanOrEqual(1)
            }
          }
        }
      })

      it('has no duplicates', () => {
        const uniqueSelectors = new Set<string>()

        for (const selector of selectors) {
          expect(uniqueSelectors).withContext(`Duplicating selector '${selector}'`).not.toContain(selector)
          uniqueSelectors.add(selector)
        }
      })

      it('has only reproducible selectors', () => {
        if (!isApplicable() && !isChromium()) {
          return
        }

        for (const selector of selectors) {
          const element = selectorToElement(selector)
          document.body.appendChild(element)
          const selectorMatches = document.querySelectorAll(selector)
          document.body.removeChild(element)

          // We don't use `toContain` because it performs a deep comparison
          let includesElement = false
          for (let i = 0; i < selectorMatches.length; ++i) {
            if (selectorMatches[i] === element) {
              includesElement = true
              break
            }
          }

          expect(includesElement)
            .withContext(`Can't make an element that matches the '${selector}' selector`)
            .toBeTrue()
        }
      })
    })

    it('returns `undefined` for unsupported browsers', async () => {
      if (isApplicable()) {
        return
      }

      expect(await getDomBlockers()).toBeUndefined()
    })

    it('handles absence of blockers', async () => {
      if (!isApplicable()) {
        return
      }

      expect(await getDomBlockers())
        .withContext(
          'The browser must have no content blocked in tests. Please disable the content blockers for Karma.',
        )
        .toEqual([])
    })

    it('handles blocked selectors', async () => {
      if (!isApplicable()) {
        return
      }

      await withBlockedSelectors(
        [
          ...filters.frellwitSwedish.slice(0, 2),
          ...filters.easyListCookie.slice(0, 4),
          ...filters.listKr,
          ...filters.adGuardBase,
          ...filters.adGuardMobile,
          ...filters.adBlockPersian.slice(0, 1),
          ...filters.iDontCareAboutCookies.slice(0, 1),
          ...filters.easyListCzechSlovak.slice(0, 2),
        ],
        async () => {
          expect(await getDomBlockers()).toEqual(['adGuardBase', 'adGuardMobile', 'easyListCookie', 'listKr'])
        },
      )
    })
  })
})

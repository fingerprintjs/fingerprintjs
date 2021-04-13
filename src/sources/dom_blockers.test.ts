import { parseSimpleCssSelector } from '../utils/data'
import getDomBlockers, { filters, isApplicable } from './dom_blockers'

async function withBlockedSelectors<T>(selectors: string[], action: () => Promise<T> | T): Promise<T> {
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
    describe('filter list', () => {
      it('has only valid selectors', () => {
        for (const filterName of Object.keys(filters) as Array<keyof typeof filters>) {
          for (const selector of filters[filterName]) {
            const selectorWithNoAllowedSpaces = selector.trim().replace(/\[.*?\]/g, '[]')
            expect(selectorWithNoAllowedSpaces)
              .withContext(`Unexpected complex selector '${selector}'`)
              .not.toContain(' ')

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
        }
      })

      it('has no duplicates', () => {
        const selectors = new Set<string>()

        for (const filterName of Object.keys(filters) as Array<keyof typeof filters>) {
          for (const selector of filters[filterName]) {
            expect(selectors.has(selector)).withContext(`Duplicating selector '${selector}'`).toBe(false)
            selectors.add(selector)
          }
        }
      })
    })

    it('returns `undefined` for unsupported browsers', async () => {
      if (isApplicable()) {
        pending('The case is for unsupported browsers only')
      }

      expect(await getDomBlockers()).toBeUndefined()
    })

    it('handles absence of blockers', async () => {
      if (!isApplicable()) {
        pending('The case is for supported browsers only')
      }

      expect(await getDomBlockers())
        .withContext(
          'The browser must have no content blocked in tests. Please disable the content blockers for Karma.',
        )
        .toEqual([])
    })

    it('handles blocked selectors', async () => {
      if (!isApplicable()) {
        pending('The case is for supported browsers only')
      }

      await withBlockedSelectors(
        [
          ...filters.frellwitSwedish.slice(0, 2),
          ...filters.easyListCookie.slice(0, 3),
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

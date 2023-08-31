/*
 * See docs/content_blockers.md
 */

import * as path from 'path'
import { promises as fsAsync } from 'fs'
import * as rollup from 'rollup'
import rollupConfig from '../../rollup.config'
import filterConfig, { FilterList } from './filters'
import { fetchFilter } from './utils'

const inputScript = path.join(__dirname, 'selectors_tester.ts')
const outputFile = path.join(__dirname, 'selectors_tester.html')

run()

async function run() {
  const uniqueSelectors = await fetchUniqueSelectors(filterConfig)
  const testerHtml = await makeTesterHtml(uniqueSelectors)
  await fsAsync.writeFile(outputFile, testerHtml)
}

async function fetchUniqueSelectors(filterConfig: FilterList) {
  const filters = Object.values(filterConfig)
  const uniqueSelectors = new Set<string>()
  let fetchedFiltersCount = 0

  const clearProgress = () => {
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
  }
  const printProgress = () => {
    clearProgress()
    process.stdout.write(`Fetching filters: ${fetchedFiltersCount} of ${filters.length}`)
  }

  printProgress()

  let abort: (() => void) | undefined
  const abortPromise = new Promise<void>((resolve) => (abort = resolve))
  try {
    await Promise.all(
      filters.map(async (filter) => {
        let filterLines: string[]
        try {
          filterLines = await fetchFilter(filter.file, abortPromise)
        } catch (error) {
          throw new Error(`Failed to fetch filter "${filter.title}" (${filter.file}): ${error}`)
        }
        for (const line of filterLines) {
          const selector = getSelectorFromFilterRule(line)
          if (selector) {
            uniqueSelectors.add(selector)
          }
        }
        ++fetchedFiltersCount
        printProgress()
      }),
    )
  } finally {
    abort?.()
    clearProgress()
  }

  return uniqueSelectors
}

function getSelectorFromFilterRule(rule: string): string | undefined {
  const selectorMatch = /^##(.+)$/.exec(rule)
  if (!selectorMatch) {
    return
  }
  const selector = selectorMatch[1]
  // Leaves only selectors suitable for `parseSimpleCssSelector` and `offsetParent` usage
  if (/(^embed([^\w-]|$)|\\|\[src.*=|\[style\W?=[^[]*\bposition:\s*fixed\b|\[[^\]]*\[)/i.test(selector)) {
    return
  }
  // Exclude iframes because they produce unwanted side effects
  if (/^iframe([^\w-]|$)/i.test(selector)) {
    return
  }
  const selectorWithoutAttributes = selector.trim().replace(/\[.*?\]/g, '[]')
  if (/[\s:]/.test(selectorWithoutAttributes)) {
    return
  }
  return selector
}

async function makeTesterHtml(selectors: { forEach: (callback: (selector: string) => void) => void }) {
  const selectorsList: string[] = []
  selectors.forEach((selector) => selectorsList.push(selector))
  const jsCode = await getJsToDetectBlockedSelectors(selectorsList)
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Selector blockers tester</title>
</head>
<body>
  <script>
    ${jsCode}
  </script>
</body>
</html>`
}

async function getJsToDetectBlockedSelectors(selectors: readonly string[]) {
  // The first configuration from rollup.config.ts is supposed to make a JS file with dependencies included
  const bundle = await rollup.rollup({
    input: inputScript,
    plugins: rollupConfig[0].plugins,
  })
  const { output } = await bundle.generate({
    format: 'iife',
  })
  return output[0].code.replace(/\[\s*\/\*\s*selectors\s*\*\/\s*]/g, JSON.stringify(selectors))
}

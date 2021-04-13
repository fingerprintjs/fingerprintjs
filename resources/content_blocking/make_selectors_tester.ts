/*
 * See docs/content_blockers.md
 */

import * as path from 'path'
import { promises as fsAsync } from 'fs'
import * as rollup from 'rollup'
import { eachLineInFile } from './utils'

const inputDirectory = path.join(__dirname, 'filters')
const inputScript = path.join(__dirname, 'selectors_tester.ts')
const outputFile = path.join(__dirname, 'selectors_tester.html')

async function run() {
  const uniqueSelectors = await getUniqueSelectorsFromDirectory(inputDirectory)
  const testerHtml = await makeTesterHtml(uniqueSelectors)
  await fsAsync.writeFile(outputFile, testerHtml)
}

async function getUniqueSelectorsFromDirectory(directoryPath: string) {
  const directoryItems = await fsAsync.readdir(directoryPath, { withFileTypes: true })
  const uniqueSelectors = new Set<string>()

  for (const directoryItem of directoryItems) {
    if (!directoryItem.isFile()) {
      continue
    }
    if (!/^[^.].*\.txt$/.test(directoryItem.name)) {
      continue
    }
    await eachSelectorInFile(path.join(inputDirectory, directoryItem.name), (selector) => {
      uniqueSelectors.add(selector)
    })
  }

  return uniqueSelectors
}

async function eachSelectorInFile(filePath: string, callback: (selector: string) => void | Promise<void>) {
  await eachLineInFile(filePath, async (rule) => {
    const selectorMatch = /^##(.+)$/.exec(rule)
    if (!selectorMatch) {
      return
    }
    const selector = selectorMatch[1]
    // Leaves only selectors suitable for `parseSimpleCssSelector` and `offsetParent` usage
    if (/(^embed([^\w-]|$)|\\|\[src.*=|\[style\W?=[^[]*\bposition:\s*fixed\b|\[[^\]]*\[)/.test(selector)) {
      return
    }
    const selectorWithoutAttributes = selector.trim().replace(/\[.*?\]/g, '[]')
    if (/[\s:]/.test(selectorWithoutAttributes)) {
      return
    }
    await callback(selector)
  })
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
  // The first configuration from rollup.config.js is supposed to make a JS file with dependencies included
  const bundle = await rollup.rollup({
    input: inputScript,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    plugins: require('../../rollup.config')[0].plugins,
  })
  const { output } = await bundle.generate({
    format: 'iife',
  })
  return output[0].code.replace(/\[\s*\/\*\s*selectors\s*\*\/\s*]/g, JSON.stringify(selectors))
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error)
  process.exitCode = 1
})

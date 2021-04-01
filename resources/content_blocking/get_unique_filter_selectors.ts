/*
 * See docs/content_blockers.md
 */

import * as path from 'path'
import { promises as fsAsync } from 'fs'
import { eachLineInFile } from './utils'

const inputDirectory = path.join(__dirname, 'blocked_selectors')
const outputFile = path.join(__dirname, 'unique_filter_selectors.json')

async function run() {
  const filterSelectors = await getUniqueFilterSelectors(inputDirectory)
  await fsAsync.writeFile(outputFile, stringifyResult(filterSelectors))
}

async function getUniqueFilterSelectors(directoryPath: string) {
  const directoryItems = await fsAsync.readdir(directoryPath, { withFileTypes: true })
  const selectors = new Map<string, string[]>()
  const filterSelectors: Record<string, string[]> = {}

  for (const directoryItem of directoryItems) {
    if (!directoryItem.isFile()) {
      continue
    }

    const nameMatch = /^([^.].*)\.txt$/.exec(directoryItem.name)
    if (!nameMatch) {
      continue
    }

    const filterName = nameMatch[1]
    filterSelectors[filterName] = []

    await eachLineInFile(path.join(inputDirectory, directoryItem.name), (line) => {
      const selector = line.trim()
      if (selector) {
        let selectorFilters = selectors.get(selector)
        if (!selectorFilters) {
          selectorFilters = []
          selectors.set(selector, selectorFilters)
        }
        selectorFilters.push(filterName)
      }
    })
  }

  selectors.forEach((selectorFilters, selector) => {
    if (selectorFilters.length === 1) {
      for (const filterName of selectorFilters) {
        filterSelectors[filterName].push(selector)
      }
    }
  })

  return filterSelectors
}

function stringifyResult(filterSelectors: Record<string, string[]>) {
  return JSON.stringify(filterSelectors, null, 2)
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error)
  process.exitCode = 1
})

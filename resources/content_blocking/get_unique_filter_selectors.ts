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
  const selectorsOfFilters = await getSelectorsFromDirectory(directoryPath)
  const uniqueSelectorsOfFilters = new Map<string, Set<string>>()
  const filtersOfSelectors = new Map<string, Set<string>>()

  selectorsOfFilters.forEach((selectors, filterName) => {
    uniqueSelectorsOfFilters.set(filterName, new Set())

    selectors.forEach((selector) => {
      let filtersOfSelector = filtersOfSelectors.get(selector)
      if (!filtersOfSelector) {
        filtersOfSelector = new Set()
        filtersOfSelectors.set(selector, filtersOfSelector)
      }
      filtersOfSelector.add(filterName)
    })
  })

  filtersOfSelectors.forEach((filtersOfSelector, selector) => {
    if (filtersOfSelector.size === 1) {
      filtersOfSelector.forEach((filterName) => {
        uniqueSelectorsOfFilters.get(filterName)?.add(selector)
      })
    }
  })

  return uniqueSelectorsOfFilters
}

async function getSelectorsFromDirectory(directoryPath: string) {
  const directoryItems = await fsAsync.readdir(directoryPath, { withFileTypes: true })
  const selectorsOfFilters = new Map<string, Set<string>>()

  for (const directoryItem of directoryItems) {
    if (!directoryItem.isFile()) {
      continue
    }

    const nameMatch = /^([^.].*)\.txt$/.exec(directoryItem.name)
    if (!nameMatch) {
      continue
    }

    const filterName = nameMatch[1]
    const selectors = new Set<string>()

    await eachLineInFile(path.join(inputDirectory, directoryItem.name), (line) => {
      const selector = line.trim()
      if (selector) {
        selectors.add(selector)
      }
    })

    selectorsOfFilters.set(filterName, selectors)
  }

  return selectorsOfFilters
}

function stringifyResult(filterSelectors: Map<string, Set<string>>) {
  return JSON.stringify(
    filterSelectors,
    (_, value) => {
      if (value instanceof Map) {
        const object: Record<string, unknown> = {}
        value.forEach((value: unknown, key: unknown) => (object[String(key)] = value))
        return object
      }
      if (value instanceof Set) {
        const array = new Array(value.size)
        let arrayIndex = 0
        value.forEach((value) => (array[arrayIndex++] = value))
        return array
      }
      return value
    },
    2,
  )
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error)
  process.exitCode = 1
})

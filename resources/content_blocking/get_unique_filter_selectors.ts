/*
 * See docs/content_blockers.md
 */

import * as path from 'path'
import { promises as fsAsync } from 'fs'
import { areSetsEqual, maxInIterator } from '../../src/utils/data'
import { eachLineInFile } from './utils'

const inputDirectory = path.join(__dirname, 'blocked_selectors')
const outputFile = path.join(__dirname, 'unique_filter_selectors.json')

run()

async function run() {
  const filterSelectors = await getUniqueFilterSelectors(inputDirectory)
  await fsAsync.writeFile(outputFile, stringifyResult(filterSelectors))
}

async function getUniqueFilterSelectors(directoryPath: string) {
  // Loading the selectors of the filters
  const selectorsOfFilters = await getSelectorsFromDirectory(directoryPath)

  // Building a cache. For every selector, the cache stores the list of filters that contain the selector.
  const filtersOfSelectors = new Map<string, Set<string>>()

  selectorsOfFilters.forEach((selectors, filterName) => {
    selectors.forEach((selector) => {
      let filtersOfSelector = filtersOfSelectors.get(selector)
      if (!filtersOfSelector) {
        filtersOfSelector = new Set()
        filtersOfSelectors.set(selector, filtersOfSelector)
      }
      filtersOfSelector.add(filterName)
    })
  })

  // Assigning the unique selectors to their filters
  const uniqueSelectorsOfFilters = new Map<string, Set<string>>()

  filtersOfSelectors.forEach((filtersOfSelector, selector) => {
    if (filtersOfSelector.size === 1) {
      filtersOfSelector.forEach((filterName) => {
        let uniqueSelectorsOfFilter = uniqueSelectorsOfFilters.get(filterName)
        if (!uniqueSelectorsOfFilter) {
          uniqueSelectorsOfFilter = new Set()
          uniqueSelectorsOfFilters.set(filterName, uniqueSelectorsOfFilter)
        }
        uniqueSelectorsOfFilter.add(selector)
      })
    }
  })

  // Finding almost unique selectors for each of the filters that have no unique selectors.
  // It's better than nothing. Such way we will be able to tell the following cases apart:
  // - A visitor uses filter "A" (filter "A" has no unique selectors),
  // - A visitor uses filter "AB" ("AB" is a filter that includes the "A" filter inside).
  selectorsOfFilters.forEach((selectors, filterName) => {
    if (uniqueSelectorsOfFilters.has(filterName)) {
      return
    }

    // Finding the filter's selector that appears in the fewest number of other filters
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const rarestSelector = maxInIterator(selectors.values(), (selector) => -filtersOfSelectors.get(selector)!.size)
    if (rarestSelector === undefined) {
      print(`Filter "${filterName}" has no selectors`)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const filtersOfRarestSelector = filtersOfSelectors.get(rarestSelector)!
    {
      let message = `Filter "${filterName}" is found to be included in the following filters:`
      filtersOfRarestSelector.forEach((otherFilterName) => {
        if (otherFilterName !== filterName) {
          message += `\n - ${otherFilterName}`
        }
      })
      print(message)
    }

    // Finding the selectors that appear in the same filters that the found selector
    const uniqueSelectorsOfFilter = new Set<string>()
    uniqueSelectorsOfFilters.set(filterName, uniqueSelectorsOfFilter)

    selectors.forEach((selector) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (areSetsEqual(filtersOfSelectors.get(selector)!, filtersOfRarestSelector)) {
        uniqueSelectorsOfFilter.add(selector)
      }
    })
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

function print(message: string) {
  // eslint-disable-next-line no-console
  console.log(message)
}

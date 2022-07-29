/*
 * See docs/content_blockers.md
 */

import * as path from 'path'
import { promises as fsAsync } from 'fs'
import { runCommand } from './utils'

const uniqueSelectorsFile = path.join(__dirname, 'unique_filter_selectors.json')
const codeFile = path.join(__dirname, '..', '..', 'src', 'sources', 'dom_blockers.ts')

const primeNumber = 1234577
const maxSelectorsCount = 5
const filterCodeRegex = /(?<=\n(?:export )?const filters(?:: [\w<>,\s]+)? = )\{[\s\S]+?\n}/

type Filters = Record<string, string[]>

async function run() {
  const [uniqueSelectors, currentFilters] = await Promise.all([
    fsAsync.readFile(uniqueSelectorsFile, 'utf8').then<Filters>(JSON.parse),
    parseCurrentFilters(codeFile),
  ])
  const newFilters = actualizeFilters(currentFilters, uniqueSelectors)
  await insertNewFilters(codeFile, newFilters)
  await runCommand(`eslint --fix ${JSON.stringify(codeFile)}`)
}

function actualizeFilters(currentFilters: Filters, availableRules: Filters) {
  const newFilterNames = Array.from(
    new Set<string>([...Object.keys(currentFilters), ...Object.keys(availableRules)]),
  ).sort()
  const newFilters: Filters = {}

  for (const filterName of newFilterNames) {
    if (availableRules[filterName]) {
      newFilters[filterName] = actualizeRules(currentFilters[filterName] ?? [], availableRules[filterName])
    }
  }

  return newFilters
}

/**
 * Creates a new list of ad blocker rules which is a copy of `currentRules`, but the rules that are absent in
 * `availableRules` are replaced with rules from `availableRules`.
 */
function actualizeRules(currentRules: readonly string[], availableRules: readonly string[]) {
  const newRules: string[] = []

  for (let i = 0; i < currentRules.length && newRules.length < maxSelectorsCount; ++i) {
    const selector = currentRules[i]
    if (availableRules.includes(selector)) {
      newRules.push(selector)
    }
  }

  let availableRulesIndex = 0

  while (newRules.length < Math.min(maxSelectorsCount, availableRules.length)) {
    const selector = availableRules[availableRulesIndex]
    if (!newRules.includes(selector)) {
      newRules.push(selector)
    }

    // A reproducible pseudo-random algorithm for choosing new rules
    availableRulesIndex = (availableRulesIndex + primeNumber) % availableRules.length
  }

  return newRules
}

async function parseCurrentFilters(filePath: string) {
  const fileContent = await fsAsync.readFile(filePath, 'utf8')
  const codeMatch = filterCodeRegex.exec(fileContent)
  if (!codeMatch) {
    throw new Error(`The ${JSON.stringify(filePath)} doesn't have the expected pattern of the filter code`)
  }

  return new Function(`return ${codeMatch[0]}`)() as Filters
}

async function insertNewFilters(filePath: string, filters: Filters) {
  const fileContent = await fsAsync.readFile(filePath, 'utf8')
  const newFileContent = fileContent.replace(filterCodeRegex, JSON.stringify(filters, null, 2))
  await fsAsync.writeFile(filePath, newFileContent)
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error)
  process.exitCode = 1
})

import * as fs from 'fs'
import * as readline from 'readline'
import { spawn, SpawnOptions } from 'child_process'
import { URL } from 'url'
import got from 'got'

export async function eachLineInFile(
  filePath: string,
  callback: (line: string) => void | Promise<void>,
): Promise<void> {
  const fileStream = fs.createReadStream(filePath)

  try {
    const reader = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    })
    const iterator = reader[Symbol.asyncIterator]()

    for (;;) {
      const value = await iterator.next()
      if (value.done) {
        break
      }

      await callback(value.value)
    }
  } finally {
    fileStream.destroy()
  }
}

export async function fetchFilter(
  url: string,
  abort?: Promise<unknown>,
  forceTreatAsFilter = false,
): Promise<string[]> {
  const request = got(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/91.0.4472.114 Safari/537.36',
    },
  })

  abort?.catch(() => undefined).then(() => request.cancel())

  const response = await request.catch((error) => {
    if (request.isCanceled) {
      // Never resolve the promise of the function when it's aborted
      return new Promise<never>(() => undefined)
    }
    throw error
  })

  if (response.statusCode >= 300) {
    throw new Error(`HTTP status ${response.statusCode} (${response.statusMessage})`)
  }

  if (
    !forceTreatAsFilter &&
    !/^( *\[Adblock Plus.*] *(\r\n|\r|\n))?( *! *[a-z].*(\r\n|\r|\n)){2}/im.test(response.body)
  ) {
    throw new Error("The response doesn't look like a filter")
  }

  const filterLines = response.body.split(/(\r\n|\r|\n)/) // AdGuard filters use \r sometimes
  const subFilterURLs: string[] = []

  for (const line of filterLines) {
    const match = /^!#include +(.*?) *$/.exec(line)
    if (match) {
      // See https://stackoverflow.com/a/45801884/1118709
      const subFilterURL = new URL(match[1], url).href
      subFilterURLs.push(subFilterURL)
    }
  }

  await Promise.all(
    subFilterURLs.map(async (subFilterURL) => {
      let subFilterLines: string[]
      try {
        // We expect no recursion in actual filters
        subFilterLines = await fetchFilter(subFilterURL, abort, true)
      } catch (error) {
        throw new Error(`Failed to fetch a sub-filter (${subFilterURL}): ${error}`)
      }
      filterLines.push(...subFilterLines)
    }),
  )

  return filterLines
}

export function runCommand(command: string, options: SpawnOptions = {}): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, [], { shell: true, ...options })
    child.stdout?.pipe(process.stdout)
    child.stderr?.pipe(process.stderr)
    child.on('error', reject)
    child.on('close', (code) => {
      if (code) {
        reject(new Error(`The ${command} command has exited with code ${code}`))
      } else {
        resolve()
      }
    })
  })
}

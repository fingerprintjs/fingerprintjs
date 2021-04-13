import * as fs from 'fs'
import * as readline from 'readline'

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

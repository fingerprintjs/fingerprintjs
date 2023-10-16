/*
 * This file contains functions to work with pure data only (no browser features, DOM, side effects, etc).
 */

/**
 * Does the same as Array.prototype.includes but has better typing
 */
export function includes<THaystack>(haystack: ArrayLike<THaystack>, needle: unknown): needle is THaystack {
  for (let i = 0, l = haystack.length; i < l; ++i) {
    if (haystack[i] === needle) {
      return true
    }
  }
  return false
}

/**
 * Like `!includes()` but with proper typing
 */
export function excludes<THaystack, TNeedle>(
  haystack: ArrayLike<THaystack>,
  needle: TNeedle,
): needle is Exclude<TNeedle, THaystack> {
  return !includes(haystack, needle)
}

/**
 * Be careful, NaN can return
 */
export function toInt(value: unknown): number {
  return parseInt(value as string)
}

/**
 * Be careful, NaN can return
 */
export function toFloat(value: unknown): number {
  return parseFloat(value as string)
}

export function replaceNaN<T, U>(value: T, replacement: U): T | U {
  return typeof value === 'number' && isNaN(value) ? replacement : value
}

export function countTruthy(values: unknown[]): number {
  return values.reduce<number>((sum, value) => sum + (value ? 1 : 0), 0)
}

export function round(value: number, base = 1): number {
  if (Math.abs(base) >= 1) {
    return Math.round(value / base) * base
  } else {
    // Sometimes when a number is multiplied by a small number, precision is lost,
    // for example 1234 * 0.0001 === 0.12340000000000001, and it's more precise divide: 1234 / (1 / 0.0001) === 0.1234.
    const counterBase = 1 / base
    return Math.round(value * counterBase) / counterBase
  }
}

/**
 * Parses a CSS selector into tag name with HTML attributes.
 * Only single element selector are supported (without operators like space, +, >, etc).
 *
 * Multiple values can be returned for each attribute. You decide how to handle them.
 */
export function parseSimpleCssSelector(
  selector: string,
): [tag: string | undefined, attributes: Record<string, string[]>] {
  const errorMessage = `Unexpected syntax '${selector}'`
  const tagMatch = /^\s*([a-z-]*)(.*)$/i.exec(selector) as RegExpExecArray
  const tag = tagMatch[1] || undefined
  const attributes: Record<string, string[]> = {}
  const partsRegex = /([.:#][\w-]+|\[.+?\])/gi

  const addAttribute = (name: string, value: string) => {
    attributes[name] = attributes[name] || []
    attributes[name].push(value)
  }

  for (;;) {
    const match = partsRegex.exec(tagMatch[2])
    if (!match) {
      break
    }
    const part = match[0]
    switch (part[0]) {
      case '.':
        addAttribute('class', part.slice(1))
        break
      case '#':
        addAttribute('id', part.slice(1))
        break
      case '[': {
        const attributeMatch = /^\[([\w-]+)([~|^$*]?=("(.*?)"|([\w-]+)))?(\s+[is])?\]$/.exec(part)
        if (attributeMatch) {
          addAttribute(attributeMatch[1], attributeMatch[4] ?? attributeMatch[5] ?? '')
        } else {
          throw new Error(errorMessage)
        }
        break
      }
      default:
        throw new Error(errorMessage)
    }
  }

  return [tag, attributes]
}

export function areSetsEqual(set1: Set<unknown>, set2: Set<unknown>): boolean {
  if (set1 === set2) {
    return true
  }
  if (set1.size !== set2.size) {
    return false
  }

  for (let iter = set1.values(), step = iter.next(); !step.done; step = iter.next()) {
    if (!set2.has(step.value)) {
      return false
    }
  }
  return true
}

export function maxInIterator<T>(iterator: Iterator<T>, getItemScore: (item: T) => number): T | undefined {
  let maxItem: T | undefined
  let maxItemScore: number | undefined

  for (let step = iterator.next(); !step.done; step = iterator.next()) {
    const item = step.value
    const score = getItemScore(item)
    if (maxItemScore === undefined || score > maxItemScore) {
      maxItem = item
      maxItemScore = score
    }
  }

  return maxItem
}

/**
 * Converts a string to UTF8 bytes
 */
export function getUTF8Bytes(input: string): Uint8Array {
  // Benchmark: https://jsbench.me/b6klaaxgwq/1
  // If you want to just count bytes, see solutions at https://jsbench.me/ehklab415e/1
  const result = new Uint8Array(input.length)
  for (let i = 0; i < input.length; i++) {
    // `charCode` is faster than encoding, so we prefer that when it's possible
    const charCode = input.charCodeAt(i)

    // In case of non-ASCII symbols we use proper encoding
    if (charCode > 127) {
      return new TextEncoder().encode(input)
    }
    result[i] = charCode
  }
  return result
}

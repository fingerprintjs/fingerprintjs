/*
 * This file contains functions to work with pure data only (no browser features, DOM, side effects, etc).
 */

/**
 * Does the same as Array.prototype.includes but has better typing
 */
export function includes<THaystack>(
  haystack: ArrayLike<THaystack>,
  needle: unknown,
): needle is THaystack {
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
  if (typeof value === 'number') {
    return value | 0
  }
  return parseInt(value as string)
}

/**
 * Be careful, NaN can return
 */
export function toFloat(value: unknown): number {
  if (typeof value === 'number') {
    return value
  }
  return parseFloat(value as string)
}

export function countTruthy(values: unknown[]): number {
  return values.reduce<number>((sum, value) => sum + (value ? 1 : 0), 0)
}

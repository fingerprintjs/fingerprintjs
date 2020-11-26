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

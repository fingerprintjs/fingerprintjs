/*
 * This file contains functions to work with pure data only (no browser features, DOM, side effects, etc).
 */

/**
 * Does the same as Array.prototype.includes but has advances typing
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

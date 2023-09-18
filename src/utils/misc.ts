/**
 * Converts an error object to a plain object that can be used with `JSON.stringify`.
 * If you just run `JSON.stringify(error)`, you'll get `'{}'`.
 */
export function errorToObject(error: Readonly<Error>): Record<string, unknown> {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack?.split('\n'),
    // The fields are not enumerable, so TS is wrong saying that they will be overridden
    ...(error as Omit<Error, 'name' | 'message'>),
  }
}

export function isFunctionNative(func: (...args: unknown[]) => unknown): boolean {
  return /^function\s.*?\{\s*\[native code]\s*}$/.test(String(func))
}

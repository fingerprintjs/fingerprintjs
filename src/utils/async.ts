export type MaybePromise<T> = Promise<T> | T

export function wait<T = void>(durationMs: number, resolveWith?: T): Promise<T> {
  return new Promise((resolve) => setTimeout(resolve, durationMs, resolveWith))
}

/**
 * Allows asynchronous actions and microtasks to happen.
 */
export function releaseEventLoop(): Promise<void> {
  return wait(0)
}

export function requestIdleCallbackIfAvailable(fallbackTimeout: number, deadlineTimeout = Infinity): Promise<void> {
  const { requestIdleCallback } = window
  if (requestIdleCallback) {
    // The function `requestIdleCallback` loses the binding to `window` here.
    // `globalThis` isn't always equal `window` (see https://github.com/fingerprintjs/fingerprintjs/issues/683).
    // Therefore, an error can occur. `call(window,` prevents the error.
    return new Promise((resolve) => requestIdleCallback.call(window, () => resolve(), { timeout: deadlineTimeout }))
  } else {
    return wait(Math.min(fallbackTimeout, deadlineTimeout))
  }
}

export function isPromise<T>(value: PromiseLike<T> | unknown): value is PromiseLike<T> {
  return !!value && typeof (value as PromiseLike<T>).then === 'function'
}

/**
 * Calls a maybe asynchronous function without creating microtasks when the function is synchronous.
 * Catches errors in both cases.
 *
 * If just you run a code like this:
 * ```
 * console.time('Action duration')
 * await action()
 * console.timeEnd('Action duration')
 * ```
 * The synchronous function time can be measured incorrectly because another microtask may run before the `await`
 * returns the control back to the code.
 */
export function awaitIfAsync<TResult, TError = unknown>(
  action: () => MaybePromise<TResult>,
  callback: (...args: [success: true, result: TResult] | [success: false, error: TError]) => unknown,
): void {
  try {
    const returnedValue = action()
    if (isPromise(returnedValue)) {
      returnedValue.then(
        (result) => callback(true, result),
        (error: TError) => callback(false, error),
      )
    } else {
      callback(true, returnedValue)
    }
  } catch (error) {
    callback(false, error as TError)
  }
}

/**
 * If you run many synchronous tasks without using this function, the JS main loop will be busy and asynchronous tasks
 * (e.g. completing a network request, rendering the page) won't be able to happen.
 * This function allows running many synchronous tasks such way that asynchronous tasks can run too in background.
 */
export async function mapWithBreaks<T, U>(
  items: readonly T[],
  callback: (item: T, index: number) => U,
  loopReleaseInterval = 16,
): Promise<U[]> {
  const results = Array<U>(items.length)
  let lastLoopReleaseTime = Date.now()

  for (let i = 0; i < items.length; ++i) {
    results[i] = callback(items[i], i)

    const now = Date.now()
    if (now >= lastLoopReleaseTime + loopReleaseInterval) {
      lastLoopReleaseTime = now
      // Allows asynchronous actions and microtasks to happen
      await wait(0)
    }
  }

  return results
}

/**
 * Makes the given promise never emit an unhandled promise rejection console warning.
 * The promise will still pass errors to the next promises.
 *
 * Otherwise, promise emits a console warning unless it has a `catch` listener.
 */
export function suppressUnhandledRejectionWarning(promise: PromiseLike<unknown>): void {
  promise.then(undefined, () => undefined)
}

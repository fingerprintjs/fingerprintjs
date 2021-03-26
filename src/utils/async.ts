export function wait<T = void>(durationMs: number, resolveWith?: T): Promise<T> {
  return new Promise((resolve) => setTimeout(resolve, durationMs, resolveWith))
}

export function requestIdleCallbackIfAvailable(fallbackTimeout: number, deadlineTimeout = Infinity): Promise<void> {
  const { requestIdleCallback } = window
  if (requestIdleCallback) {
    return new Promise((resolve) => requestIdleCallback(() => resolve(), { timeout: deadlineTimeout }))
  } else {
    return wait(Math.min(fallbackTimeout, deadlineTimeout))
  }
}

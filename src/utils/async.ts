const w = window

export function requestIdleCallbackIfAvailable(fallbackTimeout: number, deadlineTimeout = Infinity): Promise<void> {
  return new Promise((resolve) => {
    if (w.requestIdleCallback) {
      w.requestIdleCallback(() => resolve(), { timeout: deadlineTimeout })
    } else {
      setTimeout(resolve, Math.min(fallbackTimeout, deadlineTimeout))
    }
  })
}

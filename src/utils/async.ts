export function requestIdleCallbackIfAvailable(fallbackTimeout: number, deadlineTimeout = Infinity): Promise<void> {
  return new Promise((resolve) => {
    const { requestIdleCallback } = window
    if (requestIdleCallback) {
      requestIdleCallback(() => resolve(), { timeout: deadlineTimeout })
    } else {
      setTimeout(resolve, Math.min(fallbackTimeout, deadlineTimeout))
    }
  })
}

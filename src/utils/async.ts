const w = window

export function requestIdleCallbackIfAvailable(fallbackTimeout: number): Promise<void> {
  return new Promise((resolve) => {
    if (w.requestIdleCallback) {
      w.requestIdleCallback(() => resolve())
    } else {
      setTimeout(resolve, fallbackTimeout)
    }
  })
}

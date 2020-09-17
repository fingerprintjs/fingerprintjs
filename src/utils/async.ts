export function requestIdleCallbackIfAvailable(fallbackTimeout: number): Promise<void> {
  return new Promise((resolve) => {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => resolve())
    } else {
      setTimeout(resolve, fallbackTimeout)
    }
  })
}

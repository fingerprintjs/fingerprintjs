/* Browser APIs not described by TypeScript */

interface IdleDeadline {
  readonly didTimeout: boolean
  timeRemaining: () => number
}

interface Window {
  requestIdleCallback?(idleCallback: (deadline: IdleDeadline) => void, options?: { timeout?: number }): number
  cancelIdleCallback?(handle: number): void
  webkitOfflineAudioContext?: OfflineAudioContext
  openDatabase?(...args: unknown[]): void
  chrome?: Record<string, unknown>
}

interface Navigator {
  oscpu?: string
  userLanguage?: string
  browserLanguage?: string
  systemLanguage?: string
  deviceMemory?: number
  cpuClass?: string
}

/* Browser APIs not described by TypeScript */

interface Window {
  webkitOfflineAudioContext?: OfflineAudioContext
  openDatabase?(...args: unknown[]): void
  ApplePaySession?: ApplePaySessionConstructor
  __fpjs_d_m?: unknown
  URLPattern?: new (...args: unknown[]) => unknown
}

interface Navigator {
  oscpu?: string
  userLanguage?: string
  browserLanguage?: string
  systemLanguage?: string
  deviceMemory?: number
  cpuClass?: string
  readonly msMaxTouchPoints?: number
  connection?: {
    ontypechange?: () => void
  }
}

interface Document {
  msFullscreenElement?: typeof document.fullscreenElement
  mozFullScreenElement?: typeof document.fullscreenElement
  webkitFullscreenElement?: typeof document.fullscreenElement

  msExitFullscreen?: typeof document.exitFullscreen
  mozCancelFullScreen?: typeof document.exitFullscreen
  webkitExitFullscreen?: typeof document.exitFullscreen
}

interface Screen {
  availLeft?: number
  availTop?: number
}

interface Element {
  webkitRequestFullscreen?: typeof Element.prototype.requestFullscreen
}

interface CSSStyleDeclaration {
  zoom: string
  textSizeAdjust: string
}

/** @see https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_js_api */
interface ApplePaySessionConstructor {
  /** @see https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_js_api/creating_an_apple_pay_session */
  new (version: number, request: Record<never, never>): never
  /** @see https://developer.apple.com/documentation/apple_pay_on_the_web/applepaysession/1778027-canmakepayments */
  canMakePayments(): boolean
}

interface HTMLAnchorElement {
  // See https://webkit.org/blog/11529/introducing-private-click-measurement-pcm/
  attributionSourceId?: number
  /** Before Safari 15.4. The value is a string in Safari 14. */
  attributionsourceid?: number | string
}

interface HTMLMediaElement {
  sinkId?: string
}

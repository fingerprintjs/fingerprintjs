/* Browser APIs not described by TypeScript */

interface Window {
  webkitOfflineAudioContext?: OfflineAudioContext
  openDatabase?(...args: unknown[]): void
  __fpjs_d_m?: unknown
}

interface Navigator {
  oscpu?: string
  userLanguage?: string
  browserLanguage?: string
  systemLanguage?: string
  deviceMemory?: number
  cpuClass?: string
  readonly msMaxTouchPoints?: number
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
  webkitTextSizeAdjust: string
}

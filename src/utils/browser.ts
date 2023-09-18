import { countTruthy } from './data'
import { isFunctionNative } from './misc'

/*
 * Functions to help with features that vary through browsers
 */

/**
 * Checks whether the browser is based on Trident (the Internet Explorer engine) without using user-agent.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function isTrident(): boolean {
  const w = window
  const n = navigator

  // The properties are checked to be in IE 10, IE 11 and not to be in other browsers in October 2020
  return (
    countTruthy([
      'MSCSSMatrix' in w,
      'msSetImmediate' in w,
      'msIndexedDB' in w,
      'msMaxTouchPoints' in n,
      'msPointerEnabled' in n,
    ]) >= 4
  )
}

/**
 * Checks whether the browser is based on EdgeHTML (the pre-Chromium Edge engine) without using user-agent.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function isEdgeHTML(): boolean {
  // Based on research in October 2020
  const w = window
  const n = navigator

  return (
    countTruthy(['msWriteProfilerMark' in w, 'MSStream' in w, 'msLaunchUri' in n, 'msSaveBlob' in n]) >= 3 &&
    !isTrident()
  )
}

/**
 * Checks whether the browser is based on Chromium without using user-agent.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function isChromium(): boolean {
  // Based on research in October 2020. Tested to detect Chromium 42-86.
  const w = window
  const n = navigator

  return (
    countTruthy([
      'webkitPersistentStorage' in n,
      'webkitTemporaryStorage' in n,
      n.vendor.indexOf('Google') === 0,
      'webkitResolveLocalFileSystemURL' in w,
      'BatteryManager' in w,
      'webkitMediaStream' in w,
      'webkitSpeechGrammar' in w,
    ]) >= 5
  )
}

/**
 * Checks whether the browser is based on mobile or desktop Safari without using user-agent.
 * All iOS browsers use WebKit (the Safari engine).
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function isWebKit(): boolean {
  // Based on research in September 2020
  const w = window
  const n = navigator

  return (
    countTruthy([
      'ApplePayError' in w,
      'CSSPrimitiveValue' in w,
      'Counter' in w,
      n.vendor.indexOf('Apple') === 0,
      'getStorageUpdates' in n,
      'WebKitMediaKeys' in w,
    ]) >= 4
  )
}

/**
 * Checks whether this WebKit browser is a desktop browser.
 * It doesn't check that the browser is based on WebKit, there is a separate function for this.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function isDesktopWebKit(): boolean {
  // Checked in Safari and DuckDuckGo

  const w = window
  const { HTMLElement, Document } = w

  return (
    countTruthy([
      'safari' in w, // Always false in Karma and BrowserStack Automate
      !('ongestureend' in w),
      !('TouchEvent' in w),
      !('orientation' in w),
      HTMLElement && !('autocapitalize' in HTMLElement.prototype),
      Document && 'pointerLockElement' in Document.prototype,
    ]) >= 4
  )
}

/**
 * Checks whether this WebKit browser is Safari.
 * It doesn't check that the browser is based on WebKit, there is a separate function for this.
 *
 * Warning! The function works properly only for Safari version 15 and newer.
 */
export function isSafariWebKit(): boolean {
  // Checked in Safari, Chrome, Firefox, Yandex, UC Browser, Opera, Edge and DuckDuckGo.
  // iOS Safari and Chrome were checked on iOS 11-17. DuckDuckGo was checked on iOS 17 and macOS 14.
  // Desktop Safari versions 12-17 were checked.
  // The other browsers were checked on iOS 17; there was no chance to check them on the other OS versions.

  const w = window

  if (!isFunctionNative(w.print)) {
    return false // Chrome, Firefox, Yandex, DuckDuckGo macOS, Edge
  }

  return (
    countTruthy([
      // Incorrect in Safari <= 14 (iOS and macOS)
      String((w as unknown as Record<string, unknown>).browser) === '[object WebPageNamespace]',
      // Incorrect in desktop Safari and iOS Safari <= 15
      'MicrodataExtractor' in w,
    ]) >= 1
  )
}

/**
 * Checks whether the browser is based on Gecko (Firefox engine) without using user-agent.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function isGecko(): boolean {
  const w = window

  // Based on research in September 2020
  return (
    countTruthy([
      'buildID' in navigator,
      'MozAppearance' in (document.documentElement?.style ?? {}),
      'onmozfullscreenchange' in w,
      'mozInnerScreenX' in w,
      'CSSMozDocumentRule' in w,
      'CanvasCaptureMediaStream' in w,
    ]) >= 4
  )
}

/**
 * Checks whether the browser is based on Chromium version ≥86 without using user-agent.
 * It doesn't check that the browser is based on Chromium, there is a separate function for this.
 */
export function isChromium86OrNewer(): boolean {
  // Checked in Chrome 85 vs Chrome 86 both on desktop and Android
  const w = window

  return (
    countTruthy([
      !('MediaSettingsRange' in w),
      'RTCEncodedAudioFrame' in w,
      '' + w.Intl === '[object Intl]',
      '' + w.Reflect === '[object Reflect]',
    ]) >= 3
  )
}

/**
 * Checks whether the browser is based on WebKit version ≥606 (Safari ≥12) without using user-agent.
 * It doesn't check that the browser is based on WebKit, there is a separate function for this.
 *
 * @see https://en.wikipedia.org/wiki/Safari_version_history#Release_history Safari-WebKit versions map
 */
export function isWebKit606OrNewer(): boolean {
  // Checked in Safari 9–17
  const w = window

  return (
    countTruthy([
      'DOMRectList' in w,
      'RTCPeerConnectionIceEvent' in w,
      'SVGGeometryElement' in w,
      'ontransitioncancel' in w,
    ]) >= 3
  )
}

/**
 * Checks whether the browser is based on WebKit version ≥616 (Safari ≥17) without using user-agent.
 * It doesn't check that the browser is based on WebKit, there is a separate function for this.
 *
 * @see https://developer.apple.com/documentation/safari-release-notes/safari-17-release-notes Safari 17 release notes
 * @see https://tauri.app/v1/references/webview-versions/#webkit-versions-in-safari Safari-WebKit versions map
 */
export function isWebKit616OrNewer(): boolean {
  const w = window
  const n = navigator
  const { CSS, HTMLButtonElement } = w

  return (
    countTruthy([
      !('getStorageUpdates' in n),
      HTMLButtonElement && 'popover' in HTMLButtonElement.prototype,
      'CSSCounterStyleRule' in w,
      CSS.supports('font-size-adjust: ex-height 0.5'),
      CSS.supports('text-transform: full-width'),
    ]) >= 4
  )
}

/**
 * Checks whether the device is an iPad.
 * It doesn't check that the engine is WebKit and that the WebKit isn't desktop.
 */
export function isIPad(): boolean {
  // Checked on:
  // Safari on iPadOS (both mobile and desktop modes): 8, 11-17
  // Chrome on iPadOS (both mobile and desktop modes): 11-17
  // Safari on iOS (both mobile and desktop modes): 9-17
  // Chrome on iOS (both mobile and desktop modes): 9-17

  // Before iOS 13. Safari tampers the value in "request desktop site" mode since iOS 13.
  if (navigator.platform === 'iPad') {
    return true
  }

  const s = screen
  const screenRatio = s.width / s.height

  return (
    countTruthy([
      'MediaSource' in window, // Since iOS 13
      !!Element.prototype.webkitRequestFullscreen, // Since iOS 12
      // iPhone 4S that runs iOS 9 matches this, but it is not supported
      screenRatio > 0.65 && screenRatio < 1.53,
    ]) >= 2
  )
}

/**
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function getFullscreenElement(): Element | null {
  const d = document
  return d.fullscreenElement || d.msFullscreenElement || d.mozFullScreenElement || d.webkitFullscreenElement || null
}

export function exitFullscreen(): Promise<void> {
  const d = document
  // `call` is required because the function throws an error without a proper "this" context
  return (d.exitFullscreen || d.msExitFullscreen || d.mozCancelFullScreen || d.webkitExitFullscreen).call(d)
}

/**
 * Checks whether the device runs on Android without using user-agent.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function isAndroid(): boolean {
  const isItChromium = isChromium()
  const isItGecko = isGecko()

  // Only 2 browser engines are presented on Android.
  // Actually, there is also Android 4.1 browser, but it's not worth detecting it at the moment.
  if (!isItChromium && !isItGecko) {
    return false
  }

  const w = window

  // Chrome removes all words "Android" from `navigator` when desktop version is requested
  // Firefox keeps "Android" in `navigator.appVersion` when desktop version is requested
  return (
    countTruthy([
      'onorientationchange' in w,
      'orientation' in w,
      isItChromium && !('SharedWorker' in w),
      isItGecko && /android/i.test(navigator.appVersion),
    ]) >= 2
  )
}

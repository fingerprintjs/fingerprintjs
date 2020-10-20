import { countTruthy } from './data'

/*
 * Functions to help with browser features
 */

const w = window
const n = navigator
const d = document

/**
 * Checks whether the browser is Internet Explorer or pre-Chromium Edge without using user-agent.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function isIEOrOldEdge(): boolean {
  // The properties are checked to be in IE 10, IE 11 and Edge 18 and not to be in other browsers
  return countTruthy(['msWriteProfilerMark' in w, 'msLaunchUri' in n, 'msSaveBlob' in n]) >= 2
}

/**
 * Checks whether the browser is based on Chromium without using user-agent.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function isChromium(): boolean {
  // Based on research in September 2020
  return (
    countTruthy([
      'userActivation' in n,
      'mediaSession' in n,
      n.vendor.indexOf('Google') === 0,
      'BackgroundFetchManager' in w,
      'BatteryManager' in w,
      'webkitMediaStream' in w,
      'webkitSpeechGrammar' in w,
    ]) >= 5
  )
}

/**
 * Checks whether the browser is based on mobile or desktop Safari without using user-agent.
 * All iOS browsers use WebKit (the Safari engine).
 */
export function isWebKit(): boolean {
  // Based on research in September 2020
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
 * Checks whether the WebKit browser is a desktop Safari.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function isDesktopSafari(): boolean {
  return 'safari' in w
}

/**
 * Checks whether the browser is based on Gecko (Firefox engine) without using user-agent.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function isGecko(): boolean {
  // Based on research in September 2020
  return (
    countTruthy([
      'buildID' in n,
      d.documentElement?.style && 'MozAppearance' in d.documentElement.style,
      'MediaRecorderErrorEvent' in w,
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
  return (
    countTruthy([
      !('MediaSettingsRange' in w),
      !('PhotoCapabilities' in w),
      'RTCEncodedAudioFrame' in w,
      '' + w.Intl === '[object Intl]',
    ]) >= 2
  )
}

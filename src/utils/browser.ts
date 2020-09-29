import { countTruthy } from './data'

/*
 * Functions to help with browser features
 */

const w = window
const n = navigator
const d = document

/**
 * Checks whether the browser is Internet Explorer or pre-Chromium Edge without using user-agent
 */
export function isIEOrOldEdge(): boolean {
  // The properties are checked to be in IE 10, IE 11 and Edge 18 and not to be in other browsers
  return countTruthy([
    'msWriteProfilerMark' in w,
    'msLaunchUri' in n,
    'msSaveBlob' in n,
  ]) >= 2
}

/**
 * Checks whether the browser is based on Chromium without using user-agent
 */
export function isChromium(): boolean {
  // Based on research in September 2020
  return countTruthy([
    'userActivation' in n,
    'mediaSession' in n,
    n.vendor.indexOf('Google') === 0,
    'BackgroundFetchManager' in w,
    'BatteryManager' in w,
    'webkitMediaStream' in w,
    'webkitSpeechGrammar' in w,
  ]) >= 5
}

/**
 * Checks whether the browser is based on mobile or desktop Safari without using user-agent.
 * All iOS browsers use WebKit (the Safari engine).
 */
export function isWebKit(): boolean {
  // Based on research in September 2020
  return countTruthy([
    'ApplePayError' in w,
    'CSSPrimitiveValue' in w,
    'Counter' in w,
    n.vendor.indexOf('Apple') === 0,
    'getStorageUpdates' in n,
    'WebKitMediaKeys' in w,
  ]) >= 4
}

export function isDesktopSafari(): boolean {
  return 'safari' in w
}

/**
 * Checks whether the browser is based on Gecko (Firefox engine) without using user-agent
 */
export function isGecko(): boolean {
  // Based on research in September 2020
  return countTruthy([
    'buildID' in n,
    d.documentElement?.style && 'MozAppearance' in d.documentElement.style,
    'MediaRecorderErrorEvent' in w,
    'mozInnerScreenX' in w,
    'CSSMozDocumentRule' in w,
    'CanvasCaptureMediaStream' in w,
  ]) >= 4
}

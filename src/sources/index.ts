import { loadSources, SourcesToComponents } from '../utils/entropy_source'

import getApplePayState from './apple_pay'
import getArchitecture from './architecture'
import getAudioFingerprint from './audio'
import getAudioContextBaseLatency from './audio_base_latency'
import getCanvasFingerprint from './canvas'
import getColorDepth from './color_depth'
import getColorGamut from './color_gamut'
import getContrastPreference from './contrast'
import areCookiesEnabled from './cookies_enabled'
import getCpuClass from './cpu_class'
import getDateTimeLocale from './date_time_locale'
import getDeviceMemory from './device_memory'
import getDomBlockers from './dom_blockers'
import getFontPreferences from './font_preferences'
import getFonts from './fonts'
import areColorsForced from './forced_colors'
import getHardwareConcurrency from './hardware_concurrency'
import isHDR from './hdr'
import getIndexedDB from './indexed_db'
import areColorsInverted from './inverted_colors'
import getLanguages from './languages'
import getLocalStorage from './local_storage'
import getMathFingerprint from './math'
import getMonochromeDepth from './monochrome'
import getOpenDatabase from './open_database'
import getOsCpu from './os_cpu'
import isPdfViewerEnabled from './pdf_viewer_enabled'
import getPlatform from './platform'
import getPlugins from './plugins'
import getPrivateClickMeasurement from './private_click_measurement'
import isMotionReduced from './reduced_motion'
import isTransparencyReduced from './reduced_transparency'
import getScreenFrame from './screen_frame'
import getScreenResolution from './screen_resolution'
import getSessionStorage from './session_storage'
import getTimezone from './timezone'
import getTouchSupport from './touch_support'
import getUserAgentData from './user_agent_data'
import getVendor from './vendor'
import getVendorFlavors from './vendor_flavors'
import { getWebGlBasics, getWebGlExtensions } from './webgl'

/**
 * The list of entropy sources used to make visitor identifiers.
 *
 * This value isn't restricted by Semantic Versioning, i.e. it may be changed without bumping minor or major version of
 * this package.
 *
 * Note: Rollup and Webpack are smart enough to remove unused properties of this object during tree-shaking, so there is
 * no need to export the sources individually.
 */
export const sources = {
  // READ FIRST:
  // See https://github.com/fingerprintjs/fingerprintjs/blob/master/contributing.md#how-to-add-an-entropy-source
  // to learn how entropy source works and how to make your own.

  // The sources run in this exact order.
  // The asynchronous sources are at the start to run in parallel with other sources.
  userAgentData: getUserAgentData,
  fonts: getFonts,
  domBlockers: getDomBlockers,
  fontPreferences: getFontPreferences,
  audio: getAudioFingerprint,
  screenFrame: getScreenFrame,

  canvas: getCanvasFingerprint,
  osCpu: getOsCpu,
  languages: getLanguages,
  colorDepth: getColorDepth,
  deviceMemory: getDeviceMemory,
  screenResolution: getScreenResolution,
  hardwareConcurrency: getHardwareConcurrency,
  timezone: getTimezone,
  sessionStorage: getSessionStorage,
  localStorage: getLocalStorage,
  indexedDB: getIndexedDB,
  openDatabase: getOpenDatabase,
  cpuClass: getCpuClass,
  platform: getPlatform,
  plugins: getPlugins,
  touchSupport: getTouchSupport,
  vendor: getVendor,
  vendorFlavors: getVendorFlavors,
  cookiesEnabled: areCookiesEnabled,
  colorGamut: getColorGamut,
  invertedColors: areColorsInverted,
  forcedColors: areColorsForced,
  monochrome: getMonochromeDepth,
  contrast: getContrastPreference,
  reducedMotion: isMotionReduced,
  reducedTransparency: isTransparencyReduced,
  hdr: isHDR,
  math: getMathFingerprint,
  pdfViewerEnabled: isPdfViewerEnabled,
  architecture: getArchitecture,
  applePay: getApplePayState,
  privateClickMeasurement: getPrivateClickMeasurement,
  audioBaseLatency: getAudioContextBaseLatency,
  dateTimeLocale: getDateTimeLocale,

  // Some sources can affect other sources (e.g. WebGL can affect canvas), so it's important to run these sources
  // after other sources.
  webGlBasics: getWebGlBasics,
  webGlExtensions: getWebGlExtensions,
}

/**
 * List of components from the built-in entropy sources.
 *
 * Warning! This type is out of Semantic Versioning, i.e. may have incompatible changes within a major version. If you
 * want to avoid breaking changes, use `UnknownComponents` instead that is more generic but guarantees backward
 * compatibility within a major version. This is because browsers change constantly and therefore entropy sources have
 * to change too.
 */
export type BuiltinComponents = SourcesToComponents<typeof sources>

export interface BuiltinSourceOptions {
  debug?: boolean
  cache: Record<string, unknown>
}

/**
 * Loads the built-in entropy sources.
 * Returns a function that collects the entropy components to make the visitor identifier.
 */
export default function loadBuiltinSources(options: BuiltinSourceOptions): () => Promise<BuiltinComponents> {
  return loadSources(sources, options, [])
}

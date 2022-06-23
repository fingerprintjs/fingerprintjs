import { x64hash128 } from './utils/hashing'

export * from './index'

/*
 * The exports below are for private usage. They may change unexpectedly. Use them at your own risk.
 */

/** Not documented, out of Semantic Versioning, usage is at your own risk */
export const murmurX64Hash128 = x64hash128
export { prepareForSources } from './agent'
export {
  getAudioFingerprint,
  getFonts,
  getPlugins,
  getCanvasFingerprint,
  getTouchSupport,
  getOsCpu,
  getLanguages,
  getColorDepth,
  getDeviceMemory,
  getScreenResolution,
  getScreenFrame,
  getHardwareConcurrency,
  getTimezone,
  getSessionStorage,
  getLocalStorage,
  getIndexedDB,
  getOpenDatabase,
  getCpuClass,
  getPlatform,
  getVendor,
  getVendorFlavors,
  areCookiesEnabled,
  getDomBlockers,
  getColorGamut,
  areColorsInverted,
  areColorsForced,
  getMonochromeDepth,
  getContrastPreference,
  isMotionReduced,
  isHDR,
  getMathFingerprint,
  getFontPreferences,
} from './sources'
export {
  getFullscreenElement,
  isAndroid,
  isTrident,
  isEdgeHTML,
  isChromium,
  isWebKit,
  isGecko,
  isDesktopSafari,
} from './utils/browser'
export {
  loadSources,
  Source,
  SourcesToComponents,
  transformSource, // Not used here but adds only 222 uncompressed (60 compressed) bytes of code
  UnknownSources,
} from './utils/entropy_source'

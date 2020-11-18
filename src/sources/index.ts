/* eslint-disable @typescript-eslint/no-explicit-any */
import { excludes } from '../utils/data'
import getAudioFingerprint from './audio'
import getFonts from './fonts'
import getPlugins from './plugins'
import getCanvasFingerprint from './canvas'
import getTouchSupport from './touch_support'
import getOsCpu from './os_cpu'
import getLanguages from './languages'
import getColorDepth from './color_depth'
import getDeviceMemory from './device_memory'
import getScreenResolution from './screen_resolution'
import getAvailableScreenResolution from './available_screen_resolution'
import getHardwareConcurrency from './hardware_concurrency'
import getTimezoneOffset from './timezone_offset'
import getTimezone from './timezone'
import getSessionStorage from './session_storage'
import getLocalStorage from './location_storage'
import getIndexedDB from './indexed_db'
import getOpenDatabase from './open_database'
import getCpuClass from './cpu_class'
import getPlatform from './platform'
import getPluginsSupport from './plugins_support'
import getProductSub from './product_sub'
import getEmptyEvalLength from './empty_eval_length'
import getErrorFF from './error_ff'
import getVendor from './vendor'
import getChrome from './chrome'
import areCookiesEnabled from './cookies_enabled'

/**
 * The list of entropy sources used to make visitor identifiers.
 *
 * This value isn't restricted by Semantic Versioning, i.e. it may be changed without bumping minor or major version of
 * this package.
 */
export const sources = {
  // Expected errors and default values must be handled inside the functions. Unexpected errors must be thrown.
  osCpu: getOsCpu,
  languages: getLanguages,
  colorDepth: getColorDepth,
  deviceMemory: getDeviceMemory,
  screenResolution: getScreenResolution,
  availableScreenResolution: getAvailableScreenResolution,
  hardwareConcurrency: getHardwareConcurrency,
  timezoneOffset: getTimezoneOffset,
  timezone: getTimezone,
  sessionStorage: getSessionStorage,
  localStorage: getLocalStorage,
  indexedDB: getIndexedDB,
  openDatabase: getOpenDatabase,
  cpuClass: getCpuClass,
  platform: getPlatform,
  plugins: getPlugins,
  canvas: getCanvasFingerprint,
  // adBlock: isAdblockUsed, // https://github.com/fingerprintjs/fingerprintjs/issues/405
  touchSupport: getTouchSupport,
  fonts: getFonts,
  audio: getAudioFingerprint,
  pluginsSupport: getPluginsSupport,
  productSub: getProductSub,
  emptyEvalLength: getEmptyEvalLength,
  errorFF: getErrorFF,
  vendor: getVendor,
  chrome: getChrome,
  cookiesEnabled: areCookiesEnabled,
}

/**
 * A functions that returns data with entropy to identify visitor.
 * Source must handle expected errors by itself and turn them into entropy.
 * The return value must be compatible with `JSON.stringify` or be undefined.
 */
export type Source<TOptions, TValue> = (options: TOptions) => Promise<TValue> | TValue

/**
 * Generic dictionary of unknown sources
 */
export type UnknownSources<TOptions> = Record<string, Source<TOptions, unknown>>

/**
 * Converts an entropy source type to the source return value type
 */
export type SourceValue<TSource extends Source<any, any>> = TSource extends Source<any, infer T> ? T : never

/**
 * Result of getting entropy data from a source
 */
export type Component<T> = (
  | {
      value: T
      error?: undefined
    }
  | {
      value?: undefined
      // The property type must by truthy
      // so that an expression like `if (!component.error)` tells TypeScript that `component.value` is defined
      error: Error | { message: unknown }
    }
) & {
  duration: number
}

/**
 * Generic dictionary of unknown components
 */
export type UnknownComponents = Record<string, Component<unknown>>

/**
 * Converts an entropy source list type to a corresponding component list type.
 *
 * Warning for package users:
 * This type is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export type SourcesToComponents<TSources extends UnknownSources<any>> = {
  [K in keyof TSources]: Component<SourceValue<TSources[K]>>
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

/**
 * Gets a components list from the given list of entropy sources.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export async function getComponents<
  TSourceOptions,
  TSources extends UnknownSources<TSourceOptions>,
  TExclude extends string
>(
  sources: TSources,
  sourceOptions: TSourceOptions,
  excludeSources: readonly TExclude[],
): Promise<Omit<SourcesToComponents<TSources>, TExclude>> {
  let timestamp = Date.now()
  const components = {} as Omit<SourcesToComponents<TSources>, TExclude>

  for (const sourceKey of Object.keys(sources) as Array<keyof TSources>) {
    if (!excludes(excludeSources, sourceKey)) {
      continue
    }

    let result: Pick<Component<unknown>, 'value' | 'error'>

    try {
      result = { value: await sources[sourceKey](sourceOptions) }
    } catch (error) {
      result = error && typeof error === 'object' && 'message' in error ? { error } : { error: { message: error } }
    }

    const nextTimestamp = Date.now()
    components[sourceKey] = { ...result, duration: nextTimestamp - timestamp } as Component<any> // TypeScript has beaten me here
    timestamp = nextTimestamp
  }

  return components
}

/**
 * Collects entropy components from the built-in sources to make the visitor identifier.
 */
export default function getBuiltinComponents(): Promise<BuiltinComponents> {
  return getComponents(sources, undefined, [])
}

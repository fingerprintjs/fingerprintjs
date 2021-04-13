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
import { getRoundedScreenFrame } from './screen_frame'
import getHardwareConcurrency from './hardware_concurrency'
import getTimezone from './timezone'
import getSessionStorage from './session_storage'
import getLocalStorage from './local_storage'
import getIndexedDB from './indexed_db'
import getOpenDatabase from './open_database'
import getCpuClass from './cpu_class'
import getPlatform from './platform'
import getVendor from './vendor'
import getVendorFlavors from './vendor_flavors'
import areCookiesEnabled from './cookies_enabled'
import getDomBlockers from './dom_blockers'
import getColorGamut from './color_gamut'
import areColorsInverted from './inverted_colors'
import areColorsForced from './forced_colors'
import getMonochromeDepth from './monochrome'
import getContrastPreference from './contrast'
import isMotionReduced from './reduced_motion'
import isHDR from './hdr'
import getMathFingerprint from './math'
import getFontPreferences from './font_preferences'

/**
 * The list of entropy sources used to make visitor identifiers.
 *
 * This value isn't restricted by Semantic Versioning, i.e. it may be changed without bumping minor or major version of
 * this package.
 */
export const sources = {
  // Expected errors and default values must be handled inside the functions. Unexpected errors must be thrown.

  // The sources run in this exact order. The asynchronous sources are at the start to run in parallel with other sources.
  fonts: getFonts,
  domBlockers: getDomBlockers,
  fontPreferences: getFontPreferences,
  audio: getAudioFingerprint,
  screenFrame: getRoundedScreenFrame,

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
  canvas: getCanvasFingerprint,
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
  hdr: isHDR,
  math: getMathFingerprint,
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

function ensureErrorWithMessage(error: unknown): { message: unknown } {
  return error && typeof error === 'object' && 'message' in error ? (error as { message: unknown }) : { message: error }
}

/**
 * Gets a component from the given entropy source.
 */
async function getComponent<TOptions, TValue>(
  source: Source<TOptions, TValue>,
  sourceOptions: TOptions,
): Promise<Component<TValue>> {
  let result: Omit<Component<TValue>, 'duration'>
  const startTime = Date.now()

  try {
    result = { value: await source(sourceOptions) }
  } catch (error) {
    result = { error: ensureErrorWithMessage(error) }
  }

  return { ...result, duration: Date.now() - startTime } as Component<TValue>
}

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
  const sourcePromises: Promise<unknown>[] = []
  const components = {} as Omit<SourcesToComponents<TSources>, TExclude>
  const loopReleaseInterval = 16
  let lastLoopReleaseTime = Date.now()

  for (const sourceKey of Object.keys(sources) as Array<keyof TSources>) {
    if (!excludes(excludeSources, sourceKey)) {
      continue
    }

    // Create the keys immediately to keep the component keys order the same as the sources keys order
    components[sourceKey] = undefined as any

    sourcePromises.push(
      getComponent(sources[sourceKey], sourceOptions).then((component: Component<any>) => {
        components[sourceKey] = component
      }),
    )

    // Breaks the synchronous flow.
    // It makes `getComponent` measure duration of the synchronous source without including other source operations.
    const now = Date.now()
    if (now >= lastLoopReleaseTime + loopReleaseInterval) {
      lastLoopReleaseTime = now
      // Allows asynchronous sources to complete and measure the duration correctly before running the next sources
      await new Promise((resolve) => setTimeout(resolve))
    } else {
      await undefined
    }
  }

  await Promise.all(sourcePromises)
  return components
}

export interface BuiltinSourceOptions {
  debug?: boolean
}

/**
 * Collects entropy components from the built-in sources to make the visitor identifier.
 */
export default function getBuiltinComponents(options: BuiltinSourceOptions): Promise<BuiltinComponents> {
  return getComponents(sources, options, [])
}

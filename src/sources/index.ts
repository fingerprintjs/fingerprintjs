/* eslint-disable @typescript-eslint/no-explicit-any */
import { excludes } from '../utils/data'
import { awaitIfAsync, forEachWithBreaks, MaybePromise, wait } from '../utils/async'
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
 *
 * @todo Add a documentation article
 */
export type Source<TOptions, TValue> = (options: TOptions) => MaybePromise<TValue | (() => MaybePromise<TValue>)>

/**
 * Generic dictionary of unknown sources
 */
export type UnknownSources<TOptions> = Record<string, Source<TOptions, unknown>>

/**
 * Converts an entropy source type into the component type
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
 * Loads the given entropy source. Returns a function that gets an entropy component from the source.
 *
 * The result is returned synchronously to prevent `loadSources` from
 * waiting for one source to load before getting the components from the other sources.
 */
export function loadSource<TOptions, TValue>(
  source: Source<TOptions, TValue>,
  sourceOptions: TOptions,
  sourceName?: keyof any, // Temporary for debug. Todo: remove
): () => Promise<Component<TValue>> {
  const isFinalResultLoaded = (loadResult: TValue | (() => MaybePromise<TValue>)): loadResult is TValue => {
    return typeof loadResult !== 'function'
  }

  sourceName

  const sourceLoadPromise = new Promise<() => MaybePromise<Component<TValue>>>((resolveLoad) => {
    const loadStartTime = Date.now()
    // console.log('Load start', sourceName, performance.now())

    // `awaitIfAsync` is used instead of just `await` in order to measure the duration of synchronous sources
    // correctly (other microtasks won't affect the duration).
    awaitIfAsync(
      () => source(sourceOptions),
      (...loadArgs) => {
        const loadDuration = Date.now() - loadStartTime
        // console.log('Load end', sourceName, performance.now())

        // Source loading failed
        if (!loadArgs[0]) {
          return resolveLoad(() => ({ error: ensureErrorWithMessage(loadArgs[1]), duration: loadDuration }))
        }

        const loadResult = loadArgs[1]

        // Source loaded with the final result
        if (isFinalResultLoaded(loadResult)) {
          return resolveLoad(() => ({ value: loadResult, duration: loadDuration }))
        }

        // Source loaded with "get" stage
        resolveLoad(
          () =>
            new Promise((resolveGet) => {
              const getStartTime = Date.now()
              // console.log('Get start', sourceName, performance.now())

              awaitIfAsync(loadResult, (...getArgs) => {
                const duration = loadDuration + Date.now() - getStartTime
                // console.log('Get end', sourceName, performance.now())

                // Source getting failed
                if (!getArgs[0]) {
                  return resolveGet({ error: ensureErrorWithMessage(getArgs[1]), duration })
                }

                // Source getting succeeded
                resolveGet({ value: getArgs[1], duration })
              })
            }),
        )
      },
    )
  })

  return function getComponent() {
    return sourceLoadPromise.then((finalizeSource) => finalizeSource())
  }
}

/**
 * Loads the given entropy sources. Returns a function that collects the entropy components.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function loadSources<TSourceOptions, TSources extends UnknownSources<TSourceOptions>, TExclude extends string>(
  sources: TSources,
  sourceOptions: TSourceOptions,
  excludeSources: readonly TExclude[],
): () => Promise<Omit<SourcesToComponents<TSources>, TExclude>> {
  const includedSources = Object.keys(sources).filter((sourceKey) => excludes(excludeSources, sourceKey)) as Exclude<
    keyof TSources,
    TExclude
  >[]
  const sourceGetters = Array<() => Promise<Component<any>>>(includedSources.length)

  // Using `forEachWithBreaks` allows asynchronous sources to complete between synchronous sources
  // and measure the duration correctly
  forEachWithBreaks(includedSources, (sourceKey, index) => {
    sourceGetters[index] = loadSource(sources[sourceKey], sourceOptions, sourceKey)
  })

  return async function getComponents() {
    // Add the keys immediately to keep the component keys order the same as the source keys order
    const components = {} as Omit<SourcesToComponents<TSources>, TExclude>
    for (const sourceKey of includedSources) {
      components[sourceKey] = undefined as any
    }

    const componentPromises = Array<Promise<unknown>>(includedSources.length)

    for (;;) {
      let hasAllComponentPromises = true
      await forEachWithBreaks(includedSources, (sourceKey, index) => {
        if (!componentPromises[index]) {
          // `sourceGetters` may be incomplete at this point of execution because `forEachWithBreaks` is asynchronous
          if (sourceGetters[index]) {
            componentPromises[index] = sourceGetters[index]().then((component) => (components[sourceKey] = component))
          } else {
            hasAllComponentPromises = false
          }
        }
      })
      if (hasAllComponentPromises) {
        break
      }
      await wait(1) // Lets the source load loop continue
    }

    await Promise.all(componentPromises)
    return components
  }
}

export interface BuiltinSourceOptions {
  debug?: boolean
}

/**
 * Loads the built-in entropy sources.
 * Returns a function that collects the entropy components to make the visitor identifier.
 */
export default function loadBuiltinSources(options: BuiltinSourceOptions): () => Promise<BuiltinComponents> {
  return loadSources(sources, options, [])
}

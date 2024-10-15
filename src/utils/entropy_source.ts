/* eslint-disable @typescript-eslint/no-explicit-any */
import { awaitIfAsync, isPromise, mapWithBreaks, MaybePromise, suppressUnhandledRejectionWarning } from './async'
import { excludes } from './data'

/**
 * A functions that returns data with entropy to identify visitor.
 *
 * See https://github.com/fingerprintjs/fingerprintjs/blob/master/contributing.md#how-to-add-an-entropy-source
 * to learn how entropy source works and how to make your own.
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
    }
  | {
      error: unknown
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

function isFinalResultLoaded<TValue>(loadResult: TValue | (() => MaybePromise<TValue>)): loadResult is TValue {
  return typeof loadResult !== 'function'
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
): () => Promise<Component<TValue>> {
  const sourceLoadPromise = suppressUnhandledRejectionWarning(
    new Promise<() => MaybePromise<Component<TValue>>>((resolveLoad) => {
      const loadStartTime = Date.now()

      // `awaitIfAsync` is used instead of just `await` in order to measure the duration of synchronous sources
      // correctly (other microtasks won't affect the duration).
      awaitIfAsync(source.bind(null, sourceOptions), (...loadArgs) => {
        const loadDuration = Date.now() - loadStartTime

        // Source loading failed
        if (!loadArgs[0]) {
          return resolveLoad(() => ({ error: loadArgs[1], duration: loadDuration }))
        }

        const loadResult = loadArgs[1]

        // Source loaded with the final result
        if (isFinalResultLoaded(loadResult)) {
          return resolveLoad(() => ({ value: loadResult, duration: loadDuration }))
        }

        // Source loaded with "get" stage
        resolveLoad(
          () =>
            new Promise<Component<TValue>>((resolveGet) => {
              const getStartTime = Date.now()

              awaitIfAsync(loadResult, (...getArgs) => {
                const duration = loadDuration + Date.now() - getStartTime

                // Source getting failed
                if (!getArgs[0]) {
                  return resolveGet({ error: getArgs[1], duration })
                }

                // Source getting succeeded
                resolveGet({ value: getArgs[1], duration })
              })
            }),
        )
      })
    }),
  )

  return function getComponent() {
    return sourceLoadPromise.then((finalizeSource) => finalizeSource())
  }
}

/**
 * Loads the given entropy sources. Returns a function that collects the entropy components.
 *
 * The result is returned synchronously in order to allow start getting the components
 * before the sources are loaded completely.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function loadSources<TSourceOptions, TSources extends UnknownSources<TSourceOptions>, TExclude extends string>(
  sources: TSources,
  sourceOptions: TSourceOptions,
  excludeSources: readonly TExclude[],
  loopReleaseInterval?: number,
): () => Promise<Omit<SourcesToComponents<TSources>, TExclude>> {
  const includedSources = Object.keys(sources).filter((sourceKey) => excludes(excludeSources, sourceKey)) as Exclude<
    keyof TSources,
    TExclude
  >[]
  // Using `mapWithBreaks` allows asynchronous sources to complete between synchronous sources
  // and measure the duration correctly
  const sourceGettersPromise = suppressUnhandledRejectionWarning(
    mapWithBreaks(includedSources, (sourceKey) => loadSource(sources[sourceKey], sourceOptions), loopReleaseInterval),
  )

  return async function getComponents() {
    const sourceGetters = await sourceGettersPromise

    const componentPromises = await mapWithBreaks(
      sourceGetters,
      (sourceGetter) => suppressUnhandledRejectionWarning(sourceGetter()),
      loopReleaseInterval,
    )

    const componentArray = await Promise.all(componentPromises)
    // Keeping the component keys order the same as the source keys order
    const components = {} as Omit<SourcesToComponents<TSources>, TExclude>
    for (let index = 0; index < includedSources.length; ++index) {
      components[includedSources[index]] = componentArray[index] as Component<any>
    }

    return components
  }
}

/**
 * Modifies an entropy source by transforming its returned value with the given function.
 * Keeps the source properties: sync/async, 1/2 stages.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function transformSource<TOptions, TValueBefore, TValueAfter>(
  source: Source<TOptions, TValueBefore>,
  transformValue: (value: TValueBefore) => TValueAfter,
): Source<TOptions, TValueAfter> {
  const transformLoadResult = (loadResult: TValueBefore | (() => MaybePromise<TValueBefore>)) => {
    if (isFinalResultLoaded(loadResult)) {
      return transformValue(loadResult)
    }

    return () => {
      const getResult = loadResult()

      if (isPromise(getResult)) {
        return getResult.then(transformValue)
      }

      return transformValue(getResult)
    }
  }

  return (options) => {
    const loadResult = source(options)

    if (isPromise(loadResult)) {
      return loadResult.then(transformLoadResult)
    }

    return transformLoadResult(loadResult)
  }
}

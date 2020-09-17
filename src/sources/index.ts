import { excludes } from '../utils/data'
import audioSource from './audio'
import fontsSource from './fonts'
import pluginsSource from './plugins'

/**
 * The list of entropy sources used to make a fingerprint
 */
export const sources = {
  // Expected errors and default values must be handled inside the functions
  audio: audioSource,
  fonts: fontsSource,
  plugins: pluginsSource,
  // To be continued...
}

/**
 * Options to pass into sources. Empty for now, may be filled or removed in the future.
 */
export interface SourceOptions {}

export type Source<T> = (options: SourceOptions) => Promise<T> | T

export type GenericSourceDict = Record<string, Source<unknown>>

export type Component<T> = ({
  value: T,
  error?: undefined,
} | {
  value?: undefined,

  // The type must by truthy
  // so that an `if (!component.error)` expression tells TypeScript that `component.value` is defined
  error: Error | { message: unknown },
}) & {
  duration: number,
}

export type SourceValue<TSource extends Source<any>> = TSource extends Source<infer T> ? T : never

export type SourcesToComponents<TSources extends GenericSourceDict> = {
  [K in keyof TSources]: Component<SourceValue<TSources[K]>>
}

export type GenericComponentDict = Record<string, Component<unknown>>

export type DefaultComponents = SourcesToComponents<typeof sources>

/**
 * The pro version of `collectComponents`
 */
export async function reduceSources<TSources extends GenericSourceDict, TExcluded extends keyof TSources>(
  sources: TSources,
  sourceOptions: SourceOptions,
  excludeSources: TExcluded[], // There can be low-quality components in the open version and we'll want to exclude them in the pro version to increase speed
): Promise<SourcesToComponents<Omit<TSources, TExcluded>>> {
  let timestamp = Date.now()
  const components = {} as SourcesToComponents<Omit<TSources, TExcluded>>

  for (const sourceKey of Object.keys(sources) as Array<keyof TSources>) {
    if (!excludes(excludeSources, sourceKey)) {
     continue
    }

    let result: Pick<Component<unknown>, 'value' | 'error'>
    let nextTimestamp

    try {
      result = { value: await sources[sourceKey](sourceOptions) }
    } catch (error) {
      result = { error: 'message' in error ? error : { message: error } }
    }

    nextTimestamp = Date.now()
    components[sourceKey] = { ...result, duration: nextTimestamp - timestamp } as Component<any> // TypeScript has beaten me here
    timestamp = nextTimestamp
  }

  return components
}

/**
 * Collects entropy components to make a fingerprint.
 * See the full list of sources and their values in the `sources` definition above.
 *
 * @return A promise with a dictionary like:
 * <pre>
 *  {
 *    audio: {
 *      value: 132,
 *      duration: 2,
 *    },
 *    fonts: {
 *      error: new Error('unexpected error'),
 *      duration: 10,
 *    },
 *  }
 * </pre>
 *
 */
export default function collectComponents(): Promise<DefaultComponents> {
  return reduceSources(sources, {}, [])
}

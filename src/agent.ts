import { version } from '../package.json' // todo: Check that nothing else from package.json gets into the bundles
import { requestIdleCallbackIfAvailable } from './utils/async'
import { x64hash128 } from './utils/hashing'
import getBuiltinComponents, { BuiltinComponents, UnknownComponents } from './sources'

/**
 * Options for Fingerprint class loading
 */
export interface LoadOptions {
  /**
   * When browser doesn't support `requestIdleCallback` a `setTimeout` will be used. This number is only for Safari and
   * old Edge, because Chrome/Blink based browsers support `requestIdleCallback`. The value is in milliseconds.
   * @default 50
   */
  delayFallback?: number
}

/**
 * Options for getting visitor identifier
 */
export interface GetOptions {
  /**
   * Whether to print debug messages to the console.
   * Required to ease investigations of problems.
   */
  debug?: boolean
}

/**
 * Result of getting a visitor identifier
 */
export interface GetResult {
  /**
   * The visitor identifier
   */
  visitorId: string
  /**
   * List of components that has formed the visitor identifier.
   *
   * Warning! The type of this property is specific but out of Semantic Versioning, i.e. may have incompatible changes
   * within a major version. If you want to avoid breaking changes, treat the property as having type
   * `UnknownComponents` that is more generic but guarantees backward compatibility within a major version.
   */
  components: BuiltinComponents
}

/**
 * Agent object that can get visitor identifier
 */
export interface Agent {
  /**
   * Gets the visitor identifier
   */
  get(options?: Readonly<GetOptions>): Promise<GetResult>
}

export function componentsToCanonicalString(components: UnknownComponents) {
  let result = ''
  for (const componentKey of Object.keys(components)) {
    const component = components[componentKey]
    const value = component.error ? 'error' : JSON.stringify(component.value)
    result += `${result ? '|' : ''}${componentKey.replace(/([:|\\])/g, '\\$1')}:${value}`
  }
  return result
}

export function componentsToDebugString(components: UnknownComponents) {
  return JSON.stringify(
    components,
    (_key, value) => {
      if (value instanceof Error) {
        return {
          ...value,
          message: value.message,
          stack: value.stack?.split('\n'),
        }
      }
      return value
    },
    2
  )
}

/**
 * Makes a GetResult implementation that calculates the visitor id hash on demand.
 * Designed for optimisation.
 */
function makeLazyGetResult<T extends UnknownComponents>(components: T) {
  let visitorIdCache: string | undefined

  // A plain class isn't used because its getters and setters aren't enumerable.
  return {
    components,
    get visitorId(): string {
      if (visitorIdCache === undefined) {
        visitorIdCache = x64hash128(componentsToCanonicalString(this.components))
      }
      return visitorIdCache
    },
    set visitorId(visitorId: string) {
      visitorIdCache = visitorId
    },
  }
}

/**
 * The class isn't exported to not expose the constructor.
 * The hiding gives more freedom for future non-breaking updates.
 */
class OpenAgent implements Agent {
  /**
   * @inheritDoc
   */
  public async get(options: Readonly<GetOptions> = {}): Promise<GetResult> {
    const components = await getBuiltinComponents()
    const result = makeLazyGetResult(components)

    if (options.debug) {
      console.log(`Copy the text below to get the debug data:

\`\`\`
version: ${version}
getOptions: ${JSON.stringify(options, undefined, 2)}
visitorId: ${result.visitorId}
components: ${componentsToDebugString(components)}
\`\`\``)
    }

    return result
  }
}

/**
 * Builds an instance of Agent and waits a delay required for a proper operation.
 */
export async function load({ delayFallback = 50 }: Readonly<LoadOptions> = {}): Promise<Agent> {
  await requestIdleCallbackIfAvailable(delayFallback)
  return new OpenAgent()
}

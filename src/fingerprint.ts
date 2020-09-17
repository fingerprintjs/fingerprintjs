import { requestIdleCallbackIfAvailable } from './utils/async'
import { x64hash128 } from './utils/hashing'
import collectComponents, { DefaultComponents, GenericComponentDict } from './sources'

/**
 * Options for getting fingerprint
 */
export interface GetOptions {
  /**
   * Whether to print debug messages to the console.
   * Will be required to ease investigations of problems both in the core and in the pro agent.
   */
  debug?: boolean
}

/**
 * Options for Fingerprint class loading
 */
export interface LoadOptions extends Partial<GetOptions> {
  /**
   * When browser doesn't support `requestIdleCallback` a `setTimeout` will be used. This number is only for Safari and
   * old Edge, because Chrome/Blink based browsers support `requestIdleCallback`. The value is in milliseconds.
   * @default 50
   */
  loadDelay?: number
}

export interface GetResult {
  /**
   * The fingerprint that identifies the browser
   */
  visitorId: string
  /**
   * List of components that form the fingerprint.
   * For debug only.
   *
   * Actually it will be required for the pro agent.
   */
  components: DefaultComponents
}

export function componentsToCanonicalString(components: GenericComponentDict) {
  return Object.keys(components).reduce((result, componentKey) => {
    const component = components[componentKey]
    const value = component.error ? 'error' : JSON.stringify(component.value)
    return `${result.replace(/([:|\\])/g, '\\\\$1')}${componentKey}:${value}|`
  }, '')
}

export function componentsToDebugString(components: GenericComponentDict) {
  return JSON.stringify(
    components,
    (_key, value) => {
      // todo: Check if errors look good in reports
      if (value instanceof Error) {
        return {
          ...value,
          message: value.message,
          stack: value.stack,
        }
      }
      return value
    },
    2
  )
}

export default class Fingerprint {
  #defaultOptions: Readonly<Partial<GetOptions>>

  private constructor(defaultOptions: Readonly<Partial<GetOptions>>) {
    // A config check will be here
    this.#defaultOptions = defaultOptions
  }

  /**
   * Builds an instance of `FP` (client agent) and waits a delay required for a proper operation.
   */
  public static async load({
    loadDelay = 50,
    ...defaultOptions
  }: Readonly<LoadOptions> = {}): Promise<Fingerprint> {
    const fp = new Fingerprint(defaultOptions)
    await requestIdleCallbackIfAvailable(loadDelay)
    return fp
  }

  /**
   * Gets a fingerprint
   */
  public async get(options: Readonly<GetOptions> = {}): Promise<GetResult> {
    const finalOptions = { ...this.#defaultOptions, ...options }
    const components = await collectComponents()
    const fingerprint = x64hash128(componentsToCanonicalString(components))

    if (finalOptions.debug) {
      console.log(`
Copy the text below to get the debug data:

\`\`\`
options: ${JSON.stringify(finalOptions, undefined, 2)}
visitorId: ${fingerprint}
components: ${componentsToDebugString(components)}
\`\`\`
      `)
    }

    return {
      visitorId: fingerprint,
      components,
    }
  }
}

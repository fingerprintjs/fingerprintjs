import { x64hash128 } from './utils/hashing'

export {
  load,
  Agent,
  LoadOptions,
  GetOptions,
  GetResult,
  componentsToCanonicalString,
  componentsToDebugString,
} from './agent'
export { Component, UnknownComponents, BuiltinComponents } from './sources'
export const getHash: (input: string) => string = x64hash128

// The exports below are for private usage. They may change unexpectedly. Usage is at your own risk.

/** Not documented, out of Semantic Versioning, usage is at your own risk */
export const murmurX64Hash128 = x64hash128
export { getComponents, SourcesToComponents } from './sources'
export { isIEOrOldEdge, isChromium, isGecko, isDesktopSafari } from './utils/browser'

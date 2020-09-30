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
export { x64hash128 as getHash } from './utils/hashing'

/*
 * The exports below are out of Semantic Versioning. Their usage is at your own risk.
 */

export { getComponents, SourcesToComponents } from './sources'
export { x64hash128 as murmurX64Hash128 } from './utils/hashing'
export { isIEOrOldEdge, isChromium, isGecko, isDesktopSafari } from './utils/browser'

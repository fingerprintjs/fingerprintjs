import { x64hash128 } from './utils/hashing'
import { load, Agent, LoadOptions, GetOptions, GetResult, hashComponents, componentsToDebugString } from './agent'
import { getComponents, Component, UnknownComponents, BuiltinComponents, SourcesToComponents } from './sources'
import { isTrident, isEdgeHTML, isChromium, isWebKit, isGecko, isDesktopSafari } from './utils/browser'

// Exports that are under Semantic versioning
export {
  load,
  Agent,
  LoadOptions,
  GetOptions,
  GetResult,
  hashComponents,
  componentsToDebugString,
  Component,
  UnknownComponents,
  BuiltinComponents,
}
// The default export is a syntax sugar (`import * as FP from '...' → import FP from '...'`).
// It should contain all the public exported values.
export default { load, hashComponents, componentsToDebugString }

// The exports below are for private usage. They may change unexpectedly. Use them at your own risk.
/** Not documented, out of Semantic Versioning, usage is at your own risk */
export const murmurX64Hash128 = x64hash128
export { getComponents, SourcesToComponents, isTrident, isEdgeHTML, isChromium, isWebKit, isGecko, isDesktopSafari }

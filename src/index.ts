import { load, Agent, LoadOptions, GetOptions, GetResult, hashComponents, componentsToDebugString } from './agent'
import { BuiltinComponents } from './sources'
import { Confidence } from './confidence'
import { Component, UnknownComponents } from './utils/entropy_source'

/*
 * This file exports only values that are under Semantic versioning
 */

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
  Confidence,
}

// The default export is a syntax sugar (`import * as FP from '...' → import FP from '...'`).
// It should contain all the public exported values.
export default { load, hashComponents, componentsToDebugString }

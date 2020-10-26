import { isEdgeHTML, isTrident } from '../utils/browser'

export default function getIndexedDB(): boolean | undefined {
  // IE and Edge don't allow accessing indexedDB in private mode, therefore IE and Edge will have different
  // visitor identifier in normal and private modes.
  if (isTrident() || isEdgeHTML()) {
    return undefined
  }
  try {
    return !!window.indexedDB
  } catch (e) {
    /* SecurityError when referencing it means it exists */
    return true
  }
}

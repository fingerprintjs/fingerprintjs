import { toInt } from '../utils/data'

export type TouchSupport = {
  maxTouchPoints: number
  /** The success or failure of creating a TouchEvent */
  touchEvent: boolean
  /** The availability of the "ontouchstart" property */
  touchStart: boolean
}

/**
 * This is a crude and primitive touch screen detection. It's not possible to currently reliably detect the availability
 * of a touch screen with a JS, without actually subscribing to a touch event.
 *
 * @see http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
 * @see https://github.com/Modernizr/Modernizr/issues/548
 */
export default function getTouchSupport(): TouchSupport {
  const n = navigator

  let maxTouchPoints = 0
  let touchEvent: boolean
  if (n.maxTouchPoints !== undefined) {
    maxTouchPoints = toInt(n.maxTouchPoints)
  } else if (n.msMaxTouchPoints !== undefined) {
    maxTouchPoints = n.msMaxTouchPoints
  }
  try {
    document.createEvent('TouchEvent')
    touchEvent = true
  } catch {
    touchEvent = false
  }
  const touchStart = 'ontouchstart' in window
  return {
    maxTouchPoints,
    touchEvent,
    touchStart,
  }
}

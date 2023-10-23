import { replaceNaN, round, toFloat } from '../utils/data'
import { exitFullscreen, getFullscreenElement, isSafariWebKit, isWebKit, isWebKit616OrNewer } from '../utils/browser'

/**
 * The order matches the CSS side order: top, right, bottom, left.
 *
 * @ignore Named array elements aren't used because of multiple TypeScript compatibility complaints from users
 */
export type FrameSize = [number | null, number | null, number | null, number | null]

export const screenFrameCheckInterval = 2500
const roundingPrecision = 10

// The type is readonly to protect from unwanted mutations
let screenFrameBackup: Readonly<FrameSize> | undefined
let screenFrameSizeTimeoutId: number | undefined

/**
 * Starts watching the screen frame size. When a non-zero size appears, the size is saved and the watch is stopped.
 * Later, when `getScreenFrame` runs, it will return the saved non-zero size if the current size is null.
 *
 * This trick is required to mitigate the fact that the screen frame turns null in some cases.
 * See more on this at https://github.com/fingerprintjs/fingerprintjs/issues/568
 */
function watchScreenFrame() {
  if (screenFrameSizeTimeoutId !== undefined) {
    return
  }
  const checkScreenFrame = () => {
    const frameSize = getCurrentScreenFrame()
    if (isFrameSizeNull(frameSize)) {
      screenFrameSizeTimeoutId = (setTimeout as typeof window.setTimeout)(checkScreenFrame, screenFrameCheckInterval)
    } else {
      screenFrameBackup = frameSize
      screenFrameSizeTimeoutId = undefined
    }
  }
  checkScreenFrame()
}

/**
 * For tests only
 */
export function resetScreenFrameWatch(): void {
  if (screenFrameSizeTimeoutId !== undefined) {
    clearTimeout(screenFrameSizeTimeoutId)
    screenFrameSizeTimeoutId = undefined
  }
  screenFrameBackup = undefined
}

/**
 * A version of the entropy source without stabilization.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
export function getUnstableScreenFrame(): () => Promise<FrameSize> {
  watchScreenFrame()

  return async () => {
    let frameSize = getCurrentScreenFrame()

    if (isFrameSizeNull(frameSize)) {
      if (screenFrameBackup) {
        return [...screenFrameBackup]
      }

      if (getFullscreenElement()) {
        // Some browsers set the screen frame to zero when programmatic fullscreen is on.
        // There is a chance of getting a non-zero frame after exiting the fullscreen.
        // See more on this at https://github.com/fingerprintjs/fingerprintjs/issues/568
        await exitFullscreen()
        frameSize = getCurrentScreenFrame()
      }
    }

    if (!isFrameSizeNull(frameSize)) {
      screenFrameBackup = frameSize
    }

    return frameSize
  }
}

/**
 * A version of the entropy source with stabilization to make it suitable for static fingerprinting.
 *
 * Sometimes the available screen resolution changes a bit, e.g. 1900x1440 → 1900x1439. A possible reason: macOS Dock
 * shrinks to fit more icons when there is too little space. The rounding is used to mitigate the difference.
 *
 * The frame width is always 0 in private mode of Safari 17, so the frame is not used in Safari 17.
 */
export default function getScreenFrame(): () => Promise<FrameSize | undefined> {
  if (isWebKit() && isWebKit616OrNewer() && isSafariWebKit()) {
    return () => Promise.resolve(undefined)
  }

  const screenFrameGetter = getUnstableScreenFrame()

  return async () => {
    const frameSize = await screenFrameGetter()
    const processSize = (sideSize: FrameSize[number]) => (sideSize === null ? null : round(sideSize, roundingPrecision))

    // It might look like I don't know about `for` and `map`.
    // In fact, such code is used to avoid TypeScript issues without using `as`.
    return [processSize(frameSize[0]), processSize(frameSize[1]), processSize(frameSize[2]), processSize(frameSize[3])]
  }
}

function getCurrentScreenFrame(): FrameSize {
  const s = screen

  // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
  // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
  //
  // Some browsers (IE, Edge ≤18) don't provide `screen.availLeft` and `screen.availTop`. The property values are
  // replaced with 0 in such cases to not lose the entropy from `screen.availWidth` and `screen.availHeight`.
  return [
    replaceNaN(toFloat(s.availTop), null),
    replaceNaN(toFloat(s.width) - toFloat(s.availWidth) - replaceNaN(toFloat(s.availLeft), 0), null),
    replaceNaN(toFloat(s.height) - toFloat(s.availHeight) - replaceNaN(toFloat(s.availTop), 0), null),
    replaceNaN(toFloat(s.availLeft), null),
  ]
}

function isFrameSizeNull(frameSize: FrameSize) {
  for (let i = 0; i < 4; ++i) {
    if (frameSize[i]) {
      return false
    }
  }
  return true
}

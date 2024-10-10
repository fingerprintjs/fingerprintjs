import { UAParser } from 'ua-parser-js'

export { default as withMockProperties } from './mock_properties'
export { default as withMockMatchMedia } from './mock_match_media'

/*
 * Sometimes tests need to know what browser they run in to make proper assertions.
 * Karma doesn't provide this information.
 * The browser detect functions in the `src` directory can't be used because they are objects of testing.
 * Therefore a popular third party library is used to detect browser.
 * The library isn't used in the main code because some visitors tamper user agent while the test environments don't.
 *
 * We should find a way to pass browser settings from the Karma configuration to the tests,
 * otherwise we can't distinguish incognito browsers from regular browsers, Brave from Chrome, etc.
 */

export function isTrident(): boolean {
  return new UAParser().getEngine().name === 'Trident'
}

export function isEdgeHTML(): boolean {
  return new UAParser().getEngine().name === 'EdgeHTML'
}

export function isChromium(): boolean {
  return new UAParser().getEngine().name === 'Blink'
}

export function isGecko(): boolean {
  return new UAParser().getEngine().name === 'Gecko'
}

export function isWebKit(): boolean {
  return new UAParser().getEngine().name === 'WebKit'
}

export function isMobile(): boolean {
  return new UAParser().getDevice().type === 'mobile'
}

export function isTablet(): boolean {
  return new UAParser().getDevice().type === 'tablet'
}

export function isAndroid(): boolean {
  return new UAParser().getOS().name === 'Android'
}

export function isWindows(): boolean {
  return new UAParser().getOS().name === 'Windows'
}

export function isMacOS(): boolean {
  return new UAParser().getOS().name === 'Mac OS'
}

/**
 * Probably you should use `isWebKit` instead
 */
export function isSafari(): boolean {
  const browserName = new UAParser().getBrowser().name
  return browserName === 'Safari' || browserName === 'Mobile Safari'
}

export function isSamsungInternet(): boolean {
  const browserName = new UAParser().getBrowser().name
  return browserName === 'Samsung Internet'
}

/**
 * Probably you should use `getBrowserEngineMajorVersion` instead
 */
export function getBrowserMajorVersion(): number | undefined {
  const version = new UAParser().getBrowser().version
  if (version === undefined) {
    return undefined
  }
  return parseInt(version.split('.')[0])
}

export function getBrowserVersion(): { major: number; minor: number } | undefined {
  const version = new UAParser().getBrowser().version
  if (version === undefined) {
    return undefined
  }

  return {
    major: parseInt(version.split('.')[0]),
    minor: parseInt(version.split('.')[1]),
  }
}

export function getBrowserEngineMajorVersion(): number | undefined {
  const version = new UAParser().getEngine().version
  if (version === undefined) {
    return undefined
  }
  return parseInt(version.split('.')[0])
}

export async function withCSS<T>(css: string, action: () => Promise<T> | T): Promise<T> {
  const styleElement = document.createElement('style')

  try {
    styleElement.textContent = css
    document.head.appendChild(styleElement)

    return await action()
  } finally {
    styleElement.parentNode?.removeChild(styleElement)
  }
}

export function holdLoop(timeMs: number): void {
  const startTime = Date.now()
  while (Date.now() < startTime + timeMs) {
    // Do nothing
  }
}

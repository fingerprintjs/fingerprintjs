import { UAParser } from 'ua-parser-js'

/*
 * Sometimes tests need to know what browser they run in to make proper assertions.
 * Karma doesn't provide this information.
 * The browser detect functions in the `src` directory can't be used because they are objects of testing.
 * Therefore a popular third party library is used to detect browser.
 * The library isn't used in the main code because some visitors tamper user agent while test the environments don't.
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

/**
 * Probably you should use `isWebKit` instead
 */
export function isSafari(): boolean {
  const browserName = new UAParser().getBrowser().name
  return browserName === 'Safari' || browserName === 'Mobile Safari'
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

export function getBrowserEngineMajorVersion(): number | undefined {
  const version = new UAParser().getEngine().version
  if (version === undefined) {
    return undefined
  }
  return parseInt(version.split('.')[0])
}

/**
 * Sets new property values to the object and reverts the properties when the action is complete
 */
export async function withMockProperties<T>(
  object: Record<never, unknown>,
  mockProperties: Record<string, PropertyDescriptor | undefined>,
  action: () => Promise<T> | T,
): Promise<T> {
  const originalProperties: Record<string, PropertyDescriptor | undefined> = {}

  for (const property of Object.keys(mockProperties)) {
    originalProperties[property] = Object.getOwnPropertyDescriptor(object, property)
    const mockProperty = mockProperties[property]
    if (mockProperty) {
      Object.defineProperty(object, property, {
        ...mockProperty,
        configurable: true, // Must be configurable, otherwise won't be able to revert
      })
    } else {
      delete (object as Record<keyof never, unknown>)[property]
    }
  }

  try {
    return await action()
  } finally {
    for (const property of Object.keys(originalProperties)) {
      const propertyDescriptor = originalProperties[property]
      if (propertyDescriptor === undefined) {
        delete (object as Record<keyof never, unknown>)[property]
      } else {
        Object.defineProperty(object, property, propertyDescriptor)
      }
    }
  }
}

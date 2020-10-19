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

export function isEdgeHTML() {
  return new UAParser().getEngine().name === 'EdgeHTML'
}

/**
 * Sets new property values to the object and reverts the properties when the action is complete
 */
export async function withMockProperties<T>(
  object: object,
  mockProperties: Record<string, PropertyDescriptor>,
  action: () => Promise<T> | T
): Promise<T> {
  const originalProperties: Record<string, PropertyDescriptor | undefined> = {}

  for (const property of Object.keys(mockProperties)) {
    originalProperties[property] = Object.getOwnPropertyDescriptor(object, property)
    Object.defineProperty(object, property, {
      ...mockProperties[property],
      configurable: true, // Must be configurable, otherwise won't be able to revert
    })
  }

  try {
    return await action()
  } finally {
    for (const property of Object.keys(originalProperties)) {
      const propertyDescriptor = originalProperties[property]
      if (propertyDescriptor === undefined) {
        delete (object as Record<string, any>)[property]
      } else {
        Object.defineProperty(object, property, propertyDescriptor)
      }
    }
  }
}

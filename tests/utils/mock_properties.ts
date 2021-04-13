/**
 * Sets new property values to the object and reverts the properties when the action is complete
 */
export default async function withMockProperties<T>(
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

import withMockProperties from './mock_properties'

/**
 * Mocks `matchMedia` function.
 * `mockFeatures` is a list of CSS media features to mock. The values are lists of feature values that shall match.
 * `undefined` means that the browser "doesn't know" this media feature.
 * Queries with `min-...` and `max-...` are handled automatically so you shouldn't mock them separately.
 *
 * @todo Consider using https://www.npmjs.com/package/mock-match-media when https://github.com/ericf/css-mediaquery/issues/21 is resolved
 */
export default async function withMockMatchMedia<T>(
  mockFeatures: Record<string, ReadonlyArray<string | number | undefined>>,
  failWhenOther: boolean,
  action: () => Promise<T> | T,
): Promise<T> {
  const originalMatchMedia = window.matchMedia

  return withMockProperties(
    window,
    {
      matchMedia: {
        value: (query: string) => {
          // Parses queries like `(property-name: value)` and `(property-name)`
          const match = /^\s*\(\s*(min-|max-)?([\w-]+)\s*(:\s*([\w-]+))?\s*\)\s*$/.exec(query)
          if (!match) {
            throw new Error(`Unexpected query syntax`)
          }
          const [, range, name, , queryFullValue] = match

          if (!mockFeatures[name]) {
            if (failWhenOther) {
              throw new Error(`The ${name} media feature isn't mocked`)
            } else {
              return originalMatchMedia.call(window, query)
            }
          }

          return {
            get matches() {
              return doesQueryMatchMock(range as 'min-' | 'max-' | undefined, queryFullValue, mockFeatures[name])
            },
          }
        },
      },
    },
    action,
  )
}

function parseValue(value: string | number | undefined): [value: number | undefined, unit: string | undefined] {
  if (value === undefined) {
    return [undefined, undefined]
  }
  if (typeof value === 'number') {
    return [value, undefined]
  }
  const match = /^\s*(\d+|\d*\.\d+)?\s*(.+?)?\s*$/.exec(value)
  if (!match) {
    throw new Error('No way this can happen')
  }
  return [match[1] ? Number(match[1]) : undefined, match[2]]
}

function doesQueryMatchMock(
  queryRange: 'min-' | 'max-' | undefined,
  queryFullValue: string | undefined,
  mockValues: ReadonlyArray<string | number | undefined>,
) {
  const [queryValue, queryUnit] = parseValue(queryFullValue)

  return mockValues.some((mock) => {
    const [mockValue, mockUnit] = parseValue(mock)

    // Means that the browser doesn't know this media feature
    if (mockValue === undefined && !mockUnit) {
      return false
    }

    // E.g. (monochrome)
    if (queryValue === undefined && !queryUnit) {
      return mockValue !== 0
    }

    // Compare numeric feature values
    if (mockValue !== undefined && queryValue !== undefined) {
      if (mockUnit !== queryUnit && !(mockValue === 0 && queryValue === 0)) {
        throw new Error("The mock can't juxtapose different units")
      }
      switch (queryRange) {
        case 'min-':
          return mockValue >= queryValue
        case 'max-':
          return mockValue <= queryValue
        default:
          return mockValue === queryValue
      }
    }

    // Compare discrete feature values
    if (mockValue === undefined && queryValue === undefined) {
      return mockUnit === queryUnit
    }

    // Non-sense
    return false
  })
}

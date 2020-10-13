import { OpenAgent } from './agent'
import { sources } from './sources'

describe('Agent', () => {
  it('collects all components without unexpected errors and makes visitorId', async () => {
    const agent = new OpenAgent()
    const result = await agent.get()
    expect(typeof result.visitorId).toBe('string')
    expect(result.visitorId).not.toEqual('')

    const expectedComponents = Object.keys(sources).sort() as Array<keyof typeof sources>
    expect(expectedComponents.length).toBeGreaterThan(10) // To check the test itself
    expect(Object.keys(result.components).sort()).toEqual(expectedComponents)
    for (const componentName of expectedComponents) {
      expect(result.components[componentName].error)
        .withContext(`Unexpected error in the "${componentName}" component`)
        .toBeUndefined()
    }
  })
})

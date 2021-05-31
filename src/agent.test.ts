import { version } from '../package.json'
import { withMockProperties } from '../tests/utils'
import { Agent, makeAgent } from './agent'
import { sources } from './sources'
import { resetScreenFrameWatch } from './sources/screen_frame'
import { wait } from './utils/async'

describe('Agent', () => {
  it('collects all components without unexpected errors and makes visitorId', async () => {
    const agent = makeAgent()
    const result = await agent.get()
    expect(typeof result.visitorId).toBe('string')
    expect(result.visitorId).not.toEqual('')
    expect(result.version).toBe(version)

    const expectedComponents = Object.keys(sources).sort() as Array<keyof typeof sources>
    expect(expectedComponents.length).toBeGreaterThan(10) // To check the test itself
    expect(Object.keys(result.components).sort()).toEqual(expectedComponents)
    for (const componentName of expectedComponents) {
      expect(result.components[componentName].error)
        .withContext(`Unexpected error in the "${componentName}" component`)
        .toBeUndefined()
    }
  })

  it('loads sources when created', async () => {
    // Checking by checking whether the screen frame is watched
    resetScreenFrameWatch()
    let agent: Agent

    await withMockProperties(
      screen,
      {
        width: { get: () => 1200 },
        height: { get: () => 800 },
        availWidth: { get: () => 1100 },
        availHeight: { get: () => 760 },
        availLeft: { get: () => 100 },
        availTop: { get: () => 0 },
      },
      async () => {
        agent = makeAgent()
        await wait(10) // Wait for the sources to complete loading
      },
    )

    // Emulates turning on UI fullscreen in Chrome on macOS
    await withMockProperties(
      screen,
      {
        width: { get: () => 1200 },
        height: { get: () => 800 },
        availWidth: { get: () => 1200 },
        availHeight: { get: () => 800 },
        availLeft: { get: () => 0 },
        availTop: { get: () => 0 },
      },
      async () => {
        const result = await agent.get()
        expect(result.components.screenFrame.value).toEqual([0, 0, 40, 100])
      },
    )
  })
})

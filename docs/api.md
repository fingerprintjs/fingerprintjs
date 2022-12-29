# API reference

## Installation

The library supports all the popular installation methods:

### Browser ECMAScript module

```html
<script>
  // Initialize the agent at application startup.
  // You can also use https://openfpcdn.io/fingerprintjs/v3/esm.min.js
  const fpPromise = import('https://openfpcdn.io/fingerprintjs/v3')
    .then(FingerprintJS => FingerprintJS.load())

  // Get the visitor identifier when you need it.
  fpPromise
    .then(fp => fp.get())
    .then(result => console.log(result.visitorId))
</script>
```

[Run this code](https://stackblitz.com/edit/fpjs-3-cdn?file=index.html&devtoolsheight=100)

### Browser `<script>` tag

A synchronous code that pauses the other scripts during loading and therefore not recommended:

```html
<!-- Note that we use iife.min.js -->
<script src="https://openfpcdn.io/fingerprintjs/v3/iife.min.js"></script>
<script>
  // Initialize the agent at application startup.
  var fpPromise = FingerprintJS.load()

  // Analyze the visitor when necessary.
  fpPromise
    .then(fp => fp.get())
    .then(result => console.log(result.visitorId))
</script>
```

### UMD

```js
require(
  ['https://openfpcdn.io/fingerprintjs/v3/umd.min.js'],
  FingerprintJS => {
    // Initialize the agent at application startup.
    const fpPromise = FingerprintJS.load()

    // Get the visitor identifier when you need it.
    fpPromise
      .then(fp => fp.get())
      .then(result => console.log(result.visitorId))
  }
)
```

### Webpack/Rollup/NPM/Yarn

```bash
# Install the package first:
npm i @fingerprintjs/fingerprintjs
# or
yarn add @fingerprintjs/fingerprintjs
```

```js
import FingerprintJS from '@fingerprintjs/fingerprintjs'

// Initialize an agent at application startup.
const fpPromise = FingerprintJS.load()

;(async () => {
  // Get the visitor identifier when you need it.
  const fp = await fpPromise
  const result = await fp.get()
  console.log(result.visitorId)
})()
```

[Run this code](https://stackblitz.com/edit/fpjs-3-npm?file=index.js&devtoolsheight=100)

**When you run FingerprintJS installed with NPM or Yarn, the library will send AJAX requests to FingerprintJS servers to collect usage statistics.**
When the `load` function runs, there is a 0.1% chance of sending a request.
The requests are sent at most once a week from one browser instance (unless the browser cache was cleared).
A request includes the following information:

- The library version
- The HTTP headers that the client sends, including the origin and the referrer of the page where the library runs
- The IP of the client

You can turn off these requests by using the `monitoring` option:

```diff
const fpPromise = FingerprintJS.load({
+ monitoring: false
})
```

💡 Scripts downloaded from our CDN (https://openfpcdn.io) have monitoring disabled by default.

If you have a TypeScript error that occurs in a FingerprintJS file,
see the [TypeScript support guide](typescript_support.md).

CommonJS syntax (outdated):

```js
const FingerprintJS = require('@fingerprintjs/fingerprintjs')

// Initialize the agent at application startup.
const fpPromise = FingerprintJS.load()

// Get the visitor identifier when you need it.
fpPromise
  .then(fp => fp.get())
  .then(result => console.log(result.visitorId))
```

## API

#### `FingerprintJS.load({ delayFallback?: number, debug?: boolean, monitoring?: boolean }): Promise<Agent>`

Builds an instance of Agent and waits a delay required for a proper operation.
We recommend calling it as soon as possible.
`delayFallback` is an optional parameter that sets duration (milliseconds) of the fallback for browsers that don't support [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback);
it has a good default value which we don't recommend to change.
`debug: true` prints debug messages to the console.
`monitoring: false` disables the AJAX request that the library sends to a FingerprintJS server to collect usage statistics
(it's always disabled in the CDN version).

#### `agent.get(): Promise<GetResult>`

A method of an Agent instance that gets the visitor identifier.
We recommend calling it later, when you really need the identifier, to increase the chance of getting an accurate identifier.
The returned object format:

```ts
interface GetResult {
  visitorId: string
  confidence: {
    score: number
    comment?: string
  }
  components: {
    [key: string]:
      { value: any, duration: number } |
      { error: object, duration: number }
  }
  version: string
}
```

The returned object fields:

- `visitorId` The visitor identifier
- `confidence`.`score` The confidence score.
    This is a number between 0 and 1 that tells how much the agent is sure about the visitor identifier.
    The higher the number, the higher the chance of the visitor identifier to be true.
- `confidence`.`comment` Additional information for the confidence score. A human-readable text.
- `components` A dictionary of components that have formed the identifier.
    The keys are the component names.
    `value` is a component value (in case of success).
    `error` is an error object (in case of an unexpected error during getting the component).
- `version` The fingerprinting algorithm version which is equal to the library version.
    See [the version policy guide](version_policy.md) for more details.

See the [extending guide](extending.md) to learn how to remove and add entropy components.

#### `FingerprintJS.hashComponents(components: object): string`

Converts a dictionary of components (described above) into a short hash string a.k.a. a visitor identifier.
Designed for [extending the library](extending.md) with your own components.

#### `FingerprintJS.componentsToDebugString(components: object): string`

Converts a dictionary of components (described above) into human-friendly format.

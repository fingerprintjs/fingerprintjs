# API reference

## Installation

The library is shipped in various formats:

### Global variable

```html
<script>
  function initFingerprintJS() {
    // Start loading FingerprintJS here
  }
</script>
<script
  async
  src="//cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js"
  onload="initFingerprintJS()"
></script>
```

### UMD

```js
require(
  ['//cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.umd.min.js'],
  (FingerprintJS) => {
    // Start loading FingerprintJS here
  }
)
```

### ECMAScript module

```bash
# Install the package first:
npm i @fingerprintjs/fingerprintjs
# or
yarn add @fingerprintjs/fingerprintjs
```

```js
import FingerprintJS from '@fingerprintjs/fingerprintjs'

// Start loading FingerprintJS here
```

If you face a TypeScript error that occurs in a FingerprintJS file,
see the [TypeScript support guide](typescript_support.md).

### CommonJS

```bash
# Install the package first:
npm i @fingerprintjs/fingerprintjs
# or
yarn add @fingerprintjs/fingerprintjs
```

```js
const FingerprintJS = require('@fingerprintjs/fingerprintjs')

// Start loading FingerprintJS here
```

## API

#### `FingerprintJS.load({ delayFallback?: number }): Promise<Agent>`

Builds an instance of Agent and waits a delay required for a proper operation.
We recommend calling it as soon as possible.
`delayFallback` is an optional parameter that sets duration (milliseconds) of the fallback for browsers that don't support [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback);
it has a good default value which we don't recommend to change.

#### `agent.get({ debug?: boolean }): Promise<object>`

A method of an Agent instance that gets the visitor identifier.
We recommend calling it later, when you really need the identifier, to increase the chance of getting an accurate identifier.
`debug: true` prints debug messages to the console.
Result object fields:

- `visitorId` The visitor identifier
- `components` A dictionary of components that have formed the identifier.
    Each value is an object like `{ value: any, duration: number }` in case of success
    and `{ error: object, duration: number }` in case of an unexpected error during getting the component.
- `version` The fingerprinting algorithm version which is equal to the library version.
    See [the version policy guide](version_policy.md) for more details.

See the [extending guide](extending.md) to learn how to remove and add entropy components.

#### `FingerprintJS.hashComponents(components: object): string`

Converts a dictionary of components (described above) into a short hash string a.k.a. a visitor identifier.
Designed for [extending the library](extending.md) with your own components.

#### `FingerprintJS.componentsToDebugString(components: object): string`

Converts a dictionary of components (described above) into human-friendly format.

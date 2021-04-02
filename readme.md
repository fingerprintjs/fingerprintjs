<p align="center">
  <a href="https://fingerprintjs.com">
    <img src="resources/logo.svg" alt="FingerprintJS" width="312px" />
  </a>
</p>
<p align="center">
  <a href="https://github.com/fingerprintjs/fingerprintjs/actions/workflows/test.yml">
    <img src="https://github.com/fingerprintjs/fingerprintjs/actions/workflows/test.yml/badge.svg?branch=v2" alt="Build status">
  </a>
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs">
    <img src="https://img.shields.io/npm/v/@fingerprintjs/fingerprintjs.svg" alt="Current NPM version">
  </a>
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs">
    <img src="https://img.shields.io/npm/dm/@fingerprintjs/fingerprintjs.svg" alt="Monthly downloads from NPM">
  </a>
  <a href="https://www.jsdelivr.com/package/npm/@fingerprintjs/fingerprintjs">
    <img src="https://img.shields.io/jsdelivr/npm/hm/@fingerprintjs/fingerprintjs.svg" alt="Monthly downloads from jsDelivr">
  </a>
</p>

FingerprintJS is a browser fingerprinting library that queries browser attributes and computes a hashed visitor identifier from them. Unlike cookies and local storage, a fingerprint stays the same in incognito/private mode and even when browser data is purged.

[View Our Demo](https://fingerprintjs.github.io/fingerprintjs/).

## Quick start

### Install from CDN

```html
<script>
  function initFingerprintJS() {
    FingerprintJS.load().then(fp => {
      // The FingerprintJS agent is ready.
      // Get a visitor identifier when you'd like to.
      fp.get().then(result => {
        // This is the visitor identifier:
        const visitorId = result.visitorId;
        console.log(visitorId);
      });
    });
  }
</script>
<script
  async
  src="//cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js"
  onload="initFingerprintJS()"
></script>
```

### Alternatively you can install from NPM to use with Webpack/Rollup/Browserify

```bash
npm i @fingerprintjs/fingerprintjs
# or
yarn add @fingerprintjs/fingerprintjs
```

```js
import FingerprintJS from '@fingerprintjs/fingerprintjs';

(async () => {
  // We recommend to call `load` at application startup.
  const fp = await FingerprintJS.load();

  // The FingerprintJS agent is ready.
  // Get a visitor identifier when you'd like to.
  const result = await fp.get();

  // This is the visitor identifier:
  const visitorId = result.visitorId;
  console.log(visitorId);
})();
```

📕 [Full documentation](#open-source-version-reference)

## Upgrade to [Pro version](https://pro.fingerprintjs.com/github/) to get 99.5% identification accuracy

FingerprintJS Pro is a professional visitor identification service that processes all information server-side and transmits it securely to your servers using server-to-server APIs.
Pro combines browser fingerprinting with vast amounts of auxiliary data (IP addresses, time of visit patterns, URL changes and more) to be able to reliably deduplicate different users that have identical devices, resulting in 99.5% identification accuracy.

See our [full product comparison](https://pro.fingerprintjs.com/github/) for more information on the differences between open source and Pro.


<p align="center">
  <a href="https://fingerprintjs.com">
    <img src="resources/pro_screenshot.png" alt="Pro screenshot" width="697px" />
  </a>
</p>

<table>
  <thead>
    <tr>
      <th></th>
      <!-- The <img>s are to make the table take the full width -->
      <th align="center"><img width="350" height="0"> <p>Open Source version</p></th>
      <th align="center"><img width="350" height="0"> <p>Pro version</p></th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Identification accuracy</td><td align="center">60%</td><td align="center">99.5%</td></tr>
    <tr><td>Incognito / Private mode detection</td><td align="center">❌</td><td align="center">✅</td></tr>
    <tr><td>Geolocation</td><td align="center">❌</td><td align="center">✅</td></tr>
    <tr><td>Security</td><td align="center">❌</td><td align="center">✅</td></tr>
    <tr><td>Server API</td><td align="center">❌</td><td align="center">✅</td></tr>
    <tr><td>Webhooks</td><td align="center">❌</td><td align="center">✅</td></tr>
    <tr><td>Stable identifier between versions</td><td align="center">❌</td><td align="center">✅</td></tr>
  </tbody>
</table>

Pro result example:

```js
{
  "requestId": "HFMlljrzKEiZmhUNDx7Z",
  "visitorId": "kHqPGWS1Mj18sZFsP8Wl",
  "visitorFound": true,
  "incognito": false,
  "browserName": "Chrome",
  "browserVersion": "85.0.4183",
  "os": "Mac OS X",
  "osVersion": "10.15.6",
  "device": "Other",
  "ip": "192.65.67.131",
  "ipLocation": {
    "accuracyRadius": 100,
    "latitude": 37.409657,
    "longitude": -121.965467
    // ...
  }
}
```

🍿 [Live demo](https://fingerprintjs.com/demo)

⏱ [How to upgrade from Open Source to Pro in 30 seconds](https://dev.fingerprintjs.com/v3/docs/migrating-from-previous-versions#from-fingerprintjs-open-source-version-3)

📕 [FingerprintJS Pro documentation](https://dev.fingerprintjs.com)

▶️ [Video: use FingerprintJS Pro to prevent multiple signups](https://www.youtube.com/watch?v=jWX9P5_jZn8)

## Open-source version reference

### Installation

The library is shipped in various formats:

#### Global variable

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

#### UMD

```js
require(
  ['//cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.umd.min.js'],
  (FingerprintJS) => {
    // Start loading FingerprintJS here
  }
);
```

#### ECMAScript module

```bash
# Install the package first:
npm i @fingerprintjs/fingerprintjs
# or
yarn add @fingerprintjs/fingerprintjs
```

```js
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Start loading FingerprintJS here
```

#### CommonJS

```bash
# Install the package first:
npm i @fingerprintjs/fingerprintjs
# or
yarn add @fingerprintjs/fingerprintjs
```

```js
const FingerprintJS = require('@fingerprintjs/fingerprintjs');

// Start loading FingerprintJS here
```

### API

#### `FingerprintJS.load({ delayFallback?: number }): Promise<Agent>`

Builds an instance of Agent and waits a delay required for a proper operation.
`delayFallback` is an optional parameter that sets duration (milliseconds) of the fallback for browsers that don't support [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback);
it has a good default value which we don't recommend to change.

#### `agent.get({ debug?: boolean }): Promise<object>`

Gets the visitor identifier.
`debug: true` prints debug messages to the console.
Result object fields:

- `visitorId` The visitor identifier
- `components` A dictionary of components that have formed the identifier.
    Each value is an object like `{ value: any, duration: number }` in case of success
    and `{ error: object, duration: number }` in case of an unexpected error during getting the component.
- `version` The fingerprinting algorithm version which is equal to the library version.
    See [the version policy section](#version-policy) for more details.

See the [extending guide](docs/extending.md) to learn how to remove and add entropy components.

#### `FingerprintJS.hashComponents(components: object): string`

Converts a dictionary of components (described above) into a short hash string a.k.a. a visitor identifier.
Designed for [extending the library](docs/extending.md) with your own components.

#### `FingerprintJS.componentsToDebugString(components: object): string`

Converts a dictionary of components (described above) into human-friendly format.

## Migrating from v2

- [Migration guide](docs/migrating_v2_v3.md)
- [V2 documentation](https://github.com/fingerprintjs/fingerprintjs/tree/v2)

## Version policy

The library tries to keep visitor identifiers the same within a minor version (i.e. when the first 2 numbers of the version don't change).
Some visitor identifiers may change within a minor version due to stability fixes.
To get identifiers that remain stable up to 1 year, please consider [upgrading to pro](https://dashboard.fingerprintjs.com).

Agent `get()` function returns the version together with the visitor identifier.
You can use it to decide whether a couple of identifiers can be matched together.
Example:

```js
if (
  result1.version.split('.').slice(0, 2).join('.') ===
  result2.version.split('.').slice(0, 2).join('.')
) {
  return result1.visitorId === result2.visitorId ? 'same' : 'different';
} else {
  return 'unknown';
}
```

The documented JS API follows [Semantic Versioning](https://semver.org).
Use undocumented features at your own risk.

## Browser support

```bash
npx browserslist "cover 95% in us, not IE < 10"
```

See more details and learn how to run the library in old browsers in the [documentation article](docs/browser_support.md).

## Contributing

See the [contributing guidelines](contributing.md) to learn how to start a playground, test and build.

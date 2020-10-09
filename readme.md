<p align="center">
  <a href="https://fingerprintjs.com">
    <img src="resources/logo.svg" alt="FingerprintJS" width="300px" />
  </a>
</p>
<p align="center">
  Browser fingerprinting solution
</p>
<p align="center">
  <a href="https://github.com/fingerprintjs/fingerprintjs/actions?workflow=Test">
    <img src="https://github.com/fingerprintjs/fingerprintjs/workflows/Test/badge.svg" alt="Build status">
  </a>
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs">
    <img src="https://img.shields.io/npm/dt/fingerprintjs2.svg" alt="Total downloads from NPM">
  </a>
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs">
    <img src="https://img.shields.io/npm/v/@fingerprintjs/fingerprintjs.svg" alt="Current NPM version">
  </a>
</p>

## Quick start

### Install from CDN

```html
<script>
  function onFingerprintJSLoad(fpAgent) {
    // The FingerprintJS agent is ready. Get a visitor identifier when you'd like to.
    fpAgent.get().then(result => {
      // This is the visitor identifier:
      const visitorId = result.visitorId;
      console.log(visitorId);
    });
  }
</script>
<script
  async src="https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js"
  onload="FingerprintJS.load().then(onFingerprintJSLoad)"
></script>
```

This is a simple way to start but not recommended because AdBlock and other browser extensions can block the script.
You should at least upload the script file to your server.

### Or from NPM and use with Webpack/Rollup/Browserify

```bash
npm i @fingerprintjs/fingerprintjs
# or
yarn add @fingerprintjs/fingerprintjs
```

```js
import * as FingerprintJS from '@fingerprintjs/fingerprintjs';

(async () => {
  // It's good to call this when the application starts
  const fpAgent = await FingerprintJS.load();

  // The FingerprintJS agent is ready. Get a visitor identifier when you'd like to.
  const result = await fpAgent.get();

  // This is the visitor identifier:
  const visitorId = result.visitorId;
  console.log(visitorId);
})();
```

## Pro version

Upgrade to [Pro version](https://fingerprintjs.com) to get 99.5% accuracy of identification.

<p align="center">
  <a href="https://fingerprintjs.com">
    <img src="resources/pro_screenshot.png" alt="Pro screenshot" width="697px" />
  </a>
</p>

| | Open Source version | Pro version |
|-----|-------|-------|
| Browser identification | Basic | Advanced |
| Anonymous user identification | ❌ | ✅ |
| Bot detection | ❌ | ✅ |
| Incognito / Private mode detection | ❌ | ✅ |
| Geolocation | ❌ | ✅ |
| Security | ❌ | ✅ |
| Server API | ❌ | ✅ |
| Webhooks | ❌ | ✅ |

Pro result example:

```js
{
  "requestId": "HFMlljrzKEiZmhUNDx7Z",
  "visitorId": "kHqPGWS1Mj18sZFsP8Wl",
  "visitorFound": true,
  "incognito": false,
  "bot": undefined,
  "ip": "192.65.67.131",
  "browserName": "Chrome",
  "browserVersion": "85.0.4183",
  "os": "Mac OS X",
  "osVersion": "10.15.6",
  "device": "Other",
  "ipLocation": {/* ... */}
}
```

🍿 [Live demo](https://fingerprintjs.com/demo)

⏱ [How to upgrade from Open Source to Pro in 30 seconds]()

📗 [FingerprintJS Pro documentation](https://dev.fingerprintjs.com)

## Open version reference

The library is shipped in various formats:

- Plain JS
    ```html
    <script
      async src="https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js"
      onload="/* ... */"
    ></script>
    ```
- UMD
    ```js
    require(['https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.umd.min'], FingerprintJS => {/* ... */});
    ```
- EcmaScript module
    ```js
    import * as FingerprintJS from '@fingerprintjs/fingerprintjs';
    ```
- CommonJS
    ```js
    const FingerprintJS = require('@fingerprintjs/fingerprintjs');
    ```

API:

- `FingerprintJS.load({ delayFallback?: number }): Promise<Agent>`

    Builds an instance of Agent and waits a delay required for a proper operation.
    `delayFallback` is duration (ms) of the fallback for browsers that don't support [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback).

- `agent.get({ debug?: boolean }): Promise<{ visitorId: string, components: {/* ... */} }>`

    Gets the visitor identifier.
    `debug: true` prints debug messages to the console.
    `visitorId` is the visitor identifier.
    `components` is a dictionary of components that have formed the identifier;
    each value is an object like `{ value: any, duration: number }` in case of success
    and `{ error: object, duration: number }` in case of an unexpected error during getting the component.

- `FingerprintJS.componentsToCanonicalString(components: object): string`

    Converts a dictionary of components (described above) to a canonical string,
    that can be passed to `getHash` to get a short identifier string.
    Designed for extending the library with your own components.

- `FingerprintJS.getHash(value: string): string`

- `FingerprintJS.componentsToDebugString(components: object): string`

    Converts a dictionary of components (described above) to a human-friendly text.

## Version policy

The library doesn't promise same visitor identifier between any versions
but tries to keep them same as much as reasonable.

The documented JS API follows [Semantic Versioning](https://semver.org).
Using undocumented features is at you own risk.

## Browser support

```bash
npx browserslist "> 1% in us"
```

## Contribution

See the [contribution guidelines](contributing.md) to know how to start a playground, test and build.

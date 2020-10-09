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
  async src="https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3.0.0-beta.2/dist/fp.min.js"
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
import * as FPJS from '@fingerprintjs/fingerprintjs';

(async () => {
  // It's good to call this when the application starts
  const fpAgent = await FPJS.load();

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

| | Open source version | Pro version |
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
  "ipLocation": { /* ... */ }
}
```

🍿 [Live demo](https://fingerprintjs.com/demo)

⏱ [How to upgrade from Open Source to Pro in 30 seconds]()

📗 [FingerprintJS Pro documentation](https://dev.fingerprintjs.com)

## Version policy

The library doesn't promise same visitor identifier between any versions
but tries to keep them same as much as reasonable.

The documented JS API follows [Semantic Versioning](https://semver.org).
Using undocumented features is at you own risk.

## Contribution

### Development playground

```bash
# Make sure you have Yarn installed
yarn install
yarn playground:start # Add '--port 8765' to change the server port
```

Then open http://localhost:8080 in a browser.
It's reloaded every time the source code is changed.

To build the playground distribution code (e.g. to upload to a static server), run:

```bash
yarn playground:build
```

The result will appear at `playground/dist`.

### How to build

To build the distribution files of the library, run:

```bash
yarn build
```

The files will appear at `dist`.

### How to publish

1. Bump the version. Changing the number in [package.json](package.json) is enough.
2. Build the project.
3. See what's will get into the NPM package, make sure it contains the distributive files and no excess files.
    To see, run `yarn pack`, an archive will appear nearby, open it with any archive browser.
4. Run
    ```bash
    yarn publish --access public # Add '--tag beta' (without the quotes) if you release a beta version
    ```

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
    // Initialize an agent at application startup.
    const fpPromise = FingerprintJS.load()

    // Get the visitor identifier when you need it.
    fpPromise
      .then(fp => fp.get())
      .then(result => {
        // This is the visitor identifier:
        const visitorId = result.visitorId
        console.log(visitorId)
      })
  }
</script>
<script
  async
  src="//cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js"
  onload="initFingerprintJS()"
></script>
```

[Run this code](https://stackblitz.com/edit/fpjs-3-cdn?file=index.html&devtoolsheight=100)

### Alternatively you can install from NPM to use with Webpack/Rollup/Browserify

```bash
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

  // This is the visitor identifier:
  const visitorId = result.visitorId
  console.log(visitorId)
})()
```

[Run this code](https://stackblitz.com/edit/fpjs-3-npm?file=index.js&devtoolsheight=100)

📕 [Full documentation](#open-source-version-reference)

## Upgrade to [Pro version](https://fingerprintjs.com/github/) to get 99.5% identification accuracy

FingerprintJS Pro is a professional visitor identification service that processes all information server-side and transmits it securely to your servers using server-to-server APIs.
Pro combines browser fingerprinting with vast amounts of auxiliary data (IP addresses, time of visit patterns, URL changes and more) to be able to reliably deduplicate different users that have identical devices, resulting in 99.5% identification accuracy.

See our [full product comparison](https://fingerprintjs.com/github/) for more information on the differences between open source and Pro.

<b>You can use Pro FREE for up to 1,000 unique monthly visitors - no credit card required.</b>

<p align="center">
  <a href="https://fingerprintjs.com/github/">
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
    <tr><td>Identification accuracy</td><td align="center">60%</td><td align="center" bgcolor="rgba(127, 127, 127, 0.1)">99.5%</td></tr>
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

See the [API reference](docs/api.md).

## Migrating from v2

- [Migration guide](docs/migrating_v2_v3.md)
- [V2 documentation](https://github.com/fingerprintjs/fingerprintjs/tree/v2)

## Version policy

See the visitor identifier compatibility policy in the [version policy guide](docs/browser_support.md).

## Browser support

The library supports all popular browsers.
See more details and learn how to run the library in old browsers in the [browser support guide](docs/browser_support.md).

## Contributing

See the [contributing guidelines](contributing.md) to learn how to start a playground, test and build.

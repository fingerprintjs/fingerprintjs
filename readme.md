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
<p align="center">
  <a href="https://discord.gg/39EpE2neBg">
    <img src="https://img.shields.io/discord/852099967190433792?style=for-the-badge&label=Discord&logo=Discord&logoColor=white" alt="Discord server">
  </a>
</p>

FingerprintJS is a browser fingerprinting library that queries browser attributes and computes a hashed visitor identifier from them. Unlike cookies and local storage, a fingerprint stays the same in incognito/private mode and even when browser data is purged.

[View Our Demo](https://fingerprintjs.github.io/fingerprintjs/).

## Quick start

```html
<script>
  // Initialize the agent at application startup.
  const fpPromise = import('https://openfpcdn.io/fingerprintjs/v3')
    .then(FingerprintJS => FingerprintJS.load())

  // Get the visitor identifier when you need it.
  fpPromise
    .then(fp => fp.get())
    .then(result => {
      // This is the visitor identifier:
      const visitorId = result.visitorId
      console.log(visitorId)
    })
</script>
```

[Run this code](https://stackblitz.com/edit/fpjs-3-cdn?file=index.html&devtoolsheight=100)

📕 [Full documentation](docs/api.md)

## Upgrade to [Pro version](https://fingerprintjs.com/github/) to get 99.5% identification accuracy

FingerprintJS Pro is a professional visitor identification service that processes all information server-side and transmits it securely to your servers using server-to-server APIs.
Pro combines browser fingerprinting with vast amounts of auxiliary data (IP addresses, time of visit patterns, URL changes and more) to be able to reliably deduplicate different users that have identical devices, resulting in the 99.5% identification accuracy.

**You can try Pro without usage limits for 10 days - no credit card required.**

<p align="center">
  <a href="https://fingerprintjs.com/github/">
    <img src="resources/pro_screenshot.png" alt="Pro screenshot" width="697px" />
  </a>
</p>

Full product comparison:

<table>
  <thead>
    <tr>
      <th></th>
      <th align="center">Open Source</th>
      <th align="center">Pro</th>
    </tr>
  </thead>
  <tbody>
    <tr><td colspan="3"><h4>Core Features</h4></td></tr>
    <tr><td>100% Open-source</td><td align="center">yes</td><td align="center">no<sup>1</sup></td></tr>
    <tr><td><b>Standard fingerprint signals</b><br/><i>screen, os, device name</i></td><td align="center">✓</td><td align="center">✓</td></tr>
    <tr><td><b>Advanced fingerprint signals</b><br/><i>canvas, audio, fonts</i></td><td align="center">✓</td><td align="center">✓</td></tr>
    <tr><td><b>ID type</b></td><td align="center">fingerprint</td><td align="center">visitorID<sup>2</sup></td></tr>
    <tr><td><b>ID lifetime</b></td><td align="center">several weeks</td><td align="center">months/years</td></tr>
    <tr><td><b>ID origin</b></td><td align="center">client</td><td align="center">server</td></tr>
    <tr><td><b>ID collisions</b></td><td align="center">common</td><td align="center">rare</td></tr>
    <!-- -->
    <tr><td colspan="3"><h4>Additional Features</h4></td></tr>
    <tr><td><b>Incognito mode detection</b><br/><i>works in all modern browsers - see our full list of <a href="https://dev.fingerprintjs.com/docs/browser-support/" target="_blank">browsers supported</a></i></td><td align="center">–</td><td align="center">✓</td></tr>
    <tr><td><b>Server-side accuracy increase</b><br/><i>based on additional server-side signals, such as TLS crypto support, ipv4/v6 data and others</i></td><td align="center">–</td><td align="center">✓</td></tr>
    <tr><td><b>Query API & realtime Webhooks</b><br/><i>build flexible workflows</i></td><td align="center">–</td><td align="center">✓</td></tr>
    <tr><td><b>Geolocation</b><br/><i>based on IP address</i></td><td align="center">–</td><td align="center">✓</td></tr>
    <!-- -->
    <tr><td colspan="3"><h4>Operations</h4></td></tr>
    <tr><td><b>Data security</b></td><td align="center">Your infrastructure</td><td align="center">Encrypted at rest</td></tr>
    <tr><td><b>Storage</b></td><td align="center">Your infrastructure</td><td align="center">Unlimited up to 1 yr</td></tr>
    <tr><td><b>Regions</b></td><td align="center">Your infrastructure</td><td align="center">Hosting in US and EU</td></tr>
    <tr><td><b>Compliance</b></td><td align="center">Your infrastructure</td><td align="center">GDPR, CCPA compliant<sup>3</sup></td></tr>
    <tr><td><b>SLA</b></td><td align="center">No SLA</td><td align="center">99.9% Uptime</td></tr>
    <tr><td><b>Support</b></td><td align="center">GitHub community</td><td align="center">Support team via email, chat, and call-back within 1 business day</td></tr>
  </tbody>
</table>

<sub>1. Pro uses the open source fingerprinting library as well as proprietary technology for increased accuracy and identifier stability.</sub>

<sub>2. VisitorIDs, in comparison to fingerprints, include server side techniques, are deduplicated and utilize fuzzy matching to result in a more accurate and stable identifier. Fingerprint hashes rely on an exact match across all browser attributes, making them less stable across > 4 week time intervals.</sub>

<sub>3. FingerprintJS Pro is GDPR and CCPA compliant as the data processor. You still need to be compliant as the data controller and use the identification for fraud under legitimate interest or ask for user consent.</sub>

Pro result example:

```js
{
  "requestId": "HFMlljrzKEiZmhUNDx7Z",
  "visitorId": "kHqPGWS1Mj18sZFsP8Wl",
  "visitorFound": true,
  "confidence": { "score": 0.995 },
  "incognito": false,
  "browserName": "Chrome",
  "browserVersion": "92.0.4515.107",
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

## Migrating from v2

- [Migration guide](docs/migrating_v2_v3.md)
- [V2 documentation](https://github.com/fingerprintjs/fingerprintjs/tree/v2)

## Version policy

See the compatibility policy for the API and visitor identifiers in the [version policy guide](docs/version_policy.md).

## Browser support

The library supports all popular browsers.
See more details and learn how to run the library in old browsers in the [browser support guide](docs/browser_support.md).

## Contributing

See the [contributing guidelines](contributing.md) to learn how to start a playground, test and build.

## Other projects by FingerprintJS

* [BotD -- Easy to use JavaScript bot detection](https://github.com/fingerprintjs/botd)
* [AEV -- Android App Environment Verification API](https://github.com/fingerprintjs/aev)

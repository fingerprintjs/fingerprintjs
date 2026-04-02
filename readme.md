<p align="center">
  <a href="https://fingerprint.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="resources/logo_light.svg" />
      <source media="(prefers-color-scheme: light)" srcset="resources/logo_dark.svg" />
      <img src="resources/logo_dark.svg" alt="FingerprintJS logo" width="312px" />
    </picture>
  </a>
</p>
<p align="center">
  <a href="https://github.com/fingerprintjs/fingerprintjs/actions/workflows/test.yml"><img src="https://github.com/fingerprintjs/fingerprintjs/actions/workflows/test.yml/badge.svg" alt="Build status"></a>
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs"><img src="https://img.shields.io/npm/v/@fingerprintjs/fingerprintjs.svg" alt="Current NPM version"></a>
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs"><img src="https://img.shields.io/npm/dm/@fingerprintjs/fingerprintjs.svg" alt="Monthly downloads from NPM"></a>
  <a href="https://www.jsdelivr.com/package/npm/@fingerprintjs/fingerprintjs"><img src="https://img.shields.io/jsdelivr/npm/hm/@fingerprintjs/fingerprintjs.svg" alt="Monthly downloads from jsDelivr"></a>
</p>
<p align="center">
  <a href="https://discord.gg/39EpE2neBg">
    <img src="https://img.shields.io/discord/852099967190433792?style=for-the-badge&label=Discord&logo=Discord&logoColor=white&color=5865F2" alt="Discord server">
  </a>
</p>

FingerprintJS is an open-source, client-side, browser fingerprinting library that queries browser attributes and computes a hashed visitor identifier from them. Unlike cookies and local storage, a fingerprint stays the same in incognito/private mode and even when browser data is purged.

FingerprintJS is available under the [MIT license](docs/licensing.md).

## Demo

Visit [https://fingerprintjs.github.io/fingerprintjs](https://fingerprintjs.github.io/fingerprintjs) to see your visitor identifier.

Now, try visiting the same page in private/incognito mode and notice that the visitor identifier remains the **same**!

## Installation

### npm

```bash
npm install @fingerprintjs/fingerprintjs
```

```jsx
import FingerprintJS from '@fingerprintjs/fingerprintjs'

// Initialize the agent at application startup.
const fpPromise = FingerprintJS.load()

;(async () => {
  // Get the visitor identifier when you need it.
  const fp = await fpPromise
  const result = await fp.get()
  console.log(result.visitorId)
})()
```

### CDN

```html
<script>
  // Initialize the agent at application startup.
  // If you're using an ad blocker or Brave/Firefox, this import will not work.
  // Please use the npm package instead: https://t.ly/ORyXk
  const fpPromise = import('https://openfpcdn.io/fingerprintjs/v5')
    .then(FingerprintJS => FingerprintJS.load())

  ;(async () => {
    // Get the visitor identifier when you need it.
    const fp = await fpPromise
    const result = await fp.get()
    console.log(result.visitorId)
  })()
</script>
```

[Run this code](https://stackblitz.com/edit/fpjs-5-cdn?file=index.html&devtoolsheight=100)

### Resources

📕 [API Reference](docs/api.md)

⚛️ [Sample usage with React on the StackBlitz platform](https://stackblitz.com/edit/fingerprintjs-react-demo)

🔑 [FingerprintJS Licensing](docs/licensing.md)

## Limitations

### Accuracy

Since FingerprintJS processes and generates fingerprints in the browser itself, the accuracy is significantly lower than in the [commercial version](https://fingerprint.com/pricing)

### Security

Because fingerprints are generated and processed in the browser, they are vulnerable to spoofing and reverse engineering.

## Want higher accuracy? Upgrade to Fingerprint Identification for free

FingerprintJS is great for getting started, but if you need production-grade accuracy for web or mobile, consider [**Fingerprint Identification**](https://fingerprint.com/products/identification/). You can [**sign up for a free account**](https://dashboard.fingerprint.com/signup) to get started.

Fingerprint Identification is a **closed-source, commercial** device intelligence platform designed to prevent fraud and improve user experiences. It's an enhanced version of FingerprintJS, fully redesigned to solve the most challenging identification use cases. Unlike FingerprintJS, it combines client-side signal collection with server-side processing. It collects over 100 browser and device signals, which are then analyzed server-side alongside network-level data, including signals that are entirely invisible to the browser, allowing it to reliably deduplicate visitors with identical devices. This server-side processing also validates that signals have not been tampered with or replayed, and generates a stable visitor identifier with **industry-leading accuracy** that is significantly harder to spoof than a purely client-side fingerprint.

Upgrading for free also unlocks access to the [Fingerprint MCP Server](https://docs.fingerprint.com/docs/mcp-server), letting your AI coding assistant build and interact directly with Fingerprint. To access [Smart Signals](https://fingerprint.com/products/smart-signals/) (device signals such as bot detection, VPN detection, and browser tampering detection), a 14-day free trial of the full platform is available.

Check out our [comparison table](docs/comparison.md) for a detailed breakdown of the differences between FingerprintJS and Fingerprint Identification.

### Fingerprint Identification resources

🍿 [Fingerprint Identification live demo](https://demo.fingerprint.com/playground)

📕 [Fingerprint Identification documentation](https://dev.fingerprint.com)

▶️ [Video: Use Fingerprint Identification to prevent multiple signups by the same user](https://www.youtube.com/watch?v=jWX9P5_jZn8)

⏱️ [How to upgrade from FingerprintJS to Fingerprint Identification in 30 seconds](https://dev.fingerprint.com/docs/migrating-from-fingerprintjs-to-fingerprint-pro)

## Migrating to v5

| Migrating from | Migration Guide | Documentation |
|----------|-----------|-----------|
| **v4** | [Migrating from v4 to v5](docs/migration/v4_v5.md) | [v4 documentation](https://github.com/fingerprintjs/fingerprintjs/tree/v4) |
| **v3** | [Migrating from v3 to v5](docs/migration/v3_v5.md) | [v3 documentation](https://github.com/fingerprintjs/fingerprintjs/tree/v3) |

## Version policy

See the compatibility policy for the API and visitor identifiers in the [version policy guide](docs/version_policy.md).

## Supported browsers

The library supports all popular browsers. See more details and learn how to run the library in old browsers in the [browser support guide](docs/browser_support.md).

## Where to get support

Using [Issues](https://github.com/fingerprintjs/fingerprintjs/issues) and [Discussions](https://github.com/fingerprintjs/fingerprintjs/discussions) publicly will help the community and other users with similar issues.

You can also join our [Discord server](https://discord.gg/ad6R2ttHVX) to ask questions, share feedback, and connect with other developers.

If you require private support for FingerprintJS, please email us at [oss-support@fingerprint.com](mailto:oss-support@fingerprint.com).

## Contributing

See the [Contribution guidelines](contributing.md) to learn how to contribute to the project or run the project locally.
Please read it carefully before making a pull request.

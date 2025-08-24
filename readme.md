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

FingerprintJS is a [source-available](docs/licensing.md), client-side, browser fingerprinting library that queries browser attributes and computes a hashed visitor identifier from them. Unlike cookies and local storage, a fingerprint stays the same in incognito/private mode and even when browser data is purged.

FingerprintJS is available under a [BSL license](docs/licensing.md) for non-production purposes.

_FingerprintJS is different from [Fingerprint Identification](https://dev.fingerprint.com/docs/introduction#fingerprint-identification-vs-fingerprintjs), our more detailed and accurate commercial product. See below for [more information](#industry-leading-accuracy-with-fingerprint-identification)._

## Demo

Visit https://fingerprintjs.github.io/fingerprintjs to see your visitor identifier.

Now, try visiting the same page in private / incognito mode and notice how the visitor identifier remains the **same**!

## Getting Started

```html
<script>
  // Initialize the agent at application startup.
  // If you're using an ad blocker or Brave/Firefox, this import will not work.
  // Please use the NPM package instead: https://t.ly/ORyXk
  const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4')
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

[Run this code](https://stackblitz.com/edit/fpjs-4-cdn?file=index.html&devtoolsheight=100)

### Resources

📕 [API Reference](docs/api.md)

⚛️ [Sample usage with React on the StackBlitz platform](https://stackblitz.com/edit/fingerprintjs-react-demo)

🔑 [FingerprintJS Licensing](docs/licensing.md)

## Limitations

### Accuracy

Since FingerprintJS processes and generates the fingerprints from within the browser itself, the accuracy is limited (40% - 60%). For example, when 2 different users send requests using identical (i.e. same version, same vendor, same platform), browsers, FingerprintJS will not be able to tell these two browsers apart, primarily because the attributes from these browsers will be identical.

### Security

Because of how the fingerprints are processed and generated from within the browser itself, they are vulnerable to spoofing and reverse engineering.

## Industry-leading accuracy with Fingerprint Identification

The main difference between FingerprintJS and [Fingerprint Identification](https://dev.fingerprint.com/docs/introduction) lies in the number of attributes collected from the browser, how they are processed, and the accuracy in identifying visitors.

Fingerprint Identification is a **closed-source**, **commercial** device intelligence platform designed to prevent fraud and improve user experiences. It's an enhanced version of FingerprintJS and has been fully re-designed to solve the most challenging identification use cases. Its source is not available in this or any other public repository.

Unlike FingerprintJS, Fingerprint Identification is able to achieve **industry-leading accuracy** because it processes the browser attributes on the server and also analyzes vast amounts of auxiliary data (e.g. IP addresses, time of visit patterns, URL changes, etc.). Because of these advanced matching techniques, Fingerprint Identification is able to reliably deduplicate different visitors that have identical devices.

Fingerprint Identification is available for Web, Android, iOS, and other platforms. You can easily get started by [signing up](https://dashboard.fingerprint.com/signup) for a free, unlimited 14-day trial.

Check out our [comparison table](docs/comparison.md) for a detailed breakdown of the differences between FingerprintJS and Fingerprint Identification.

### Fingerprint Identification resources

🍿 [Fingerprint Identification live demo](https://demo.fingerprint.com/playground)

📕 [Fingerprint Identification documentation](https://dev.fingerprint.com)

▶️ [Video: Use Fingerprint Identification to prevent multiple signups by same user](https://www.youtube.com/watch?v=jWX9P5_jZn8)

⏱️ [How to upgrade from FingerprintJS to Fingerprint Identification in 30 seconds](https://dev.fingerprint.com/docs/migrating-from-fingerprintjs-to-fingerprint-pro#migrating-from-fingerprintjs-v4-source-available-to-pro)

## Migrating to v4

| Migrating from | Migration Guide | Documentation |
|----------|-----------|-----------|
| **v3** | [Migrating from v3 to v4](docs/migration/v3_v4.md) | [v3 documentation](https://github.com/fingerprintjs/fingerprintjs/tree/v3) |
| **v2** | [Migrating from v2 to v4](docs/migration/v2_v4.md) | [v2 documentation](https://github.com/fingerprintjs/fingerprintjs/tree/v2) |
| **v1** | [Migrating from v1 to v4](docs/migration/v1_v4.md) | [v1 documentation](https://github.com/fingerprintjs/fingerprintjs/tree/1.8.6) |

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

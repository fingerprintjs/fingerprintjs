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

FingerprintJS is a source-available, client-side, browser fingerprinting library that queries browser attributes and computes a hashed visitor identifier from them. Unlike cookies and local storage, a fingerprint stays the same in incognito/private mode and even when browser data is purged.

## License

Starting version 4.0.0, FingerprintJS is licensed under [Business Source License 1.1](LICENSE).
The BSL allows use only for non-production purposes. You can learn more details in our [announcement](https://fingerprint.com/blog/fingerprintjs-license-change/).

| Use Case | Is a commercial license required?|
|----------|-----------|
| Exploring FingerprintJS for your own research, hobbies, and testing purposes | **No** |
| Using FingerprintJS to build a proof-of-concept application | **No** |
| Using FingerprintJS to build revenue-generating applications | **Yes** |
| Using FingerprintJS to build software that is provided as a service (SaaS) | **Yes** |
| Forking FingerprintJS for any production purposes | **Yes** |

To purchase a license for uses not authorized by BSL, please contact us at [sales@fingerprint.com](mailto:sales@fingerprint.com?subject=Interested%20in%20FingerprintJS%20commercial%20license).

## Demo

Visit https://fingerprintjs.github.io/fingerprintjs to know your visitor identifier.

Now, try visiting the same page in private / incognito mode and notice how the visitor identifier remains the **same**!

## Getting Started

```html
<script>
  // Initialize the agent at application startup.
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

## Limitations

### Accuracy
Since FingerprintJS processes and generates the fingerprints from within the browser itself, the accuracy is limited (40% - 60%). For example, when 2 different users send requests using identical (i.e. same version, same vendor, same platform), browsers, FingerprintJS will not be able to tell these two browsers apart, primarily because the attribitutes from these browsers will be identical.

### Security
Because of how the fingerprints are processed and generated from within the browser itself, they are vulnerable to spoofing and reverse engineering.

## Get 99.5% accuracy

[Fingerprint Identification](https://fingerprint.com/github/) is a **closed-source**, **commercial** device identification product designed for fraud detection, device identification, marketing attribution, and analytics. This product is an enhanced version of FingerprintJS and has been fully re-designed to solve the most challenging identification use cases. Its source is not available in this or any other public repository.

Fingerprint Identification is able to achieve 99.5% accuracy, because it processes the browser attributes on the server and also analyzes vast amounts of auxiliary data (e.g. IP addresses, time of visit patterns, URL changes, etc.). Because of these advanced matching techniques, Fingerprint Identification is able to reliably deduplicate different users that have identical devices. For a comprehensive list of advantages over FingerprintJS, please visit [Fingerprint Identification vs. FingerprintJS](https://dev.fingerprint.com/docs/identification-vs-fingerprintjs).

Fingerprint Identification is available for Web, Android, iOS, and other platforms. Our [plans start at $200 per month](https://fingerprint.com/pricing/) and include with them 100K API calls. You can easily get started by [signing up](https://dashboard.fingerprint.com/signup) for a free, no-obligation 14-day trial.

### Resources

🍿 [Fingerprint Identification live demo](https://fingerprint.com/demo)

▶️ [Video: Use Fingerprint Identification to prevent multiple signups by same user](https://www.youtube.com/watch?v=jWX9P5_jZn8)

🗂️ [Sample responses for the different Fingerprint Identification plans](https://fingerprinthub.com/playground)

⏱️ [How to upgrade from FingerprintJS to Fingerprint Identification in 30 seconds](https://dev.fingerprint.com/v3/docs/migrating-from-source-available-v4)

📕 [Fingerprint Identification documentation](https://dev.fingerprint.com)

## Migrating to v4

| Migrating from | Migration Guide | Documentation |
|----------|-----------|-----------|
| **v3** | [Migrating from v3 to v4](docs/migration/v3_v4.md) | [v3 documentation](https://github.com/fingerprintjs/fingerprintjs/tree/v3) |
| **v2** | [Migrating from v2 to v4](docs/migration/v2_v4.md) | [v2 documentation](https://github.com/fingerprintjs/fingerprintjs/tree/v2) |
| **v1** | [Migrating from v1 to v4](docs/migration/v1_v4.md) | [v1 documentation](https://github.com/fingerprintjs/fingerprintjs/tree/1.8.6) |

## Version policy

See the compatibility policy for the API and visitor identifiers in the [version policy guide](docs/version_policy.md).

## Supported browsers

The library supports all popular browsers.
See more details and learn how to run the library in old browsers in the [browser support guide](docs/browser_support.md).

## Where to get support

Using [Issues](https://github.com/fingerprintjs/fingerprintjs/issues) and [Discussions](https://github.com/fingerprintjs/fingerprintjs/discussions) publicly will help the open-source community and other users with similar issues.
However, if you require private support, please email us at [oss-support@fingerprint.com](mailto:oss-support@fingerprint.com).

## Contributing

See the [contribution guidelines](contributing.md) to learn how to start a playground, test, and build.

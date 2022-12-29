# Migrating FingerprintJS v1 to v3

This guide shows how to migrate your code from FingerprintJS version 1 to version 3.

## Browser support

The support of Internet Explorer and some other browsers has been dropped.
See the list of supported browsers in the [browser support guide](browser_support.md).

## Installation

The migration process depends on the way you install the library.

### CDN

Use the new URL: https://openfpcdn.io/fingerprintjs/v3/iife.min.js

### Bower

Bower support is dropped, choose another installation method.

### NPM or Yarn

Change the package name:

```bash
npm remove fingerprintjs2
npm install @fingerprintjs/fingerprintjs
# or
yarn remove fingerprintjs2
yarn add @fingerprintjs/fingerprintjs
```

The new version sends HTTP requests to collect usage statistics, they can be disabled.
See [this page](api.md#webpackrollupnpmyarn) for more details.

Remove the type declaration package.
You don't need it because the type declaration is embedded into the main package in v3:

```bash
npm remove @types/fingerprintjs2
# or
yarn remove @types/fingerprintjs2
```

## Initialization

Instead of creating a new `Fingerprint2` object, you must call `FingerprintJS.load()`.
This function returns a promise that resolves with an agent object.
The `get` method of the agent returns a promise instead of invoking a callback:

```diff
- const fp = new Fingerprint2()
- fp.get(function(visitorId, components) {
+ const fpPromise = FingerprintJS.load()
+ fpPromise
+   .then(fp => fp.get()){
+   .then(({ visitorId, components }) => {
      // Handle the result
    })
```

The format of raw components is different:

```diff
console.log(components)

- [
-   { key: 'component1', value: 'Some value' },
-   { key: 'component2', value: ['other', 'value'] },
- ]
+ {
+   component1: { value: 'Some value', duration: 4 },
+   component2: { value: ['other', 'value'], duration: 2 },
+ }
```

## Customization

Version 3 has no options for customization, it provides a good built-in setup.
Nevertheless, you can exclude built-in entropy components and add custom entropy components manually.
See the [extending guide](extending.md) to learn more.

## How to update without losing the identifiers

The identifiers produced by version 3 don't match the identifiers produced by version 1.
If this is an issue for you, you can implement the following strategy.

Install version 3 together with version 1:

```html
<script src="https://cdn.jsdelivr.net/npm/fingerprintjs2@1/dist/fingerprint2.min.js"></script>
<script src="https://openfpcdn.io/fingerprintjs/v3/iife.min.js"></script>
```

When you need the visitor identifier, get identifiers from both versions:

```js
Promise.all([
  new Promise(resolve => {
    new Fingerprint2().get((visitorId, components) => {
      resolve({ visitorId, components })
    })
  }),
  FingerprintJS.load().then(fp => fp.get())
]).then(([v1Result, v3Result]) => {
  // Handle both the results. For example, send to your server.
  return fetch(
    '/visitor'
      + `?fingerprintV1=${encodeURIComponent(v1Result.visitorId)}`
      + `&fingerprintV3=${encodeURIComponent(v3Result.visitorId)}`
  )
})
```

Make your server search using both the identifiers. Save the version 3 identifier:

```sql
-- Getting the visitor
SELECT * FROM visitors
WHERE
  fingerprintV1 = :fingerprintV1 OR
  fingerprintV3 = :fingerprintV3;

-- Update the visitor identifier
-- to switch to the fingerprint version 3
UPDATE visitors
SET fingerprintV3 = :fingerprintV3
WHERE fingerprintV1 = :fingerprintV1;

-- Saving a new visitor
INSERT INTO visitors (..., fingerprintV3)
VALUES (..., :fingerprintV3);
```

Later, when you get many enough identifiers of the version 3, remove the version 1 library and its identifiers.

The version 3 fingerprints may change after updating to a new major version, so you should
[extend this strategy](version_policy.md#how-to-update-without-losing-the-identifiers) to minor sub-versions of version 3 too.

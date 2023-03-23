# Migrating FingerprintJS v2 to v3

This guide shows how to migrate your code from FingerprintJS version 2 to version 3.

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

Update the package version:

```bash
npm install @fingerprintjs/fingerprintjs
# or
yarn add @fingerprintjs/fingerprintjs
```

The new version sends HTTP requests to collect usage statistics, they can be disabled.
See [this page](api.md#webpackrollupnpmyarn) for more details.

Remove the type declaration package.
You don't need it because the type declaration is embedded into the main package in v3:

```bash
npm remove @types/fingerprintjs__fingerprintjs
# or
yarn remove @types/fingerprintjs__fingerprintjs
```

## Initialization

Version 3 doesn't require you to call `requestIdleCallback` or `setTimeout` manually.
Instead, you must call `FingerprintJS.load()`.
This function returns a promise that resolves with an agent object.
The agent has a `get` method that you will use instead of calling `Fingerprint2.get` directly:

```diff
- requestIdleCallback(() => {
-   Fingerprint2.get(result => {
+ const fpPromise = FingerprintJS.load()
+ fpPromise
+   .then(fp => fp.get()){
+   .then(result => {
      // Handle the result
    })
- })
```

## Handling the result

Version 3 emits a complete visitor identifier, you don't need to derive it from the components by yourself:

```diff
  fp.get().then(result => {
-   const values = result.map(function (component) { return component.value })
-   const visitorId = Fingerprint2.x64hash128(values.join(''), 31)
+   const visitorId = result.visitorId
  })
```

If you need to get the raw components, you can, but the format is different:

```diff
const result = await fp.get()
console.log(result)

- [
-   { key: 'ordinaryComponent', value: 'Some value' },
-   { key: 'componentWithError', value: 'error' },
-   { key: 'notAvailableComponent', value: 'not available' },
-   { key: 'excludedComponent', value: 'excluded' },
- ],
+ {
+   visitorId: 'aStringWithAnIdentifier',
+   components: {
+     ordinaryComponent: { value: 'some value', duration: 4 },
+     componentWithError: { error: { message: 'This is the error object' }, duration: 2 },
+     notAvailableComponent: { value: undefined, duration: 1 },
+     excludedComponent: { value: 'Exclusion is not supported', duration: 10 },
+   }
+ }
```

## Customization

Version 3 has no options for customization, it provides a good built-in setup.
Nevertheless, you can exclude built-in entropy components and add custom entropy components manually.
See the [extending guide](extending.md) to learn more.

## How to update without losing the identifiers

The identifiers produced by version 3 don't match the identifiers produced by version 2.
If this is an issue for you, you can implement the following strategy.

Install version 3 together with version 2:

```html
<script src="https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@2/dist/fingerprint2.min.js"></script>
<script src="https://openfpcdn.io/fingerprintjs/v3/iife.min.js"></script>
```

(if you prefer NPM or Yarn, see [this note](https://stackoverflow.com/a/56495651/1118709))

When you need the visitor identifier, get identifiers from both versions:

```js
Promise.all([
  new Promise(resolve => {
    requestIdleCallback(() => {
      Fingerprint2.get(resolve)
    })
  }),
  FingerprintJS.load().then(fp => fp.get())
]).then(([v2Result, v3Result]) => {
  // Handle both the results. For example, send to your server.
  const v2VisitorId = Fingerprint2.x64hash128(
    v2Result.map(component => component.value).join(''),
    31
  )
  const v3VisitorId = v3Result.visitorId
  return fetch(
    '/visitor'
      + `?fingerprintV2=${encodeURIComponent(v2VisitorId)}`
      + `&fingerprintV3=${encodeURIComponent(v3VisitorId)}`
  )
})
```

Make your server search using both the identifiers. Save the version 3 identifier:

```sql
-- Getting the visitor
SELECT * FROM visitors
WHERE
  fingerprintV2 = :fingerprintV2 OR
  fingerprintV3 = :fingerprintV3;

-- Update the visitor identifier
-- to switch to the fingerprint version 3
UPDATE visitors
SET fingerprintV3 = :fingerprintV3
WHERE fingerprintV2 = :fingerprintV2;

-- Saving a new visitor
INSERT INTO visitors (..., fingerprintV3)
VALUES (..., :fingerprintV3);
```

Later, when you get many enough identifiers of the version 3, remove the version 2 library and its identifiers.

The version 3 fingerprints may change after updating to a new major version, so you should
[extend this strategy](version_policy.md#how-to-update-without-losing-the-identifiers) to minor sub-versions of version 3 too.

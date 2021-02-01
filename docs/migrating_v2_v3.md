# Migrating FingerprintJS v2 to v3

This guide shows how to migrate your code from FingerprintJS version 2 to version 3.

## Browser support

The support of Internet Explorer 10 and older has been dropped.
Some old browsers like Internet Explorer 11 and Android Browser 4.1 require a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) polyfill;
see the [browser support guide](browser_support.md#old-browsers-requirements) to learn more about usage with these browsers.

## Installation

The migration process depends on the way you install the library.

### CDN

Use the new URL: https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js

### Bower

Bower support is dropped, choose another installation method.

### NPM or Yarn

Update the package version:

```bash
npm install @fingerprintjs/fingerprintjs
# or
yarn add @fingerprintjs/fingerprintjs
```

Remove the type declaration package.
You don't need it because the type declaration is embedded into the main package in v3:

```bash
npm remove @types/fingerprintjs__fingerprintjs
# or
yarn remove @types/fingerprintjs__fingerprintjs
```

## Initialization

Version 3 doesn't require you to call `requiestIdleCallback` or `setTimeout` manually.
Instead, you must call `FingerprintJS.load()`.
This function returns a promise that resolves with an agent object.
The agent has a `get` method that you will use instead of calling `Fingerprint2.get` directly:

```diff
- requestIdleCallback(() => {
+ FingerprintJS.load().then(fp => {
-   Fingerprint2.get().then(result => {
+   fp.get().then(result => {
      // Handle the result
    })
  })
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

If you need to get raw components, you can, but the format is different:

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
Nevertheless, you can exclude components and add custom components manually.
Use the provided hash function to achieve this:

```js
const result = await fp.get()

// Exclude a couple components
const { languages, audio, ...components } = result.components

// Add a few custom components
const extendedComponents = {
  ...components,
  foo: { value: await getFooComponent() },
  bar: { value: await getBarComponent() },
}

// Make a visitor identifier from your custom list of components
const visitorId = FingerprintJS.hashComponents(extendedComponents)
```

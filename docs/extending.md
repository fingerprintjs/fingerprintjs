# Extending FingerprintJS

You can exclude built-in entropy components and add custom entropy components,
for example, when a component is too unstable for your needs.
Use the built-in hash function to hash your custom list of components.
An example of component exclusion:

```js
// ...

const result = await fp.get()

// The `languages` and `audio` components will be excluded
const { languages, audio, ...components } = result.components

// Optinally, you can make a visitor identifier from your custom list of components
const visitorId = FingerprintJS.hashComponents(components)
```

An example of component addition:

```js
// ...

const result = await fp.get()

// New components will be added: `foo` and `bar`.
// You should implement the `getFooComponent` and `getBarComponent` functions by yourself,
// they can return any value.
const components = {
  ...result.components,
  foo: { value: await getFooComponent() },
  bar: { value: await getBarComponent() },
}

// Optinally, you can make a visitor identifier from your custom list of components
const visitorId = FingerprintJS.hashComponents(components)
```

An example of both component exclusion and addition:

```js
// ...

const result = await fp.get()

// The `languages` and `audio` components will be excluded
const { languages, audio, ...components } = result.components

// New components will be added: `foo` and `bar`
const extendedComponents = {
  ...components,
  foo: { value: await getFooComponent() },
  bar: { value: await getBarComponent() },
}

// Optinally, you can make a visitor identifier from your custom list of components
const visitorId = FingerprintJS.hashComponents(extendedComponents)
```

You can format your custom list of components into a human-friendly text:

```js
// ...

const debugOutput = document.querySelector('pre')
debugOutput.textContent = FingerprintJS.componentsToDebugString(components)
```

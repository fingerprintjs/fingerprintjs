# FingerprintJS

Work in progress, stay tuned.

## Quick start

### In browser

```html
<script>
  function onFingerprintJSLoad(fp) {
    fp.get().then(({ visitorId }) => console.log(visitorId));
  }
</script>
<script
  async src="https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3.0.0-beta.2/dist/fp.min.js"
  onload="FingerprintJS.load().then(onFingerprintJSLoad)"
></script>
```

### Webpack/Rollup/Browserify

```bash
npm i @fingerprintjs/fingerprintjs
```

```js
import * as FPJS from '@fingerprintjs/fingerprintjs';

(async () => {
  const fpjs = await FPJS.load();
  const { visitorId } = await fpjs.get();
  console.log(visitorId)
})();
```

## Version policy

The library doesn't promise same visitor identifier between any versions
but tries to keep them same as much as reasonable.

The documented JS API follows [Semantic Versioning](https://semver.org).
Using undocumented features is at you own risk.

## Contribution

### How to build

```bash
# Make sure you have Yarn installed
yarn install
yarn build
```

### How to publish

1. Bump the version. Changing the number in [package.json](package.json) is enough.
2. Build the project.
3. Run
    ```bash
    yarn publish --access public # Add '--tag beta' (without the quotes) if you release a beta version
    ```

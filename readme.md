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

A simple way to start but not recommended because AdBlock and similar browser extensions often block this URL.
You should at least upload the script to your server.

### Webpack/Rollup/Browserify

```bash
npm i @fingerprintjs/fingerprintjs
```

```js
import * as FPJS from '@fingerprintjs/fingerprintjs';

(async () => {
  const fpjs = await FPJS.load();
  const { visitorId } = await fpjs.get();
  console.log(visitorId);
})();
```

## Version policy

The library doesn't promise same visitor identifier between any versions
but tries to keep them same as much as reasonable.

The documented JS API follows [Semantic Versioning](https://semver.org).
Using undocumented features is at you own risk.

## Contribution

### Development playground

```bash
# Make sure you have Yarn installed
yarn install
yarn playground:start # Add '--port 8765' to change the server port
```

Then open http://localhost:8080 in a browser.
It's reloaded every time the source code is changed.

To build the playground distribution code (e.g. to upload to a static server), run:

```bash
yarn playground:build
```

The result will appear at `playground/dist`.

### How to build

To build the distribution files of the library, run:

```bash
yarn build
```

The files will appear at `dist`.

### How to test

There are automatic tests.
They are run by [Jasmine](https://jasmine.github.io) in real browsers using [Karma](https://karma-runner.github.io).

To run the tests in a browser on your machine, build the project and run:
```bash
yarn test:local --browsers ChromeHeadless
# or to run in Firefox
yarn test:local --browsers FirefoxHeadless
# or to run in both
yarn test:local
```

To run the tests in browsers on [BrowserStack](https://www.browserstack.com), get a BrowserStack access key and run:
```bash
# For Linux, macOS and WSL (Linux on Windows)
BROWSERSTACK_USERNAME=your-username BROWSERSTACK_ACCESS_KEY=your-key yarn test:browserstack
```
Or make a PR to this repository, the test will run in BrowserStack automatically.

Unit test files are located right next to individual module files that they check.
Integration tests are located in the `tests` directory.

### How to publish

1. Bump the version. Changing the number in [package.json](package.json) is enough.
2. Build and test the project.
3. See what's will get into the NPM package, make sure it contains the distributive files and no excess files.
    To see, run `yarn pack`, an archive will appear nearby, open it with any archive browser.
4. Run
    ```bash
    yarn publish --access public # Add '--tag beta' (without the quotes) if you release a beta version
    ```

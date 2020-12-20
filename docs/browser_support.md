# Browser support

The library supports all popular browsers.
We use the following terminal command to decide which browsers to support:

```bash
npx browserslist "cover 95% in us, not IE < 10"
```

At the moment, the browsers are:

- **Internet Explorer** 11 (see the section below)
- **Edge** 18 and 85+
- **Chrome** 42+
- **Firefox** 48+
- **Desktop Safari** 11.1+
- **Mobile Safari** 9.3+
- **Samsung Internet** 11.1+
- **Android Browser** 4.1+ (see the section below)

Other browsers will probably also work, but we don't guarantee it.

## Old browsers requirements

Very old browsers like Internet Explorer 11 and Android Browser 4.1
require a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) polyfill to work.
Add a Promise polyfill before loading the FingerprintJS agent.
Examples for various installation methods:

- Global variable
    ```diff
      <script>
        function initFingerprintJS() {
          // Start loading FingerprintJS here
        }
      </script>
    + <script src="//cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js"></script>
      <script
        async
        src="//cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js"
        onload="initFingerprintJS()"
      ></script>
    ```
- UMD
    ```diff
      require(
        [
          '//cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.umd.min.js',
    +     '//cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js',
        ],
        (FingerprintJS) => {
          // Start loading FingerprintJS here
        }
      );
    ```
- ECMAScript module
    ```bash
    # Install the polyfill package first:
    npm i promise-polyfill
    # or
    yarn add promise-polyfill
    ```

    ```diff
    + import 'promise-polyfill/src/polyfill';
      import FingerprintJS from '@fingerprintjs/fingerprintjs';

      // Start loading FingerprintJS here
    ```
- CommonJS
    ```bash
    # Install the polyfill package first:
    npm i promise-polyfill
    # or
    yarn add promise-polyfill
    ```

    ```diff
    + require('promise-polyfill/src/polyfill');
      const FingerprintJS = require('@fingerprintjs/fingerprintjs');

      // Start loading FingerprintJS here
    ```
## Syntax for Old browsers

Older browsers like IE11 do not support arrow functions (=>). To support older browsers, it should be used in the following form
```diff
- FingerprintJS.load().then(fp => {
+ FingerprintJS.load().then(function (fp) {
-fp.get().then(result => {
+ fp.get().then(function (result) {
```

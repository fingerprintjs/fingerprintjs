
<p align="center">
  <a href="https://github.com/fingerprintjs/fingerprintjs/actions?workflow=Lint+and+Test">
    <img src="https://github.com/fingerprintjs/fingerprintjs/workflows/Lint%20and%20Test/badge.svg" alt="Build status">
  </a>
  <a href="https://gitter.im/Valve/fingerprintjs2">
    <img src="https://badges.gitter.im/Valve/fingerprintjs2.svg" alt="Gitter chat">
  </a>
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs">
    <img src="https://img.shields.io/npm/dt/fingerprintjs2.svg" alt="Total downloads from NPM">
  </a>
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs">
    <img src="https://img.shields.io/npm/v/fingerprintjs2.svg" alt="Current NPM version">
  </a>
  <br/>
</p>

<h3 align="center">
  <a href="https://fingerprintjs.com/demo">Try Fingerprint.js PRO Demo - 99.5% identification accuracy</a>
</h3>


## Installation

- CDN: `//cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@2/dist/fingerprint2.min.js` or `//unpkg.com/@fingerprintjs/fingerprintjs@2/dist/fingerprint2.min.js`
- Bower: `bower install fingerprintjs2`
- NPM: `npm install @fingerprintjs/fingerprintjs`
- Yarn: `yarn add @fingerprintjs/fingerprintjs`


## Usage

```js
if (window.requestIdleCallback) {
    requestIdleCallback(function () {
        Fingerprint2.get(function (components) {
          console.log(components) // an array of components: {key: ..., value: ...}
        })
    })
} else {
    setTimeout(function () {
        Fingerprint2.get(function (components) {
          console.log(components) // an array of components: {key: ..., value: ...}
        })  
    }, 500)
}
```

**Note 1: Must use requestIdleCallback** You should not run fingerprinting directly on or after page load. Rather, delay it for a few milliseconds with [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) or [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) to ensure consistent fingerprints. See [#307](https://github.com/fingerprintjs/fingerprintjs/issues/307), [#254](https://github.com/fingerprintjs/fingerprintjs/issues/254), and others.

**Note 2: Browser independent components** Some components change when you switch to a different browser on the same device. See: https://github.com/fingerprintjs/fingerprintjs/wiki/Browser-independent-components

**Note 3: Unstable options** Some options change every time you refresh the page. See: https://github.com/fingerprintjs/fingerprintjs/wiki/Stable-components

On my machine (MBP 2013 Core i5) + Chrome 46 the default FP process takes about 80-100ms. If you use `extendedJsFonts` option this time will increase up to 2000ms (cold font cache).

To speed up fingerprint computation, you can exclude font detection (~ 40ms), canvas fingerprint (~ 10ms),  WebGL fingerprint (~ 35 ms), and Audio fingerprint (~30 ms).

## Options

You choose which components to include in the fingerprint, and configure some other stuff. Example:

```js
var options = {fonts: {extendedJsFonts: true}, excludes: {userAgent: true}}
```

For the default options, [please see the source code.](https://github.com/fingerprintjs/fingerprintjs/blob/577f251d18e3204b1420c45c50845f86d83cc946/fingerprint2.js#L245)

### `fonts.extendedJsFonts`

By default, JS font detection will only detect up to 65 installed fonts. If you want to improve the font detection, you can pass `extendedJsFonts: true` option. This will increase the number of detectable fonts to ~500.

Note that this option increases fingerprint duration from about 80-100ms to up to 2000ms (cold font cache).  It can incur even more overhead on mobile Firefox browsers, which is much slower in font detection, so use it with caution on mobile devices.

### `fonts.userDefinedFonts`
Specifies an array of user-defined fonts to increase font fingerprint entropy even more.

While hundreds of the most popular fonts are included in the extended font list, you may wish to increase the entropy of the font fingerprint by specifying the `userDefinedFonts` option as an array of font names, **but make sure to call the Fingerprint function after the page load, and not before**, otherwise font detection might not work properly and in a result returned hash might be different every time you reloaded the page.

```js
Fingerprint2.get({
  userDefinedFonts: ["Nimbus Mono", "Junicode", "Presto"]
}, function(components) {

})
```

### `fonts.swfContainerId`
Specifies the dom element ID to be used for swf embedding (flash fonts)

### `fonts.swfPath`
Specifies the path to the FontList.swf (flash fonts)

### `screen.detectScreenOrientation` (default: true)

To ensure consistent fingerprints when users rotate their mobile devices.
Otherwise, screen resolution will change when the device is rotated.

### `plugins.sortPluginsFor` (default: `[/palemoon/i]`)

Some browsers randomise plugin order. You can give a list of user agent regexes for which plugins should be sorted.

### `plugins.excludeIE`
Skip IE plugin enumeration/detection

### `audio.excludeIOS11` (default: true)

iOS 11 prevents audio fingerprinting unless started from a user interaction (screen tap), preventing the fingerprinting process from finishing. If you're sure you start fingerprinting from a user interaction event handler, you may enable audio fingerprinting on iOS 11.

### `audio.timeout` (default: 1000)
maximum time allowed for 'audio' component

### `fontsFlash`

To use Flash font enumeration, make sure you have swfobject available. If you don't, the library will skip the Flash part entirely.

### `extraComponents`

Arrays of extra components to include.

```js
var options = {
    extraComponents : [
        {key: 'customKey', getData: function (done, options) {
            done('infos ...')
        }
    ]
}
```

### `preprocessor`

Function that is called with each component value that may be used to modify component values before computing the fingerprint. For example: strip browser version from user agent.

```js
Fingerprint2.get({
  preprocessor: function(key, value) {
    if (key == "userAgent") {
      var parser = new UAParser(value); // https://github.com/faisalman/ua-parser-js
      var userAgentMinusVersion = parser.getOS().name + ' ' + parser.getBrowser().name
      return userAgentMinusVersion
    }
    return value
  }
},function(components) {
  // userAgent component will contain string processed with our function. For example: Windows Chrome
});
```

### `excludes`

An object of with components keys to exclude. Empty object to include everything. By default most of the components are included (please see the source code for details).

```js
var options = {
    excludes: {userAgent: true, language: true}
}
```

To see a list of possible excludes, [please see the source code.](https://github.com/fingerprintjs/fingerprintjs/blob/577f251d18e3204b1420c45c50845f86d83cc946/fingerprint2.js#L1314)

### Constants

The constants used for unavailable, error'd, or excluded components' values.

```js
var options = {
    NOT_AVAILABLE: 'not available',
    ERROR: 'error',
    EXCLUDED: 'excluded',
}
```

- `NOT_AVAILABLE`: Component value if the browser doesn't support the API the component uses (e.g. `enumerateDevices`) or the browser doesn't provide a useful value (e.g. `deviceMemory`).
- `ERROR`: The component function threw an error.
- `EXCLUDED`: The component was excluded.


## Upgrade guide from 1.8.2 to 2.0.0

### Backwards compatibility mode

Fingerprintjs2 v2.0 provides a v1.8 compatibility wrapper that keeps user's fingerprints identical to the ones generated with v1.8. Note that we will drop this wrapper at some point.

Note that the `options` parameter **must be provided in v2.0 syntax**.

```js
// options must be provided in v2.0 syntax
Fingerprint2.getV18(options, function (result, components) {
  // result is murmur hash fingerprint
  // components is array of {key: 'foo', value: 'component value'}
})
```

### get and getPromise

`Fingerprint2.get` is now a static function. It replaces `new Fingerprint2().get`. It will not hash the result by default anymore.

```js
var options = {}
Fingerprint2.get(options, function (components) {
  // components is array of {key: 'foo', value: 'component value'}
    ...
})

// or

Fingerprint2.getPromise(options).then(function (components) {
  // components is array of {key: 'foo', value: 'component value'}
    ...
})
```

Fingerprint2 ships with the murmur hash function that you may use to create a hash fingerprint:

```js
Fingerprint2.get(options, function (components) {
    var values = components.map(function (component) { return component.value })
    var murmur = Fingerprint2.x64hash128(values.join(''), 31)
})
```


### Excludes

Before exclusion was done by putting an individual excludes like `excludeTouchSupport: true` in the options.

To exclude a component now, put its key inside the excludes object in options
```js
var options = {excludes: {touchSupport: true}}
```

### Custom Entropy Function

`options.customEntropyFunction` and `customKey` have been replaced with a extension friendly, stable alternative. The new contract allows for async sources as well. See below for component definition. `options.extraComponents` should contain an array with custom components.


```js
var options = {
    extraComponents : [
        {key: 'customKey', getData: function (done, options) {
            done('infos ...')
        }
    ]
}
```

### jsfonts and flashFonts

jsfonts has been renamed into fonts. fontsFlash and fonts are now separate components. `fontsFlash` is excluded by default.

### Consistent names for components

Components keys are now all camelCase. Example `'userAgent'` -> `'userAgent'`

### `Fingerprint2.x64hash128`

Fingerprint2.x64hash128 static function is now exposed

### Error constants are exposed and configurable

```js
Fingerprint2.NOT_AVAILABLE = 'not available'
Fingerprint2.ERROR = 'error'
Fingerprint2.EXCLUDED = 'excluded'
```

### audioTimeout

audioTimeout is an option, default 1000ms

## Development

### Component

A components is an object with at least key and getData keys, example:
```js
{key: 'userAgent', getData: UserAgent, pauseBefore: false}
```
getData value is the components function.

### Component function

A components function takes done as first argument, and options as an optional second argument.
It must call done exactly once with a value that can be cast to a String.
It must wrap all unreachable code (setTimeout, requestAnimationFrame, etc) in its own try catch,
it should use catch as an opportunity to give a unique value to `done`

```js
function (done, options) {
  done(navigator.userAgent)
}
```

### Tests

Unit tests are in `specs/specs.js`

To run tests in various browser configurations:

`yarn test:chrome` to launch the tests in Google Chrome (headless mode), it requires a Google Chrome.
`yarn test:chrome:incognito` to launch the tests in Google Chrome (headed, incognito mode), it requires a Google Chrome.
`yarn test:firefox` to launch the tests in FireFox (headless mode), it requires a Firefox.
`yarn test:firefox:incognito`
`yarn test:safari`

To run all configurations (requires Chrome, Firefox and Safari/IE installed), run:

- `yarn test:all:windows` on Windows
- `yarn test:all:mac` on macOS

To run the tests in the browser manually, open the `spec_runner.html` page in your browser.


## Other

### Future development

Many more fingerprinting sources will be implemented, such as (in no particular order)

* Multi-monitor detection,
* Internal HashTable implementation detection
* WebRTC fingerprinting
* Math constants
* Accessibility fingerprinting
* Camera information
* DRM support
* Accelerometer support
* Virtual keyboards
* List of supported gestures (for touch-enabled devices)
* Pixel density
* Video and audio codecs availability

### To recompile the `FontList.swf` file:

* Download [Adobe Flex SDK](http://www.adobe.com/devnet/flex/flex-sdk-download.html)
* Unzip it, add the `bin/` directory to your `$PATH`  (mxmlc binary should be in path)
* Run `make`

### Talk about the library (in Russian) on FrontEnd Conf 2015

https://player.vimeo.com/video/151208427

#### License: MIT or Apache, whichever you prefer

[npm-link]: https://www.npmjs.com/package/@fingerprintjs/fingerprintjs

## Contributors

[<img alt="Valve" src="https://avatars1.githubusercontent.com/u/27387?v=4&s=117" width="117">](https://github.com/Valve)[<img alt="jonashaag" src="https://avatars1.githubusercontent.com/u/175722?v=4&s=117" width="117">](https://github.com/jonashaag)[<img alt="antoinevastel" src="https://avatars1.githubusercontent.com/u/5827148?v=4&s=117" width="117">](https://github.com/antoinevastel)[<img alt="S-anasol" src="https://avatars2.githubusercontent.com/u/1709666?v=4&s=117" width="117">](https://github.com/S-anasol)[<img alt="unDemian" src="https://avatars1.githubusercontent.com/u/2129455?v=4&s=117" width="117">](https://github.com/unDemian)

[<img alt="nuschk" src="https://avatars1.githubusercontent.com/u/5167117?v=4&s=117" width="117">](https://github.com/nuschk)[<img alt="hiuny" src="https://avatars2.githubusercontent.com/u/2697067?v=4&s=117" width="117">](https://github.com/hiuny)[<img alt="wkdtjsgur100" src="https://avatars2.githubusercontent.com/u/17163958?v=4&s=117" width="117">](https://github.com/wkdtjsgur100)[<img alt="msp" src="https://avatars1.githubusercontent.com/u/15280?v=4&s=117" width="117">](https://github.com/msp)[<img alt="ProcrastinatorCp" src="https://avatars3.githubusercontent.com/u/29228904?v=4&s=117" width="117">](https://github.com/ProcrastinatorCp)

## Open-Source

This software contains code from open-source projects:

* MurmurHash3 by Karan Lyons (https://github.com/karanlyons/murmurHash3.js)

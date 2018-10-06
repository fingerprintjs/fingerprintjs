# Fingerprintjs2

[![](https://travis-ci.org/Valve/fingerprintjs2.svg?branch=master)](https://travis-ci.org/Valve/fingerprintjs2)
[![](https://badges.gitter.im/Valve/fingerprintjs2.svg)](https://gitter.im/Valve/fingerprintjs2)
[![npm](https://img.shields.io/npm/dm/fingerprintjs2.svg)][npm-link]

<a href="https://www.patreon.com/bePatron?u=7954991" data-patreon-widget-type="become-patron-button">Support library on Patreon!</a>

--------------------------

Original fingerprintjs library was developed in 2012, it's now impossible to evolve it
without breaking backwards compatibilty, so this project will be where
all the new development happens.

This project will use significantly more sources for fingerprinting, all
of them will be configurable, that is it should be possible to
cherry-pick only the options you need or just enable them all.

I'm also paying special attention to IE plugins, popular in China, such
as QQ, Baidu and others.

This project will not be backwards compatible with original
fingerprintjs.

This project uses `semver`.

## Installation

- CDN: `//cdn.jsdelivr.net/npm/fingerprintjs2@<VERSION>/dist/fingerprint2.min.js` or `https://cdnjs.com/libraries/fingerprintjs2`
- Bower: `bower install fingerprintjs2`
- NPM: `npm install fingerprintjs2`
- Yarn: `yarn add fingerprintjs2`


## Usage

```js
if (window.requestIdleCallback) {
    requestIdleCallback(function () {
        Fingerprint2.get(function(components) {
          console.log(components) // an array of FP components
        })  
    })
} else {
    setTimeout(function () {
        Fingerprint2.get(function(components) {

        })  
    }, 500)
}
```

**Note:** You should not run fingerprinting directly on or after page load. Rather, delay it for a few milliseconds with [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) or [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) to ensure consistent fingerprints. See [#307](https://github.com/Valve/fingerprintjs2/issues/307), [#254](https://github.com/Valve/fingerprintjs2/issues/254), and others.

See wiki https://github.com/Valve/fingerprintjs2/wiki/

## Options

You choose which components to include in the fingerprint, and configure some other stuff.

```js
var options = {extendedJsFonts: true}
```

### `extendedJsFonts`

By default, JS font detection will only detect up to 65 installed fonts. If you want to improve the font detection, you can pass `extendedJsFonts: true` option. This will increase the number of detectable fonts to ~500.

On my machine (MBP 2013 Core i5) + Chrome 46 the default FP process takes about 80-100ms. If you use `extendedJsFonts` option this time will increase up to 2000ms (cold font cache). This option can incur even more overhead on mobile Firefox browsers, which is much slower in font detection, so use it with caution on mobile devices.

To speed up fingerprint computation, you can exclude font detection (~ 40ms), canvas fingerprint (~ 10ms),  WebGL fingerprint (~ 35 ms), and Audio fingerprint (~30 ms).

### `userDefinedFonts`
Specifies an array of user-defined fonts to increase font fingerprint entropy even more.

While hundreds of the most popular fonts are included in the extended font list, you may wish to increase the entropy of the font fingerprint by specifying the `userDefinedFonts` option as an array of font names, **but make sure to call the Fingerprint function after the page load, and not before**, otherwise font detection might not work properly and in a result returned hash might be different every time you reloaded the page.

```js
Fingerprint2.get({
  userDefinedFonts: ["Nimbus Mono", "Junicode", "Presto"]
}, function(components) {

})
```

### `detectScreenOrientation` (default: true)

### `sortPluginsFor` (default: `[/palemoon/i]`)

Some browsers randomise plugin order. You can give a list of user agent regexes for which plugins should be sorted.

### `preprocessor`

Function that is called with each component value that may be used to modify component values before computing the fingerprint. For example: strip browser version from user agent.

```js
Fingerprint2.get({
  preprocessor: function(key, value) {
    if (key == "user_agent") {
      var parser = new UAParser(value); // https://github.com/faisalman/ua-parser-js
      var userAgentMinusVersion = parser.getOS().name + ' ' + parser.getBrowser().name
      return userAgentMinusVersion
    }
    return value
  }
},function(components) {
  // user_agent component will contain string processed with our function. For example: Windows Chrome
});
```

### `swfContainerId`
Specifies the dom element ID to be used for swf embedding (flash fonts)

### `swfPath`
Specifies the path to the FontList.swf (flash fonts)

### `excludeAudioIOS11` (default: true)

iOS 11 prevents audio fingerprinting unless started from a user interaction (screen tap), preventing the fingerprinting process from finishing. If you're sure you start fingerprinting from a user interaction event handler, you may enable audio fingerprinting on iOS 11.

### `excludeIEPlugins`
Skip IE plugin enumeration/detection

### `audioTimeout` default 1000
maximum time allowed for 'audio' component

### extraComponents
Arrays of extra components to include.

### excludes

An array of components (strings) to exclude. Empty array to include everything.

```
var options = {
    excludes: ['userAgent', 'language']
}
```

Below each possible exclude

#### `userAgent`
User agent should not take part in FP calculation (https://developer.mozilla.org/en-US/docs/Web/API/NavigatorID/userAgent)

#### `language`
Exclude browser language (https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/language)

#### `colorDepth`

Exclude color depth (https://developer.mozilla.org/en-US/docs/Web/API/Screen/colorDepth)

#### `deviceMemory`
Skip device memory detection

#### `pixelRatio` (default: true)

Device pixel ratio may change with browser zoom levels, and it's impossible to recognize browser zoom levels, that's why it's disabled by default.

#### `hardwareConcurrency`
Skip hardware concurrency

#### `screenResolution`
Exclude screen resolution

#### `availableScreenResolution`
Exclude available screen resolution

#### `timezoneOffset`
Exclude user time zone offset

#### `timezone`
Exclude user time zone

#### `sessionStorage`
Exclude user browser support of session storage

#### `localStorage`
Exclude user browser support of local storage

#### `indexedDb`
Exclude user browser support of IndexedDB

#### `addBehavior`
Exclude IE specific 'AddBehavior' method detection

#### `openDatabase`
Exclude user browser support of OpenDatabase

#### `cpuClass`
Exclude detection of CPU class

#### `platform`
Exclude detection of OS platform

#### `doNotTrack` (default: true)

DNT may be different in incognito from non-incognito mode, and we can't detect incognito mode. This is way it's disabled by default.

#### `plugins`
Skip all plugin enumeration/detection

#### `canvas`
Skip canvas fingerprinting entirely (you will most likely not need to set this to true)

#### `webgl`
Skip WebGL fingerprinting

#### `webglVendorAndRenderer`
Skip detection of the graphic driver via WebGL API

#### `adBlock`
Skip AdBlock detection

#### `hasLiedLanguages`
Skip check if user is trying to hide his browser language

#### `hasLiedResolution`
Skip check if user is trying to hide his screen resolution

#### `hasLiedOs`
Skip check if user is trying to hide his OS info

#### `hasLiedBrowser`
Skip check if user is trying to hide his browser information

#### `touchSupport`
Skip touch screen specific info fingerprinting

#### `fonts`

#### `fontsFlash` excluded by default

Flash font enumeration is disabled by default. JS code is used by default to get the list of available fonts.

The reason for this  is that Flash will not work in incognito mode.
However, you can make the library to use Flash when detecting the fonts by not including 'fontsFlash' in the excludes array

To use Flash font enumeration, make sure you have swfobject available. If you don't, the library will skip the Flash part entirely.


#### `audio`
Skip audio fingerprinting

#### `enumerateDevices`
Skip `MediaDevices.enumerateDevices` based device list




By default, almost all components are included in the fingerprint.


On my machine (MBP 2013 Core i5) + Chrome 46 the default FP process takes about 80-100ms. If you use `extendedJsFonts` option this time will increase up to 2000ms (cold font cache).
This option can incur even more overhead on mobile Firefox browsers, which is much slower in font detection, so use it with caution on mobile devices.

To speed up fingerprint computation, you can exclude font detection (~ 40ms), canvas fingerprint (~ 10ms),  WebGL fingerprint (~ 35 ms), and Audio fingerprint (~30 ms).

## Upgrade guide from 1.8.2 to 2.0.0

*The old usage still works but a deprecation warning is shown*

### get and getPromise

`Fingerprint2.get` is now a static function. It replaces `new Fingerprint2().get`. It will not hash the result by default anymore.

```
var options = {}
Fingerprint2.get(options, function (components) {
    ...
})

// or

Fingerprint2.getPromise(options).then(function (components) {
    ...
})
```

To still hash the result have a look at the following example:

```
Fingerprint2.get(options, function (components) {
    var values = Object.values(components)
    var murmur = Fingerprint2.x64hash128(values.join(''), 31)
    var results = murmur;
})
```


### Excludes

Before exclusion was done by putting an individual excludes like `excludeTouchSupport: true` in the options.

To exclude a component now, put its key inside the excludes array in options
```
var options = {excludes: ['touchSupport']}
```

### Custom Entropy Function

`options.customEntropyFunction` and `customKey` have been replaced with a extension friendly, stable alternative. The new contract allows for async sources as well. See below for component definition. `options.extraComponents` should contain an array with custom components.


```
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

Components keys are now all camelCase. Example 'user_agent' -> 'userAgent'


### `Fingerprint2.x64hash128`

Fingerprint2.x64hash128 static function is now exposed

### Error constants are exposed and configurable

```
Fingerprint2.NOT_AVAILABLE = 'not available'
Fingerprint2.ERROR = 'error'
Fingerprint2.EXCLUDED = 'excluded'
```

### audioTimeout

audioTimeout is an option, default 1000ms

## Development

### Component

A components is an object with at least key and getData keys, example:
```
{key: 'user_agent', getData: UserAgent, pauseBefore: false}
```
getData value is the components function.

### Component function

A components function takes done as first argument, and options as an optional second argument.
It must call done exactly once with a value that can be cast to a String.
It must wrap all unreachable code (setTimeout, requestAnimationFrame, etc) in its own try catch,
it should use catch as an opportunity to give a unique value to `done`

```
function (done, options) {
  done(navigator.userAgent)
}
```

### Tests

Unit tests are in `specs/specs.js`

`npm test` to launch the tests, it requires phanomjs install

To run the tests in the browser, launch spec_runner.html


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

#### License: MIT or Apache, whichever you prefer.
[npm-link]: https://www.npmjs.com/package/fingerprintjs2

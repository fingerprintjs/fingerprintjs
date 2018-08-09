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
new Fingerprint2().get(function(result, components) {
  console.log(result) // a hash, representing your device fingerprint
  console.log(components) // an array of FP components
})
```

**Note:** You should not run fingerprinting directly on or after page load. Rather, delay it for a few milliseconds to ensure consistent fingerprints. See [#307](https://github.com/Valve/fingerprintjs2/issues/307), [#254](https://github.com/Valve/fingerprintjs2/issues/254), and others.

## Options

You choose which components to include in the fingerprint, and configure some other stuff.

```js
new Fingerprint2({swfPath: '/assets/FontList.swf', excludeUserAgent: true})
```

By default, almost all components are included in the fingerprint, except for the following:

- DNT header
- Device pixel ratio
- Audio fingerprint on iOS 11

See wiki for a full list of available options and details as to why some are excluded by default: https://github.com/Valve/fingerprintjs2/wiki/List-of-options

On my machine (MBP 2013 Core i5) + Chrome 46 the default FP process takes about 80-100ms. If you use `extendedJsFonts` option this time will increase up to 2000ms (cold font cache).
This option can incur even more overhead on mobile Firefox browsers, which is much slower in font detection, so use it with caution on mobile devices.

To speed up fingerprint computation, you can exclude font detection (~ 40ms), canvas fingerprint (~ 10ms),  WebGL fingerprint (~ 35 ms), and Audio fingerprint (~30 ms).

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

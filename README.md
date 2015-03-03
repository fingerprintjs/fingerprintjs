<p align="center">
  <h1>Fingerprintjs2</h1>
  <br/>

  <a href="https://gitter.im/Valve/fingerprintjs2"><img src="https://badges.gitter.im/Valve/fingerprintjs2.png"/></a>
</p>


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


### WIP

### Usage

```javascript

new Fingerprint2().get(function(result){
  console.log(result);
});
```

#### You can pass an object with options (all of which are optional):

```javascript
new Fingerprint2({swfPath: '/assets/FontList.swf', excludeUserAgent: true}).get(function(result){
  console.log(result);
});
```

Full list of options will be in the wiki. (wip)

To use flash font enumeration, make sure you have swfobject available.
If you don't, the library will skip the flash part entirely.


### List of fingerprinting sources

1. UserAgent
2. Language
3. Color Depth
4. Screen Resolution
5. Timezone
6. Has session storage or not
7. Has local storage or not
8. Has indexed DB
9. Has IE specific 'AddBehavior'
10. Has open DB
11. CPU class
12. Platform
13. DoNotTrack or not
14. Full list of installed fonts (maintaining their order, which increases the entropy), implemented with Flash.
15. Browser plugins (NOTE: IE plugins are currently not detected)


### Many more fingerprinting sources will be implemented, such as

Canvas fingerprinting, Font css detection using side-channel technique, multi-monitor detection, silverlight integration, flash linux kernel version,
numerous ActiveX controls and plugins, and many more.


#### To recompile the FontList.swf file:

* Download Adobe Flex SDK from:  http://www.adobe.com/devnet/flex/flex-sdk-download.html
* Unzip it, add the bin/ directory to your $PATH  (mxmlc binary should be in path)
* Run "make"

#### License: MIT or Apache, whichever you prefer.

Fingerprintjs2
===============

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

#### To recompile the FontList.swf file:

* Download Adobe Flex SDK from:  http://www.adobe.com/devnet/flex/flex-sdk-download.html
* Unzip it, add the bin/ directory to your $PATH  (mxmlc binary should be in path)
* Run "make"

#### License: MIT or Apache, whichever you prefer.

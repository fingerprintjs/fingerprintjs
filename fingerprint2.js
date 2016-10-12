/*
 * Fingerprintjs2 2.0.0-dev - Modern & flexible browser fingerprint library v2
 * https://github.com/Valve/fingerprintjs2
 * Copyright (c) 2016 Valentin Vasilyev (valentin.vasilyev@outlook.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL VALENTIN VASILYEV BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";
/**
 *
 * @define {boolean}
 */
var DEBUG_MODE = false;
/**
 *
 * @define {boolean}
 */
var EXPORT_MODE = true;
/**
 *
 * @define {boolean}
 */
var VERBOSE_MODE = true;

/**
 * @private
 * @static
 *
 * Given a string and an optional seed as an int, returns a 128 bit
 * hash using the x64 flavor of MurmurHash3, as an unsigned hex.
 *
 * @param {string} [key]
 * @param {number} [seed]
 * @returns {string}
 */
var murmur3x64hash128 = function (key, seed) {
  /**
   * @static
   * @private
   *
   * Given two 64bit ints (as an array of two 32bit ints) returns the two
   * added together as a 64bit int (as an array of two 32bit ints).
   *
   * @param {!Array<number>} m
   * @param {!Array<number>} n
   *
   * @returns {!Array<number>}
   */
  var murmur3x64Add = function (m, n) {
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] + n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] + n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] + n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += m[0] + n[0];
    o[0] &= 0xffff;
    return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
  };
  /**
   * @static
   * @private
   *
   * Given two 64bit ints (as an array of two 32bit ints) returns the two
   * multiplied together as a 64bit int (as an array of two 32bit ints).
   *
   * @param {!Array<number>} m
   * @param {!Array<number>} n
   *
   * @returns {!Array<number>}
   */
  var murmur3x64Multiply = function (m, n) {
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] * n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] * n[3];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[2] += m[3] * n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] * n[3];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[2] * n[2];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[3] * n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0]);
    o[0] &= 0xffff;
    return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
  };
  /**
   * @static
   * @private
   *
   * Given a 64bit int (as an array of two 32bit ints) and an int
   * representing a number of bit positions, returns the 64bit int (as an
   * array of two 32bit ints) rotated left by that number of positions.
   *
   * @param {!Array<number>} m
   * @param {number} n
   *
   * @returns {!Array<number>}
   */
  var murmur3x64Rotl = function (m, n) {
    n %= 64;
    if (n === 32) {
      return [m[1], m[0]];
    }
    else if (n < 32) {
      return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))];
    }
    else {
      n -= 32;
      return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))];
    }
  };
  /**
   * @static
   * @private
   *
   * Given a 64bit int (as an array of two 32bit ints) and an int
   * representing a number of bit positions, returns the 64bit int (as an
   * array of two 32bit ints) shifted left by that number of positions.
   *
   * @param {!Array<number>} m
   * @param {number} n
   *
   * @returns {!Array<number>}
   */
  var murmur3x64LeftShift = function (m, n) {
    n %= 64;
    if (n === 0) {
      return m;
    }
    else if (n < 32) {
      return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
    }
    else {
      return [m[1] << (n - 32), 0];
    }
  };
  /**
   * @static
   * @private
   *
   * Given two 64bit ints (as an array of two 32bit ints) returns the two
   * xored together as a 64bit int (as an array of two 32bit ints).
   *
   * @param {!Array<number>} m
   * @param {!Array<number>} n
   *
   * @returns {!Array<number>}
   */
  var murmur3x64Xor = function (m, n) {
    return [m[0] ^ n[0], m[1] ^ n[1]];
  };
  /**
   * @static
   * @private
   *
   * Given a block, returns murmurHash3's final x64 mix of that block.
   * (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
   * only place where we need to right shift 64bit ints.)
   *
   * @param {!Array<number>} h
   *
   * @returns {!Array<number>}
   */
  var murmur3x64Fmix = function (h) {
    h = murmur3x64Xor(h, [0, h[0] >>> 1]);
    h = murmur3x64Multiply(h, [0xff51afd7, 0xed558ccd]);
    h = murmur3x64Xor(h, [0, h[0] >>> 1]);
    h = murmur3x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
    h = murmur3x64Xor(h, [0, h[0] >>> 1]);
    return h;
  };

  key = key || "";
  seed = seed || 0;

  var remainder = key.length % 16;
  var bytes = key.length - remainder;
  var h1 = [0, seed];
  var h2 = [0, seed];
  var k1 = [0, 0];
  var k2 = [0, 0];
  var c1 = [0x87c37b91, 0x114253d5];
  var c2 = [0x4cf5ad43, 0x2745937f];

  for (var i = 0; i < bytes; i = i + 16) {
    k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)];
    k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)];
    k1 = murmur3x64Multiply(k1, c1);
    k1 = murmur3x64Rotl(k1, 31);
    k1 = murmur3x64Multiply(k1, c2);
    h1 = murmur3x64Xor(h1, k1);
    h1 = murmur3x64Rotl(h1, 27);
    h1 = murmur3x64Add(h1, h2);
    h1 = murmur3x64Add(murmur3x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
    k2 = murmur3x64Multiply(k2, c2);
    k2 = murmur3x64Rotl(k2, 33);
    k2 = murmur3x64Multiply(k2, c1);
    h2 = murmur3x64Xor(h2, k2);
    h2 = murmur3x64Rotl(h2, 31);
    h2 = murmur3x64Add(h2, h1);
    h2 = murmur3x64Add(murmur3x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
  }

  k1 = [0, 0];
  k2 = [0, 0];

  //@formatter:off
  var fallthrough = [
    function () { k1 = murmur3x64Xor(k1, [0, key.charCodeAt(i)]); k1 = murmur3x64Multiply(k1, c1); k1 = murmur3x64Rotl(k1, 31); k1 = murmur3x64Multiply(k1, c2); h1 = murmur3x64Xor(h1, k1);},
    function () { k1 = murmur3x64Xor(k1, murmur3x64LeftShift([0, key.charCodeAt(i + 1)], 8)); },
    function () { k1 = murmur3x64Xor(k1, murmur3x64LeftShift([0, key.charCodeAt(i + 2)], 16)); },
    function () { k1 = murmur3x64Xor(k1, murmur3x64LeftShift([0, key.charCodeAt(i + 3)], 24)); },
    function () { k1 = murmur3x64Xor(k1, murmur3x64LeftShift([0, key.charCodeAt(i + 4)], 32)); },
    function () { k1 = murmur3x64Xor(k1, murmur3x64LeftShift([0, key.charCodeAt(i + 5)], 40)); },
    function () { k1 = murmur3x64Xor(k1, murmur3x64LeftShift([0, key.charCodeAt(i + 6)], 48)); },
    function () { k1 = murmur3x64Xor(k1, murmur3x64LeftShift([0, key.charCodeAt(i + 7)], 56)); },
    function () { k2 = murmur3x64Xor(k2, [0, key.charCodeAt(i + 8)]); k2 = murmur3x64Multiply(k2, c2); k2 = murmur3x64Rotl(k2, 33); k2 = murmur3x64Multiply(k2, c1); h2 = murmur3x64Xor(h2, k2);},
    function () { k2 = murmur3x64Xor(k2, murmur3x64LeftShift([0, key.charCodeAt(i + 9)], 8)); },
    function () { k2 = murmur3x64Xor(k2, murmur3x64LeftShift([0, key.charCodeAt(i + 10)], 16)); },
    function () { k2 = murmur3x64Xor(k2, murmur3x64LeftShift([0, key.charCodeAt(i + 11)], 24)); },
    function () { k2 = murmur3x64Xor(k2, murmur3x64LeftShift([0, key.charCodeAt(i + 12)], 32)); },
    function () { k2 = murmur3x64Xor(k2, murmur3x64LeftShift([0, key.charCodeAt(i + 13)], 40)); },
    function () { k2 = murmur3x64Xor(k2, murmur3x64LeftShift([0, key.charCodeAt(i + 14)], 48)); }
  ];
  //@formatter:on

  while(remainder-- > 0){
    fallthrough[remainder]();
  }

  h1 = murmur3x64Xor(h1, [0, key.length]);
  h2 = murmur3x64Xor(h2, [0, key.length]);
  h1 = murmur3x64Add(h1, h2);
  h2 = murmur3x64Add(h2, h1);
  h1 = murmur3x64Fmix(h1);
  h2 = murmur3x64Fmix(h2);
  h1 = murmur3x64Add(h1, h2);
  h2 = murmur3x64Add(h2, h1);

  // join 4 * 32bit numbers to a single zero-filled 128bit hex string
  return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) +
    ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) +
    ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) +
    ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
};
/**
 * @private
 * @static
 *
 * @param {*} msg
 */
var log = function(msg){
  if(DEBUG_MODE){
    if(window.console){
      console.log(msg);
    }
  }
};

/**
 * @dict
 * @constructor
 */
var FP2Options = function(){
  /**
   *
   * @type {boolean}
   */
  this["detectScreenOrientation"] = true;
  /**
   *
   * @type {Array<RegExp>}
   */
  this["sortPluginsFor"] = [/palemoon/i];
  /**
   *
   * @type {Array<string>}
   */
  this["userDefinedFonts"] = [];
  /**
   *
   * @type {boolean}
   */
  this["extendedJsFonts"] = false;
  /**
   *
   * @type {boolean}
   */
  this["dontUseFakeFontInCanvas"] = false;
  /**
   *
   * @type {Object<string,boolean>}
   */
  this["exclude"] = {
    UserAgent: false,
    Language: false,
    ColorDepth: false,
    PixelRatio: false,
    ScreenResolution: false,
    AvailableScreenResolution: false,
    TimezoneOffset: false,
    SessionStorage: false,
    LocalStorage: false,
    IndexedDB: false,
    AddBehavior: false,
    OpenDatabase: false,
    CpuClass: false,
    Platform: false,
    DoNotTrack: false,
    Plugins: false,
    IEPlugins: false,
    Canvas: false,
    WebGL: false,
    AdBlock: false,
    HasLiedLanguages: false,
    HasLiedResolution: false,
    HasLiedOs: false,
    HasLiedBrowser: false,
    TouchSupport: false,
    JsFonts: false
  };
};

/**
 * @param {FP2Options} [options]
 * @constructor
 */
var Fingerprint2 = function(options) {
  this.options = options || new FP2Options();
  this.nativeForEach = Array.prototype.forEach;
  this.nativeMap = Array.prototype.map;
};

/**
 *
 * @param {FP2Options} [options]
 * @returns {Fingerprint2}
 */
Fingerprint2.create = function (options) {
  return new Fingerprint2(options);
};

/**
 * @private
 * @static
 *
 * @param {!Array} keys
 * @param {!string|!Array|!boolean|!number} value
 * @param {string} key
 */
var fillKeys = function (keys, key, value) {
  if (VERBOSE_MODE) {
    keys.push({key: key, value: value});
  } else {
    keys.push(value);
  }
};

var Extractors = {
  /**
   * @static
   *
   * @param {!Fingerprint2} fp
   * @returns {!Array}
   */
  getFonts: function (fp) {
    // kudos to http://www.lalit.org/lab/javascript-css-font-detect/

    // a font will be compared against all the three default fonts.
    // and if it doesn't match all 3 then that font is not available.
    var baseFonts = ["monospace", "sans-serif", "serif"];

    var fontList = [
      "Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS",
      "Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style",
      "Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans", "Comic Sans MS", "Consolas", "Courier", "Courier New",
      "Garamond", "Geneva", "Georgia",
      "Helvetica", "Helvetica Neue",
      "Impact",
      "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode",
      "Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO",
      "Palatino", "Palatino Linotype",
      "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol",
      "Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS",
      "Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"
    ];
    var extendedFontList = [
      "Abadi MT Condensed Light", "Academy Engraved LET", "ADOBE CASLON PRO", "Adobe Garamond", "ADOBE GARAMOND PRO", "Agency FB", "Aharoni", "Albertus Extra Bold", "Albertus Medium", "Algerian", "Amazone BT", "American Typewriter",
      "American Typewriter Condensed", "AmerType Md BT", "Andalus", "Angsana New", "AngsanaUPC", "Antique Olive", "Aparajita", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "Arabic Typesetting", "ARCHER",
      "ARNO PRO", "Arrus BT", "Aurora Cn BT", "AvantGarde Bk BT", "AvantGarde Md BT", "AVENIR", "Ayuthaya", "Bandy", "Bangla Sangam MN", "Bank Gothic", "BankGothic Md BT", "Baskerville",
      "Baskerville Old Face", "Batang", "BatangChe", "Bauer Bodoni", "Bauhaus 93", "Bazooka", "Bell MT", "Bembo", "Benguiat Bk BT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "BernhardFashion BT", "BernhardMod BT", "Big Caslon", "BinnerD",
      "Blackadder ITC", "BlairMdITC TT", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bodoni MT", "Bodoni MT Black", "Bodoni MT Condensed", "Bodoni MT Poster Compressed",
      "Bookshelf Symbol 7", "Boulder", "Bradley Hand", "Bradley Hand ITC", "Bremen Bd BT", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT", "Californian FB", "Calisto MT", "Calligrapher", "Candara",
      "CaslonOpnface BT", "Castellar", "Centaur", "Cezanne", "CG Omega", "CG Times", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charlesworth", "Charter Bd BT", "Charter BT", "Chaucer",
      "ChelthmITC Bk BT", "Chiller", "Clarendon", "Clarendon Condensed", "CloisterBlack BT", "Cochin", "Colonna MT", "Constantia", "Cooper Black", "Copperplate", "Copperplate Gothic", "Copperplate Gothic Bold",
      "Copperplate Gothic Light", "CopperplGoth Bd BT", "Corbel", "Cordia New", "CordiaUPC", "Cornerstone", "Coronet", "Cuckoo", "Curlz MT", "DaunPenh", "Dauphin", "David", "DB LCD Temp", "DELICIOUS", "Denmark",
      "DFKai-SB", "Didot", "DilleniaUPC", "DIN", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Elephant", "English 111 Vivace BT", "Engravers MT", "EngraversGothic BT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC",
      "EucrosiaUPC", "Euphemia", "Euphemia UCAS", "EUROSTILE", "Exotc350 Bd BT", "FangSong", "Felix Titling", "Fixedsys", "FONTIN", "Footlight MT Light", "Forte",
      "FrankRuehl", "Fransiscan", "Freefrm721 Blk BT", "FreesiaUPC", "Freestyle Script", "French Script MT", "FrnkGothITC Bk BT", "Fruitger", "FRUTIGER",
      "Futura", "Futura Bk BT", "Futura Lt BT", "Futura Md BT", "Futura ZBlk BT", "FuturaBlack BT", "Gabriola", "Galliard BT", "Gautami", "Geeza Pro", "Geometr231 BT", "Geometr231 Hv BT", "Geometr231 Lt BT", "GeoSlab 703 Lt BT",
      "GeoSlab 703 XBd BT", "Gigi", "Gill Sans", "Gill Sans MT", "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra Condensed", "GOTHAM", "GOTHAM BOLD",
      "Goudy Old Style", "Goudy Stout", "GoudyHandtooled BT", "GoudyOLSt BT", "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MN", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "Heather", "Heiti SC", "Heiti TC", "HELV",
      "Herald", "High Tower Text", "Hiragino Kaku Gothic ProN", "Hiragino Mincho ProN", "Hoefler Text", "Humanst 521 Cn BT", "Humanst521 BT", "Humanst521 Lt BT", "Imprint MT Shadow", "Incised901 Bd BT", "Incised901 BT",
      "Incised901 Lt BT", "INCONSOLATA", "Informal Roman", "Informal011 BT", "INTERSTATE", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jazz LET", "Jenson", "Jester", "Jokerman", "Juice ITC", "Kabel Bk BT", "Kabel Ult BT", "Kailasa", "KaiTi", "Kalinga", "Kannada Sangam MN",
      "Kartika", "Kaufmann Bd BT", "Kaufmann BT", "Khmer UI", "KodchiangUPC", "Kokila", "Korinna BT", "Kristen ITC", "Krungthep", "Kunstler Script", "Lao UI", "Latha", "Leelawadee", "Letter Gothic", "Levenim MT", "LilyUPC", "Lithograph", "Lithograph Light", "Long Island",
      "Lydian BT", "Magneto", "Maiandra GD", "Malayalam Sangam MN", "Malgun Gothic",
      "Mangal", "Marigold", "Marion", "Marker Felt", "Market", "Marlett", "Matisse ITC", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le",
      "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion", "Minion Pro", "Miriam", "Miriam Fixed", "Mistral", "Modern", "Modern No. 20", "Mona Lisa Solid ITC TT", "Mongolian Baiti",
      "MONO", "MoolBoran", "Mrs Eaves", "MS LineDraw", "MS Mincho", "MS PMincho", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MUSEO", "MV Boli",
      "Nadeem", "Narkisim", "NEVIS", "News Gothic", "News GothicMT", "NewsGoth BT", "Niagara Engraved", "Niagara Solid", "Noteworthy", "NSimSun", "Nyala", "OCR A Extended", "Old Century", "Old English Text MT", "Onyx", "Onyx BT", "OPTIMA", "Oriya Sangam MN",
      "OSAKA", "OzHandicraft BT", "Palace Script MT", "Papyrus", "Parchment", "Party LET", "Pegasus", "Perpetua", "Perpetua Titling MT", "PetitaBold", "Pickwick", "Plantagenet Cherokee", "Playbill", "PMingLiU", "PMingLiU-ExtB",
      "Poor Richard", "Poster", "PosterBodoni BT", "PRINCETOWN LET", "Pristina", "PTBarnum BT", "Pythagoras", "Raavi", "Rage Italic", "Ravie", "Ribbon131 Bd BT", "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold", "Rod", "Roman", "Sakkal Majalla",
      "Santa Fe LET", "Savoye LET", "Sceptre", "Script", "Script MT Bold", "SCRIPTINA", "Serifa", "Serifa BT", "Serifa Th BT", "ShelleyVolante BT", "Sherwood",
      "Shonar Bangla", "Showcard Gothic", "Shruti", "Signboard", "SILKSCREEN", "SimHei", "Simplified Arabic", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Sinhala Sangam MN", "Sketch Rockwell", "Skia", "Small Fonts", "Snap ITC", "Snell Roundhand", "Socket",
      "Souvenir Lt BT", "Staccato222 BT", "Steamer", "Stencil", "Storybook", "Styllo", "Subway", "Swis721 BlkEx BT", "Swiss911 XCm BT", "Sylfaen", "Synchro LET", "System", "Tamil Sangam MN", "Technical", "Teletype", "Telugu Sangam MN", "Tempus Sans ITC",
      "Terminal", "Thonburi", "Traditional Arabic", "Trajan", "TRAJAN PRO", "Tristan", "Tubular", "Tunga", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold",
      "TypoUpright BT", "Unicorn", "Univers", "Univers CE 55 Medium", "Univers Condensed", "Utsaah", "Vagabond", "Vani", "Vijaya", "Viner Hand ITC", "VisualUI", "Vivaldi", "Vladimir Script", "Vrinda", "Westminster", "WHITNEY", "Wide Latin",
      "ZapfEllipt BT", "ZapfHumnst BT", "ZapfHumnst Dm BT", "Zapfino", "Zurich BlkEx BT", "Zurich Ex BT", "ZWAdobeF"];

    if (fp.options["extendedJsFonts"]) {
      fontList = fontList.concat(extendedFontList);
    }

    fontList = fontList.concat(fp.options["userDefinedFonts"]);

    //we use m or w because these two characters take up the maximum width.
    // And we use a LLi so that the same matching fonts can get separated
    var testString = "mmmmmmmmmmlli";

    //we test using 72px font size, we may use any size. I guess larger the better.
    var testSize = "72px";

    var h = document.getElementsByTagName("body")[0];

    // div to load spans for the base fonts
    var baseFontsDiv = document.createElement("div");

    // div to load spans for the fonts to detect
    var fontsDiv = document.createElement("div");

    var defaultWidth = {};
    var defaultHeight = {};

    // creates a span where the fonts will be loaded
    var createSpan = function () {
      var s = document.createElement("span");
      /*
       * We need this css as in some weird browser this
       * span elements shows up for a microSec which creates a
       * bad user experience
       */
      s.style.position = "absolute";
      s.style.left = "-9999px";
      s.style.fontSize = testSize;
      s.style.lineHeight = "normal";
      s.innerHTML = testString;
      return s;
    };

    // creates a span and load the font to detect and a base font for fallback
    var createSpanWithFonts = function (fontToDetect, baseFont) {
      var s = createSpan();
      s.style.fontFamily = "'" + fontToDetect + "'," + baseFont;
      return s;
    };

    // creates spans for the base fonts and adds them to baseFontsDiv
    var initializeBaseFontsSpans = function () {
      var spans = [];
      for (var index = 0, length = baseFonts.length; index < length; index++) {
        var s = createSpan();
        s.style.fontFamily = baseFonts[index];
        baseFontsDiv.appendChild(s);
        spans.push(s);
      }
      return spans;
    };

    // creates spans for the fonts to detect and adds them to fontsDiv
    var initializeFontsSpans = function () {
      var spans = {};
      for(var i = 0, l = fontList.length; i < l; i++) {
        var fontSpans = [];
        for(var j = 0, numDefaultFonts = baseFonts.length; j < numDefaultFonts; j++) {
          var s = createSpanWithFonts(fontList[i], baseFonts[j]);
          fontsDiv.appendChild(s);
          fontSpans.push(s);
        }
        spans[fontList[i]] = fontSpans; // Stores {fontName : [spans for that font]}
      }
      return spans;
    };

    // checks if a font is available
    var isFontAvailable = function (fontSpans) {
      var detected = false;
      for(var i = 0; i < baseFonts.length; i++) {
        detected = (fontSpans[i].offsetWidth !== defaultWidth[baseFonts[i]] || fontSpans[i].offsetHeight !== defaultHeight[baseFonts[i]]);
        if(detected) {
          return detected;
        }
      }
      return detected;
    };

    // create spans for base fonts
    var baseFontsSpans = initializeBaseFontsSpans();

    // add the spans to the DOM
    h.appendChild(baseFontsDiv);

    // get the default width for the three base fonts
    for (var index = 0, length = baseFonts.length; index < length; index++) {
      defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth; // width for the default font
      defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight; // height for the default font
    }

    // create spans for fonts to detect
    var fontsSpans = initializeFontsSpans();

    // add all the spans to the DOM
    h.appendChild(fontsDiv);

    // check available fonts
    var available = [];
    for (var i = 0, l = fontList.length; i < l; i++) {
      if(isFontAvailable(fontsSpans[fontList[i]])) {
        available.push(fontList[i]);
      }
    }

    // remove spans from DOM
    h.removeChild(fontsDiv);
    h.removeChild(baseFontsDiv);
    return available;
  },
  /**
   * @static
   *
   * @param {!Fingerprint2} fp
   * @returns {!Array}
   */
  getRegularPlugins: function (fp) {
    var plugins = [];
    for(var i = 0, l = navigator.plugins.length; i < l; i++) {
      plugins.push(navigator.plugins[i]);
    }
    // sorting plugins only for those user agents, that we know randomize the plugins
    // every time we try to enumerate them
    if(Extractors.pluginsShouldBeSorted(fp)) {
      plugins = plugins.sort(function(a, b) {
        if(a.name > b.name){ return 1; }
        if(a.name < b.name){ return -1; }
        return 0;
      });
    }
    return fp.map(plugins, function (p) {
      var mimeTypes = fp.map(p, function(mt){
        return [mt["type"], mt["suffixes"]].join("~");
      }).join(",");
      return [p["name"], p["description"], mimeTypes].join("::");
    });
  },
  /**
   * @static
   *
   * @param {!Fingerprint2} fp
   * @returns {!Array}
   */
  getIEPlugins: function (fp) {
    var result = [];
    if((Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, "ActiveXObject")) || ("ActiveXObject" in window)) {
      var names = [
        "AcroPDF.PDF", // Adobe PDF reader 7+
        "Adodb.Stream",
        "AgControl.AgControl", // Silverlight
        "DevalVRXCtrl.DevalVRXCtrl.1",
        "MacromediaFlashPaper.MacromediaFlashPaper",
        "Msxml2.DOMDocument",
        "Msxml2.XMLHTTP",
        "PDF.PdfCtrl", // Adobe PDF reader 6 and earlier, brrr
        "QuickTime.QuickTime", // QuickTime
        "QuickTimeCheckObject.QuickTimeCheck.1",
        "RealPlayer",
        "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)",
        "RealVideo.RealVideo(tm) ActiveX Control (32-bit)",
        "Scripting.Dictionary",
        "SWCtl.SWCtl", // ShockWave player
        "Shell.UIHelper",
        "ShockwaveFlash.ShockwaveFlash", //flash plugin
        "Skype.Detection",
        "TDCCtl.TDCCtl",
        "WMPlayer.OCX", // Windows media player
        "rmocx.RealPlayer G2 Control",
        "rmocx.RealPlayer G2 Control.1"
      ];
      // starting to detect plugins in IE
      result = fp.map(names, function(name) {
        try {
          new ActiveXObject(name);
          return name;
        } catch(e) {
          return null;
        }
      });
    }
    if(navigator.plugins) {
      result = result.concat(Extractors.getRegularPlugins(fp));
    }
    return result;
  },
  /**
   * @static
   * @param {!Fingerprint2} fp
   * @returns {boolean}
   */
  pluginsShouldBeSorted: function (fp) {
    var should = false;
    var sortPluginForOption = fp.options["sortPluginsFor"];
    for(var i = 0, l = sortPluginForOption.length; i < l; i++) {
      var re = sortPluginForOption[i];
      if(navigator.userAgent.match(re)) {
        should = true;
        break;
      }
    }
    return should;
  },
  /**
   * @static
   *
   * @returns {boolean}
   */
  hasSessionStorage: function () {
    try {
      return !!window.sessionStorage;
    } catch(e) {
      return true; // SecurityError when referencing it means it exists
    }
  },
  /**
   * @static
   *
   * @returns {boolean}
   */
  hasLocalStorage: function () {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
    try {
      return !!window.localStorage;
    } catch(e) {
      return true; // SecurityError when referencing it means it exists
    }
  },
  /**
   * @static
   *
   * @returns {!Array}
   */
  getTouchSupport: function () {
    // This is a crude and primitive touch screen detection.
    // It's not possible to currently reliably detect the  availability of a touch screen
    // with a JS, without actually subscribing to a touch event.
    // http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
    // https://github.com/Modernizr/Modernizr/issues/548
    // method returns an array of 3 values:
    // maxTouchPoints, the success or failure of creating a TouchEvent,
    // and the availability of the 'ontouchstart' property
    var maxTouchPoints = 0;
    var touchEvent = false;
    if(typeof navigator["maxTouchPoints"] !== "undefined") {
      maxTouchPoints = navigator["maxTouchPoints"];
    } else if (typeof navigator["msMaxTouchPoints"] !== "undefined") {
      maxTouchPoints = navigator["msMaxTouchPoints"];
    }
    try {
      document.createEvent("TouchEvent");
      touchEvent = true;
    } catch(_) { /* squelch */ }
    var touchStart = "ontouchstart" in window;
    return [maxTouchPoints, touchEvent, touchStart];
  },
  /**
   * @static
   *
   * @param {!Fingerprint2} fp
   * @returns {string}
   */
  getCanvasFp: function(fp) {
    // https://www.browserleaks.com/canvas#how-does-it-work
    var result = [];
    // Very simple now, need to make it more complex (geo shapes etc)
    var canvas = document.createElement("canvas");
    canvas.width = 2000;
    canvas.height = 200;
    canvas.style.display = "inline";
    var ctx = canvas.getContext("2d");
    // detect browser support of canvas winding
    // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
    ctx.rect(0, 0, 10, 10);
    ctx.rect(2, 2, 6, 6);
    result.push("canvas winding:" + ((ctx.isPointInPath(5, 5, "evenodd") === false) ? "yes" : "no"));

    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    // https://github.com/Valve/fingerprintjs2/issues/66
    if(fp.options["dontUseFakeFontInCanvas"]) {
      ctx.font = "11pt Arial";
    } else {
      ctx.font = "11pt no-real-font-123";
    }
    ctx.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.2)";
    ctx.font = "18pt Arial";
    ctx.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 4, 45);

    // canvas blending
    // http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
    // http://jsfiddle.net/NDYV8/16/
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "rgb(255,0,255)";
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgb(0,255,255)";
    ctx.beginPath();
    ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgb(255,255,0)";
    ctx.beginPath();
    ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgb(255,0,255)";
    // canvas winding
    // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // http://jsfiddle.net/NDYV8/19/
    ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
    ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
    ctx.fill("evenodd");

    result.push("canvas fp:" + canvas.toDataURL());
    return result.join("~");
  },
  /**
   * @static
   *
   * @returns {string}
   */
  getWebglFp: function() {
    /**
     * @type {WebGLRenderingContext}
     */
    var gl;
    /**
     *
     * @returns {string}
     */
    var fa2s = function(fa) {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(WebGLRenderingContext.DEPTH_TEST);
      gl.depthFunc(WebGLRenderingContext.LEQUAL);
      gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT);
      return "[" + fa[0] + ", " + fa[1] + "]";
    };
    /**
     *
     * @param {WebGLRenderingContext} gl
     * @returns {*}
     */
    var maxAnisotropy = function(gl) {
      var ext = gl.getExtension("EXT_texture_filter_anisotropic") ||
        gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
        gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
      if (ext) {
        var anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        return (0 === anisotropy ? 2 : anisotropy);
      } else {
        return null;
      }
    };

    gl = Extractors.getWebglCanvas();
    if(!gl) { return ""; }
    // WebGL fingerprinting is a combination of techniques, found in MaxMind antifraud script & Augur fingerprinting.
    // First it draws a gradient object with shaders and convers the image to the Base64 string.
    // Then it enumerates all WebGL extensions & capabilities and appends them to the Base64 string, resulting in a huge WebGL string, potentially very unique on each device
    // Since iOS supports webgl starting from version 8.1 and 8.1 runs on several graphics chips, the results may be different across ios devices, but we need to verify it.
    var result = [];
    var vShaderTemplate = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
    var fShaderTemplate = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
    var vertexPosBuffer = gl.createBuffer();
    gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, vertexPosBuffer);
    var vertices = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .732134444, 0]);
    gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, vertices, WebGLRenderingContext.STATIC_DRAW);
    vertexPosBuffer.itemSize = 3;
    vertexPosBuffer.numItems = 3;
    var program = gl.createProgram(), vshader = gl.createShader(WebGLRenderingContext.VERTEX_SHADER);
    gl.shaderSource(vshader, vShaderTemplate);
    gl.compileShader(vshader);
    var fshader = gl.createShader(WebGLRenderingContext.FRAGMENT_SHADER);
    gl.shaderSource(fshader, fShaderTemplate);
    gl.compileShader(fshader);
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    gl.useProgram(program);
    program.vertexPosAttrib = gl.getAttribLocation(program, "attrVertex");
    program.offsetUniform = gl.getUniformLocation(program, "uniformOffset");
    gl.enableVertexAttribArray(program["vertexPosArray"]);
    gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, WebGLRenderingContext.FLOAT, !1, 0, 0);
    gl.uniform2f(program.offsetUniform, 1, 1);
    gl.drawArrays(WebGLRenderingContext.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);
    if (gl.canvas != null) { result.push(gl.canvas.toDataURL()); }
    /**
     *
     * @param {string} description
     * @param {*} value
     */
    var fillResult = function (description, value) {
      if(VERBOSE_MODE){
        result.push(description + value);
      }else{
        result.push(value);
      }
    };

    fillResult("extensions:", gl.getSupportedExtensions().join(";"));
    fillResult("webgl aliased line width range:", fa2s(gl.getParameter(WebGLRenderingContext.ALIASED_LINE_WIDTH_RANGE)));
    fillResult("webgl aliased point size range:", fa2s(gl.getParameter(WebGLRenderingContext.ALIASED_POINT_SIZE_RANGE)));
    fillResult("webgl alpha bits:", gl.getParameter(WebGLRenderingContext.ALPHA_BITS));
    fillResult("webgl antialiasing:", (gl.getContextAttributes().antialias ? "yes" : "no"));
    fillResult("webgl blue bits:", gl.getParameter(WebGLRenderingContext.BLUE_BITS));
    fillResult("webgl depth bits:", gl.getParameter(WebGLRenderingContext.DEPTH_BITS));
    fillResult("webgl green bits:", gl.getParameter(WebGLRenderingContext.GREEN_BITS));
    fillResult("webgl max anisotropy:", maxAnisotropy(gl));
    fillResult("webgl max combined texture image units:", gl.getParameter(WebGLRenderingContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
    fillResult("webgl max cube map texture size:", gl.getParameter(WebGLRenderingContext.MAX_CUBE_MAP_TEXTURE_SIZE));
    fillResult("webgl max fragment uniform vectors:", gl.getParameter(WebGLRenderingContext.MAX_FRAGMENT_UNIFORM_VECTORS));
    fillResult("webgl max render buffer size:", gl.getParameter(WebGLRenderingContext.MAX_RENDERBUFFER_SIZE));
    fillResult("webgl max texture image units:", gl.getParameter(WebGLRenderingContext.MAX_TEXTURE_IMAGE_UNITS));
    fillResult("webgl max texture size:", gl.getParameter(WebGLRenderingContext.MAX_TEXTURE_SIZE));
    fillResult("webgl max varying vectors:", gl.getParameter(WebGLRenderingContext.MAX_VARYING_VECTORS));
    fillResult("webgl max vertex attribs:", gl.getParameter(WebGLRenderingContext.MAX_VERTEX_ATTRIBS));
    fillResult("webgl max vertex texture image units:", gl.getParameter(WebGLRenderingContext.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
    fillResult("webgl max vertex uniform vectors:", gl.getParameter(WebGLRenderingContext.MAX_VERTEX_UNIFORM_VECTORS));
    fillResult("webgl max viewport dims:", fa2s(gl.getParameter(WebGLRenderingContext.MAX_VIEWPORT_DIMS)));
    fillResult("webgl red bits:", gl.getParameter(WebGLRenderingContext.RED_BITS));
    fillResult("webgl renderer:", gl.getParameter(WebGLRenderingContext.RENDERER));
    fillResult("webgl shading language version:", gl.getParameter(WebGLRenderingContext.SHADING_LANGUAGE_VERSION));
    fillResult("webgl stencil bits:", gl.getParameter(WebGLRenderingContext.STENCIL_BITS));
    fillResult("webgl vendor:", gl.getParameter(WebGLRenderingContext.VENDOR));
    fillResult("webgl version:", gl.getParameter(WebGLRenderingContext.VERSION));

    /**
     * @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLShaderPrecisionFormat
     * @typedef {{rangeMin:number, rangeMax:number, precision:number}} WebGLShaderPrecisionFormat
     */
    /**
     * @link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderPrecisionFormat
     * @typedef {function(number,number):?WebGLShaderPrecisionFormat} WebGLRenderingContext.getShaderPrecisionFormat
     */
    if (!gl.getShaderPrecisionFormat) {
      log("WebGL fingerprinting is incomplete, because your browser does not support getShaderPrecisionFormat");
    }else{
      fillResult("webgl vertex shader high float precision:", gl.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.HIGH_FLOAT).precision);
      fillResult("webgl vertex shader high float precision rangeMin:", gl.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.HIGH_FLOAT).rangeMin);
      fillResult("webgl vertex shader high float precision rangeMax:", gl.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.HIGH_FLOAT).rangeMax);
      fillResult("webgl vertex shader medium float precision:", gl.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.MEDIUM_FLOAT).precision);
      fillResult("webgl vertex shader medium float precision rangeMin:", gl.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.MEDIUM_FLOAT).rangeMin);
      fillResult("webgl vertex shader medium float precision rangeMax:", gl.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.MEDIUM_FLOAT).rangeMax);
      fillResult("webgl vertex shader low float precision:", gl.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.LOW_FLOAT).precision);
      fillResult("webgl vertex shader low float precision rangeMin:", gl.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.LOW_FLOAT).rangeMin);
      fillResult("webgl vertex shader low float precision rangeMax:", gl.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.LOW_FLOAT).rangeMax);
      fillResult("webgl fragment shader high float precision:", gl.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.HIGH_FLOAT).precision);
      fillResult("webgl fragment shader high float precision rangeMin:", gl.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.HIGH_FLOAT).rangeMin);
      fillResult("webgl fragment shader high float precision rangeMax:", gl.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.HIGH_FLOAT).rangeMax);
      fillResult("webgl fragment shader medium float precision:", gl.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.MEDIUM_FLOAT).precision);
      fillResult("webgl fragment shader medium float precision rangeMin:", gl.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.MEDIUM_FLOAT).rangeMin);
      fillResult("webgl fragment shader medium float precision rangeMax:", gl.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.MEDIUM_FLOAT).rangeMax);
      fillResult("webgl fragment shader low float precision:", gl.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.LOW_FLOAT).precision);
      fillResult("webgl fragment shader low float precision rangeMin:", gl.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.LOW_FLOAT).rangeMin);
      fillResult("webgl fragment shader low float precision rangeMax:", gl.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.LOW_FLOAT).rangeMax);
      fillResult("webgl vertex shader high int precision:", gl.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.HIGH_INT).precision);
      fillResult("webgl vertex shader high int precision rangeMin:", gl.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.HIGH_INT).rangeMin);
      fillResult("webgl vertex shader high int precision rangeMax:", gl.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.HIGH_INT).rangeMax);
      fillResult("webgl vertex shader medium int precision:", gl.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.MEDIUM_INT).precision);
      fillResult("webgl vertex shader medium int precision rangeMin:", gl.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.MEDIUM_INT).rangeMin);
      fillResult("webgl vertex shader medium int precision rangeMax:", gl.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.MEDIUM_INT).rangeMax);
      fillResult("webgl vertex shader low int precision:", gl.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.LOW_INT).precision);
      fillResult("webgl vertex shader low int precision rangeMin:", gl.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.LOW_INT).rangeMin);
      fillResult("webgl vertex shader low int precision rangeMax:", gl.getShaderPrecisionFormat(WebGLRenderingContext.VERTEX_SHADER, WebGLRenderingContext.LOW_INT).rangeMax);
      fillResult("webgl fragment shader high int precision:", gl.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.HIGH_INT).precision);
      fillResult("webgl fragment shader high int precision rangeMin:", gl.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.HIGH_INT).rangeMin);
      fillResult("webgl fragment shader high int precision rangeMax:", gl.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.HIGH_INT).rangeMax);
      fillResult("webgl fragment shader medium int precision:", gl.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.MEDIUM_INT).precision);
      fillResult("webgl fragment shader medium int precision rangeMin:", gl.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.MEDIUM_INT).rangeMin);
      fillResult("webgl fragment shader medium int precision rangeMax:", gl.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.MEDIUM_INT).rangeMax);
      fillResult("webgl fragment shader low int precision:", gl.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.LOW_INT).precision);
      fillResult("webgl fragment shader low int precision rangeMin:", gl.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.LOW_INT).rangeMin);
      fillResult("webgl fragment shader low int precision rangeMax:", gl.getShaderPrecisionFormat(WebGLRenderingContext.FRAGMENT_SHADER, WebGLRenderingContext.LOW_INT).rangeMax);
    }
    return result.join("~");
  },
  /**
   * @static
   *
   * @returns {boolean}
   */
  getAdBlock: function(){
    var ads = document.createElement("div");
    ads.innerHTML = "&nbsp;";
    ads.className = "adsbox";
    var result = false;
    try {
      // body may not exist, that's why we need try/catch
      document.body.appendChild(ads);
      result = document.getElementsByClassName("adsbox")[0].offsetHeight === 0;
      document.body.removeChild(ads);
    } catch (e) {
      result = false;
    }
    return result;
  },
  /**
   * @static
   *
   * @returns {boolean}
   */
  getHasLiedLanguages: function(){
    //We check if navigator.language is equal to the first language of navigator.languages
    if(typeof navigator["languages"] !== "undefined"){
      try {
        var firstLanguages = navigator["languages"][0].substr(0, 2);
        if(firstLanguages !== navigator["language"].substr(0, 2)){
          return true;
        }
      } catch(err) {
        return true;
      }
    }
    return false;
  },
  /**
   * @static
   *
   * @returns {boolean}
   */
  getHasLiedOs: function(){
    var userAgent = navigator.userAgent.toLowerCase();
    var oscpu = navigator["oscpu"];
    var platform = navigator.platform.toLowerCase();
    var os;
    //We extract the OS from the user agent (respect the order of the if else if statement)
    if(userAgent.indexOf("windows phone") >= 0){
      os = "Windows Phone";
    } else if(userAgent.indexOf("win") >= 0){
      os = "Windows";
    } else if(userAgent.indexOf("android") >= 0){
      os = "Android";
    } else if(userAgent.indexOf("linux") >= 0){
      os = "Linux";
    } else if(userAgent.indexOf("iphone") >= 0 || userAgent.indexOf("ipad") >= 0 ){
      os = "iOS";
    } else if(userAgent.indexOf("mac") >= 0){
      os = "Mac";
    } else{
      os = "Other";
    }

    // We detect if the person uses a mobile device
    var mobileDevice = !!(("ontouchstart" in window) || navigator["maxTouchPoints"] > 0 || navigator["msMaxTouchPoints"] > 0);
    if(mobileDevice && os !== "Windows Phone" && os !== "Android" && os !== "iOS" && os !== "Other"){
      return true;
    }

    // We compare oscpu with the OS extracted from the UA
    if(typeof oscpu !== "undefined"){
      oscpu = oscpu.toLowerCase();
      if(oscpu.indexOf("win") >= 0 && os !== "Windows" && os !== "Windows Phone"){
        return true;
      } else if(oscpu.indexOf("linux") >= 0 && os !== "Linux" && os !== "Android"){
        return true;
      } else if(oscpu.indexOf("mac") >= 0 && os !== "Mac" && os !== "iOS"){
        return true;
      } else if(oscpu.indexOf("win") === 0 && oscpu.indexOf("linux") === 0 && oscpu.indexOf("mac") >= 0 && os !== "other"){
        return true;
      }
    }

    //We compare platform with the OS extracted from the UA
    if(platform.indexOf("win") >= 0 && os !== "Windows" && os !== "Windows Phone"){
      return true;
    } else if((platform.indexOf("linux") >= 0 || platform.indexOf("android") >= 0 || platform.indexOf("pike") >= 0) && os !== "Linux" && os !== "Android"){
      return true;
    } else if((platform.indexOf("mac") >= 0 || platform.indexOf("ipad") >= 0 || platform.indexOf("ipod") >= 0 || platform.indexOf("iphone") >= 0) && os !== "Mac" && os !== "iOS"){
      return true;
    } else if(platform.indexOf("win") === 0 && platform.indexOf("linux") === 0 && platform.indexOf("mac") >= 0 && os !== "other"){
      return true;
    }

    if(typeof navigator.plugins === "undefined" && os !== "Windows" && os !== "Windows Phone"){
      //We are are in the case where the person uses ie, therefore we can infer that it's windows
      return true;
    }

    return false;
  },
  /**
   * @static
   *
   * @returns {boolean}
   */
  getHasLiedBrowser: function () {
    var userAgent = navigator.userAgent.toLowerCase();
    var productSub = navigator["productSub"];

    //we extract the browser from the user agent (respect the order of the tests)
    var browser;
    if(userAgent.indexOf("firefox") >= 0){
      browser = "Firefox";
    } else if(userAgent.indexOf("opera") >= 0 || userAgent.indexOf("opr") >= 0){
      browser = "Opera";
    } else if(userAgent.indexOf("chrome") >= 0){
      browser = "Chrome";
    } else if(userAgent.indexOf("safari") >= 0){
      browser = "Safari";
    } else if(userAgent.indexOf("trident") >= 0){
      browser = "Internet Explorer";
    } else{
      browser = "Other";
    }

    if((browser === "Chrome" || browser === "Safari" || browser === "Opera") && productSub !== "20030107"){
      return true;
    }

    var tempRes = eval.toString().length;
    if(tempRes === 37 && browser !== "Safari" && browser !== "Firefox" && browser !== "Other"){
      return true;
    } else if(tempRes === 39 && browser !== "Internet Explorer" && browser !== "Other"){
      return true;
    } else if(tempRes === 33 && browser !== "Chrome" && browser !== "Opera" && browser !== "Other"){
      return true;
    }

    //We create an error to see how it is handled
    var errFirefox;
    try {
      throw "a";
    } catch(err){
      try{
        err.toSource();
        errFirefox = true;
      } catch(errOfErr){
        errFirefox = false;
      }
    }
    if(errFirefox && browser !== "Firefox" && browser !== "Other"){
      return true;
    }
    return false;
  },
  /**
   * @static
   *
   * @returns {boolean}
   */
  isCanvasSupported: function () {
    var elem = document.createElement("canvas");
    return !!(elem.getContext && elem.getContext("2d"));
  },
  /**
   * @static
   *
   * @returns {boolean}
   */
  isWebGlSupported: function() {
    // code taken from Modernizr
    if (!Extractors.isCanvasSupported()) {
      return false;
    }

    var canvas = document.createElement("canvas"),
      glContext;

    try {
      glContext = canvas.getContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch(e) {
      glContext = false;
    }

    return !!window.WebGLRenderingContext && !!glContext;
  },
  /**
   * @static
   *
   * @returns {boolean}
   */
  isIE: function () {
    if(navigator.appName === "Microsoft Internet Explorer") {
      return true;
    } else if(navigator.appName === "Netscape" && /Trident/.test(navigator.userAgent)) { // IE 11
      return true;
    }
    return false;
  },
  /**
   * @static
   *
   * @returns {?WebGLRenderingContext}
   */
  getWebglCanvas: function() {
    var canvas = document.createElement("canvas");
    var gl = null;
    try {
      gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch(e) { /* squelch */ }
    if (!gl) { gl = null; }
    return gl;
  }
};

var Features = {
  /**
   * @static
   *
   * @param {!Fingerprint2} fp
   * @returns {Array}
   */
  runDetections: function (fp) {
    var keys = [];

    // NOTICE: option keys are strings for exporting purpose (Closure-Compiler convention).
    var exclude = fp.options["exclude"];

    if (!exclude["UserAgent"]) {
      Features.userAgentKey(keys);
    }

    if (!exclude["Language"]) {
      Features.languageKey(keys);
    }

    if (!exclude["ColorDepth"]) {
      Features.colorDepthKey(keys);
    }

    if (!exclude["PixelRatio"]) {
      Features.pixelRatioKey(keys);
    }

    if (!exclude["ScreenResolution"]) {
      Features.screenResolutionKey(keys, fp);
    }

    if (!exclude["AvailableScreenResolution"]) {
      Features.availableScreenResolutionKey(keys, fp);
    }

    if (!exclude["TimezoneOffset"]) {
      Features.timezoneOffsetKey(keys);
    }

    if (!exclude["SessionStorage"]) {
      Features.sessionStorageKey(keys);
    }

    if (!exclude["SessionStorage"]) {
      Features.localStorageKey(keys);
    }

    if (!exclude["IndexedDB"]) {
      Features.indexedDbKey(keys);
    }

    if (!exclude["AddBehavior"]) {
      Features.addBehaviorKey(keys);
    }

    if (!exclude["OpenDatabase"]) {
      Features.openDatabaseKey(keys);
    }

    if (!exclude["CpuClass"]) {
      Features.cpuClassKey(keys);
    }

    if (!exclude["Platform"]) {
      Features.platformKey(keys);
    }

    if (!exclude["DoNotTrack"]) {
      Features.doNotTrackKey(keys);
    }

    if (!exclude["Plugins"]) {
      Features.pluginsKey(keys, fp);
    }

    if (!exclude["Canvas"]) {
      Features.canvasKey(keys, fp);
    }

    if (!exclude["WebGL"]) {
      Features.webglKey(keys);
    } else {
      log("Skipping WebGL fingerprinting per excludeWebGL configuration option");
    }

    if (!exclude["AdBlock"]) {
      Features.adBlockKey(keys);
    }

    if (!exclude["HasLiedLanguages"]) {
      Features.hasLiedLanguagesKey(keys);
    }

    if (!exclude["HasLiedResolution"]) {
      Features.hasLiedResolutionKey(keys);
    }

    if (!exclude["HasLiedOs"]) {
      Features.hasLiedOsKey(keys);
    }

    if (!exclude["HasLiedBrowser"]) {
      Features.hasLiedBrowserKey(keys);
    }

    if (!exclude["TouchSupport"]) {
      Features.touchSupportKey(keys);
    }

    if (!exclude["JsFonts"]) {
      Features.fontsKey(keys, fp);
    }

    return keys;
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  userAgentKey: function(keys) {
    fillKeys(keys, "user_agent", navigator.userAgent);
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  languageKey: function(keys) {
    // IE 9,10 on Windows 10 does not have the `navigator.language` property any longer
    fillKeys(keys, "language", navigator["language"] || navigator["userLanguage"] || navigator["browserLanguage"] || navigator["systemLanguage"] || "");
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  colorDepthKey: function(keys) {
    fillKeys(keys, "color_depth", screen["colorDepth"] || -1);
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  pixelRatioKey: function(keys) {
    fillKeys(keys, "pixel_ratio", window["devicePixelRatio"] || "");
  },
  /**
   * @static
   *
   * @param {!Array} keys
   * @param {!Fingerprint2} fp
   */
  screenResolutionKey: function(keys, fp) {
    var resolution;
    if(fp.options["detectScreenOrientation"]) {
      resolution = (screen.height > screen.width) ? [screen.height, screen.width] : [screen.width, screen.height];
    } else {
      resolution = [screen.width, screen.height];
    }
    if(typeof resolution !== "undefined") { // headless browsers
      fillKeys(keys, "resolution", resolution);
    }
  },
  /**
   * @static
   *
   * @param {!Array} keys
   * @param {!Fingerprint2} fp
   */
  availableScreenResolutionKey: function(keys, fp) {
    var available;
    if(screen.availWidth && screen.availHeight) {
      if(fp.options["detectScreenOrientation"]) {
        available = (screen.availHeight > screen.availWidth) ? [screen.availHeight, screen.availWidth] : [screen.availWidth, screen.availHeight];
      } else {
        available = [screen.availHeight, screen.availWidth];
      }
    }
    if(typeof available !== "undefined") { // headless browsers
      fillKeys(keys, "available_resolution", available);
    }
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  timezoneOffsetKey: function(keys) {
    fillKeys(keys, "timezone_offset", new Date().getTimezoneOffset());
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  sessionStorageKey: function(keys) {
    if(Extractors.hasSessionStorage()){
      fillKeys(keys, "session_storage", 1);
    }
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  localStorageKey: function(keys) {
    if(Extractors.hasLocalStorage()){
      fillKeys(keys, "local_storage", 1);
    }
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  indexedDbKey: function(keys) {
    if(!!window.indexedDB){
      fillKeys(keys, "indexed_db", 1);
    }
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  addBehaviorKey: function(keys) {
    //body might not be defined at this point or removed programmatically
    if(document.body && document.body.addBehavior) {
      fillKeys(keys, "add_behavior", 1);
    }
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  openDatabaseKey: function(keys) {
    if(window.openDatabase) {
      fillKeys(keys, "open_database", 1);
    }
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  cpuClassKey: function(keys) {
    fillKeys(keys, "cpu_class", navigator["cpuClass"] || "unknown");
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  platformKey: function(keys) {
    fillKeys(keys, "navigator_platform", navigator.platform || "unknown");
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  doNotTrackKey: function(keys) {
    fillKeys(keys, "do_not_track", navigator["doNotTrack"] || navigator["msDoNotTrack"] || window["doNotTrack"] || "unknown");
  },
  /**
   * @static
   *
   * @param {!Array} keys
   * @param {!Fingerprint2} fp
   */
  canvasKey: function(keys, fp) {
    if (Extractors.isCanvasSupported()) {
      fillKeys(keys, "canvas", Extractors.getCanvasFp(fp));
    }
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  webglKey: function(keys) {
    if(!Extractors.isWebGlSupported()) {
      log("Skipping WebGL fingerprinting because it is not supported in this browser");
      return;
    }
    fillKeys(keys, "webgl", Extractors.getWebglFp());
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  adBlockKey: function(keys){
    fillKeys(keys, "adblock", Extractors.getAdBlock());
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  hasLiedLanguagesKey: function(keys){
    fillKeys(keys, "has_lied_languages", Extractors.getHasLiedLanguages());
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  hasLiedResolutionKey: function(keys){
    fillKeys(keys, "has_lied_resolution", !!(screen.width < screen.availWidth || screen.height < screen.availHeight));
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  hasLiedOsKey: function(keys){
    fillKeys(keys, "has_lied_os", Extractors.getHasLiedOs());
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  hasLiedBrowserKey: function(keys){
    fillKeys(keys, "has_lied_browser", Extractors.getHasLiedBrowser());
  },
  /**
   * @static
   *
   * @param {!Array} keys
   */
  touchSupportKey: function (keys) {
    fillKeys(keys, "touch_support", Extractors.getTouchSupport());
  },
  /**
   * @static
   *
   * @param {!Array} keys
   * @param {!Fingerprint2} fp
   */
  fontsKey: function(keys, fp) {
    fillKeys(keys, "js_fonts", Extractors.getFonts(fp));
  },
  /**
   * @static
   *
   * @param {!Array} keys
   * @param {!Fingerprint2} fp
   */
  pluginsKey: function(keys, fp) {
    if(Extractors.isIE()){
      if(!fp.options["exclude"]["IEPlugins"]) {
        fillKeys(keys, "ie_plugins", Extractors.getIEPlugins(fp));
      }
    } else {
      fillKeys(keys, "regular_plugins", Extractors.getRegularPlugins(fp));
    }
  }
};

Fingerprint2.prototype = {
  /**
   *
   * @param {string} input
   * @returns {string}
   */
  hash: function (input) {
    return murmur3x64hash128(input, 31);
  },
  /**
   *
   * @param {function(string,Array):void} [doneCallback]
   */
  get: function(doneCallback){
    if(typeof doneCallback !== "function"){
      return this.getInternal()[0];
    }
    this.getInternal(doneCallback);
  },
  getWithComponents: function(){
    return this.getInternal();
  },
  /**
   * @private
   * @param {function(string,Array):void} [doneCallback]
   * @returns {Array}
   */
  getInternal: function(doneCallback){

    var keys = Features.runDetections(this);

    var values = [];
    this.each(keys, function(value) {
      if(VERBOSE_MODE) {
        value = value.value;
      }
      if (typeof value.join !== "undefined") {
        value = value.join(";");
      }
      values.push(value);
    });

    var hashDigest = this.hash(values.join("~~~"));

    if(typeof doneCallback !== "function"){
      return [hashDigest, keys];
    }

    doneCallback(hashDigest, keys);
    return null;
  },
  /**
   *
   * @param obj
   * @param iterator
   * @param {Object} [context]
   */
  each: function (obj, iterator, context) {
    if (obj === null) {
      return;
    }
    if (this.nativeForEach && obj.forEach === this.nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === {}) { return; }
      }
    } else {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (iterator.call(context, obj[key], key, obj) === {}) { return; }
        }
      }
    }
  },
  /**
   *
   * @param obj
   * @param iterator
   * @param {Object} [context]
   * @returns {!Array}
   */
  map: function(obj, iterator, context) {
    var results = [];
    // Not using strict equality so that this acts as a
    // shortcut to checking for `null` and `undefined`.
    if (obj == null) { return results; }
    if (this.nativeMap && obj.map === this.nativeMap) { return obj.map(iterator, context); }
    this.each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  }
};

if(EXPORT_MODE){
  Fingerprint2["VERSION"] = "2.0.0-dev";
  Fingerprint2["Features"] = Features;
  Fingerprint2["Extractors"] = Extractors;
  Fingerprint2["Options"] = FP2Options;
  Fingerprint2["create"] = Fingerprint2.create;
  window["Fingerprint2"] = Fingerprint2;
}
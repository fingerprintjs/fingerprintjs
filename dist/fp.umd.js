/**
 * FingerprintJS v3.3.3 - Copyright (c) FingerprintJS, Inc, 2022 (https://fingerprintjs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 *
 * This software contains code from open-source projects:
 * MurmurHash3 by Karan Lyons (https://github.com/karanlyons/murmurHash3.js)
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FingerprintJS = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    function wait(durationMs, resolveWith) {
        return new Promise(function (resolve) { return setTimeout(resolve, durationMs, resolveWith); });
    }
    function requestIdleCallbackIfAvailable(fallbackTimeout, deadlineTimeout) {
        if (deadlineTimeout === void 0) { deadlineTimeout = Infinity; }
        var requestIdleCallback = window.requestIdleCallback;
        if (requestIdleCallback) {
            // The function `requestIdleCallback` loses the binding to `window` here.
            // `globalThis` isn't always equal `window` (see https://github.com/fingerprintjs/fingerprintjs/issues/683).
            // Therefore, an error can occur. `call(window,` prevents the error.
            return new Promise(function (resolve) { return requestIdleCallback.call(window, function () { return resolve(); }, { timeout: deadlineTimeout }); });
        }
        else {
            return wait(Math.min(fallbackTimeout, deadlineTimeout));
        }
    }
    function isPromise(value) {
        return value && typeof value.then === 'function';
    }
    /**
     * Calls a maybe asynchronous function without creating microtasks when the function is synchronous.
     * Catches errors in both cases.
     *
     * If just you run a code like this:
     * ```
     * console.time('Action duration')
     * await action()
     * console.timeEnd('Action duration')
     * ```
     * The synchronous function time can be measured incorrectly because another microtask may run before the `await`
     * returns the control back to the code.
     */
    function awaitIfAsync(action, callback) {
        try {
            var returnedValue = action();
            if (isPromise(returnedValue)) {
                returnedValue.then(function (result) { return callback(true, result); }, function (error) { return callback(false, error); });
            }
            else {
                callback(true, returnedValue);
            }
        }
        catch (error) {
            callback(false, error);
        }
    }
    /**
     * If you run many synchronous tasks without using this function, the JS main loop will be busy and asynchronous tasks
     * (e.g. completing a network request, rendering the page) won't be able to happen.
     * This function allows running many synchronous tasks such way that asynchronous tasks can run too in background.
     */
    function forEachWithBreaks(items, callback, loopReleaseInterval) {
        if (loopReleaseInterval === void 0) { loopReleaseInterval = 16; }
        return __awaiter(this, void 0, void 0, function () {
            var lastLoopReleaseTime, i, now;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lastLoopReleaseTime = Date.now();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < items.length)) return [3 /*break*/, 4];
                        callback(items[i], i);
                        now = Date.now();
                        if (!(now >= lastLoopReleaseTime + loopReleaseInterval)) return [3 /*break*/, 3];
                        lastLoopReleaseTime = now;
                        // Allows asynchronous actions and microtasks to happen
                        return [4 /*yield*/, wait(0)];
                    case 2:
                        // Allows asynchronous actions and microtasks to happen
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        ++i;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }

    /*
     * This file contains functions to work with pure data only (no browser features, DOM, side effects, etc).
     */
    /**
     * Does the same as Array.prototype.includes but has better typing
     */
    function includes(haystack, needle) {
        for (var i = 0, l = haystack.length; i < l; ++i) {
            if (haystack[i] === needle) {
                return true;
            }
        }
        return false;
    }
    /**
     * Like `!includes()` but with proper typing
     */
    function excludes(haystack, needle) {
        return !includes(haystack, needle);
    }
    /**
     * Be careful, NaN can return
     */
    function toInt(value) {
        return parseInt(value);
    }
    /**
     * Be careful, NaN can return
     */
    function toFloat(value) {
        return parseFloat(value);
    }
    function replaceNaN(value, replacement) {
        return typeof value === 'number' && isNaN(value) ? replacement : value;
    }
    function countTruthy(values) {
        return values.reduce(function (sum, value) { return sum + (value ? 1 : 0); }, 0);
    }
    function round(value, base) {
        if (base === void 0) { base = 1; }
        if (Math.abs(base) >= 1) {
            return Math.round(value / base) * base;
        }
        else {
            // Sometimes when a number is multiplied by a small number, precision is lost,
            // for example 1234 * 0.0001 === 0.12340000000000001, and it's more precise divide: 1234 / (1 / 0.0001) === 0.1234.
            var counterBase = 1 / base;
            return Math.round(value * counterBase) / counterBase;
        }
    }
    /**
     * Parses a CSS selector into tag name with HTML attributes.
     * Only single element selector are supported (without operators like space, +, >, etc).
     *
     * Multiple values can be returned for each attribute. You decide how to handle them.
     */
    function parseSimpleCssSelector(selector) {
        var _a, _b;
        var errorMessage = "Unexpected syntax '" + selector + "'";
        var tagMatch = /^\s*([a-z-]*)(.*)$/i.exec(selector);
        var tag = tagMatch[1] || undefined;
        var attributes = {};
        var partsRegex = /([.:#][\w-]+|\[.+?\])/gi;
        var addAttribute = function (name, value) {
            attributes[name] = attributes[name] || [];
            attributes[name].push(value);
        };
        for (;;) {
            var match = partsRegex.exec(tagMatch[2]);
            if (!match) {
                break;
            }
            var part = match[0];
            switch (part[0]) {
                case '.':
                    addAttribute('class', part.slice(1));
                    break;
                case '#':
                    addAttribute('id', part.slice(1));
                    break;
                case '[': {
                    var attributeMatch = /^\[([\w-]+)([~|^$*]?=("(.*?)"|([\w-]+)))?(\s+[is])?\]$/.exec(part);
                    if (attributeMatch) {
                        addAttribute(attributeMatch[1], (_b = (_a = attributeMatch[4]) !== null && _a !== void 0 ? _a : attributeMatch[5]) !== null && _b !== void 0 ? _b : '');
                    }
                    else {
                        throw new Error(errorMessage);
                    }
                    break;
                }
                default:
                    throw new Error(errorMessage);
            }
        }
        return [tag, attributes];
    }

    function ensureErrorWithMessage(error) {
        return error && typeof error === 'object' && 'message' in error
            ? error
            : { message: error };
    }
    /**
     * Loads the given entropy source. Returns a function that gets an entropy component from the source.
     *
     * The result is returned synchronously to prevent `loadSources` from
     * waiting for one source to load before getting the components from the other sources.
     */
    function loadSource(source, sourceOptions) {
        var isFinalResultLoaded = function (loadResult) {
            return typeof loadResult !== 'function';
        };
        var sourceLoadPromise = new Promise(function (resolveLoad) {
            var loadStartTime = Date.now();
            // `awaitIfAsync` is used instead of just `await` in order to measure the duration of synchronous sources
            // correctly (other microtasks won't affect the duration).
            awaitIfAsync(source.bind(null, sourceOptions), function () {
                var loadArgs = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    loadArgs[_i] = arguments[_i];
                }
                var loadDuration = Date.now() - loadStartTime;
                // Source loading failed
                if (!loadArgs[0]) {
                    return resolveLoad(function () { return ({ error: ensureErrorWithMessage(loadArgs[1]), duration: loadDuration }); });
                }
                var loadResult = loadArgs[1];
                // Source loaded with the final result
                if (isFinalResultLoaded(loadResult)) {
                    return resolveLoad(function () { return ({ value: loadResult, duration: loadDuration }); });
                }
                // Source loaded with "get" stage
                resolveLoad(function () {
                    return new Promise(function (resolveGet) {
                        var getStartTime = Date.now();
                        awaitIfAsync(loadResult, function () {
                            var getArgs = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                getArgs[_i] = arguments[_i];
                            }
                            var duration = loadDuration + Date.now() - getStartTime;
                            // Source getting failed
                            if (!getArgs[0]) {
                                return resolveGet({ error: ensureErrorWithMessage(getArgs[1]), duration: duration });
                            }
                            // Source getting succeeded
                            resolveGet({ value: getArgs[1], duration: duration });
                        });
                    });
                });
            });
        });
        return function getComponent() {
            return sourceLoadPromise.then(function (finalizeSource) { return finalizeSource(); });
        };
    }
    /**
     * Loads the given entropy sources. Returns a function that collects the entropy components.
     *
     * The result is returned synchronously in order to allow start getting the components
     * before the sources are loaded completely.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function loadSources(sources, sourceOptions, excludeSources) {
        var includedSources = Object.keys(sources).filter(function (sourceKey) { return excludes(excludeSources, sourceKey); });
        var sourceGetters = Array(includedSources.length);
        // Using `forEachWithBreaks` allows asynchronous sources to complete between synchronous sources
        // and measure the duration correctly
        forEachWithBreaks(includedSources, function (sourceKey, index) {
            sourceGetters[index] = loadSource(sources[sourceKey], sourceOptions);
        });
        return function getComponents() {
            return __awaiter(this, void 0, void 0, function () {
                var components, _i, includedSources_1, sourceKey, componentPromises, _loop_1, state_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            components = {};
                            for (_i = 0, includedSources_1 = includedSources; _i < includedSources_1.length; _i++) {
                                sourceKey = includedSources_1[_i];
                                components[sourceKey] = undefined;
                            }
                            componentPromises = Array(includedSources.length);
                            _loop_1 = function () {
                                var hasAllComponentPromises;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            hasAllComponentPromises = true;
                                            return [4 /*yield*/, forEachWithBreaks(includedSources, function (sourceKey, index) {
                                                    if (!componentPromises[index]) {
                                                        // `sourceGetters` may be incomplete at this point of execution because `forEachWithBreaks` is asynchronous
                                                        if (sourceGetters[index]) {
                                                            componentPromises[index] = sourceGetters[index]().then(function (component) { return (components[sourceKey] = component); });
                                                        }
                                                        else {
                                                            hasAllComponentPromises = false;
                                                        }
                                                    }
                                                })];
                                        case 1:
                                            _a.sent();
                                            if (hasAllComponentPromises) {
                                                return [2 /*return*/, "break"];
                                            }
                                            return [4 /*yield*/, wait(1)];
                                        case 2:
                                            _a.sent(); // Lets the source load loop continue
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            _a.label = 1;
                        case 1: return [5 /*yield**/, _loop_1()];
                        case 2:
                            state_1 = _a.sent();
                            if (state_1 === "break")
                                return [3 /*break*/, 4];
                            _a.label = 3;
                        case 3: return [3 /*break*/, 1];
                        case 4: return [4 /*yield*/, Promise.all(componentPromises)];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, components];
                    }
                });
            });
        };
    }

    // NOTE: this list must be up-to-date with browsers listed in
    // test/acceptance/useragentstrings.yml
    const BROWSER_ALIASES_MAP = {
      'Amazon Silk': 'amazon_silk',
      'Android Browser': 'android',
      Bada: 'bada',
      BlackBerry: 'blackberry',
      Chrome: 'chrome',
      Chromium: 'chromium',
      Electron: 'electron',
      Epiphany: 'epiphany',
      Firefox: 'firefox',
      Focus: 'focus',
      Generic: 'generic',
      'Google Search': 'google_search',
      Googlebot: 'googlebot',
      'Internet Explorer': 'ie',
      'K-Meleon': 'k_meleon',
      Maxthon: 'maxthon',
      'Microsoft Edge': 'edge',
      'MZ Browser': 'mz',
      'NAVER Whale Browser': 'naver',
      Opera: 'opera',
      'Opera Coast': 'opera_coast',
      PhantomJS: 'phantomjs',
      Puffin: 'puffin',
      QupZilla: 'qupzilla',
      QQ: 'qq',
      QQLite: 'qqlite',
      Safari: 'safari',
      Sailfish: 'sailfish',
      'Samsung Internet for Android': 'samsung_internet',
      SeaMonkey: 'seamonkey',
      Sleipnir: 'sleipnir',
      Swing: 'swing',
      Tizen: 'tizen',
      'UC Browser': 'uc',
      Vivaldi: 'vivaldi',
      'WebOS Browser': 'webos',
      WeChat: 'wechat',
      'Yandex Browser': 'yandex',
      Roku: 'roku',
    };

    const BROWSER_MAP = {
      amazon_silk: 'Amazon Silk',
      android: 'Android Browser',
      bada: 'Bada',
      blackberry: 'BlackBerry',
      chrome: 'Chrome',
      chromium: 'Chromium',
      electron: 'Electron',
      epiphany: 'Epiphany',
      firefox: 'Firefox',
      focus: 'Focus',
      generic: 'Generic',
      googlebot: 'Googlebot',
      google_search: 'Google Search',
      ie: 'Internet Explorer',
      k_meleon: 'K-Meleon',
      maxthon: 'Maxthon',
      edge: 'Microsoft Edge',
      mz: 'MZ Browser',
      naver: 'NAVER Whale Browser',
      opera: 'Opera',
      opera_coast: 'Opera Coast',
      phantomjs: 'PhantomJS',
      puffin: 'Puffin',
      qupzilla: 'QupZilla',
      qq: 'QQ Browser',
      qqlite: 'QQ Browser Lite',
      safari: 'Safari',
      sailfish: 'Sailfish',
      samsung_internet: 'Samsung Internet for Android',
      seamonkey: 'SeaMonkey',
      sleipnir: 'Sleipnir',
      swing: 'Swing',
      tizen: 'Tizen',
      uc: 'UC Browser',
      vivaldi: 'Vivaldi',
      webos: 'WebOS Browser',
      wechat: 'WeChat',
      yandex: 'Yandex Browser',
    };

    const PLATFORMS_MAP = {
      tablet: 'tablet',
      mobile: 'mobile',
      desktop: 'desktop',
      tv: 'tv',
    };

    const OS_MAP = {
      WindowsPhone: 'Windows Phone',
      Windows: 'Windows',
      MacOS: 'macOS',
      iOS: 'iOS',
      Android: 'Android',
      WebOS: 'WebOS',
      BlackBerry: 'BlackBerry',
      Bada: 'Bada',
      Tizen: 'Tizen',
      Linux: 'Linux',
      ChromeOS: 'Chrome OS',
      PlayStation4: 'PlayStation 4',
      Roku: 'Roku',
    };

    const ENGINE_MAP = {
      EdgeHTML: 'EdgeHTML',
      Blink: 'Blink',
      Trident: 'Trident',
      Presto: 'Presto',
      Gecko: 'Gecko',
      WebKit: 'WebKit',
    };

    class Utils {
      /**
       * Get first matched item for a string
       * @param {RegExp} regexp
       * @param {String} ua
       * @return {Array|{index: number, input: string}|*|boolean|string}
       */
      static getFirstMatch(regexp, ua) {
        const match = ua.match(regexp);
        return (match && match.length > 0 && match[1]) || '';
      }

      /**
       * Get second matched item for a string
       * @param regexp
       * @param {String} ua
       * @return {Array|{index: number, input: string}|*|boolean|string}
       */
      static getSecondMatch(regexp, ua) {
        const match = ua.match(regexp);
        return (match && match.length > 1 && match[2]) || '';
      }

      /**
       * Match a regexp and return a constant or undefined
       * @param {RegExp} regexp
       * @param {String} ua
       * @param {*} _const Any const that will be returned if regexp matches the string
       * @return {*}
       */
      static matchAndReturnConst(regexp, ua, _const) {
        if (regexp.test(ua)) {
          return _const;
        }
        return void (0);
      }

      static getWindowsVersionName(version) {
        switch (version) {
          case 'NT': return 'NT';
          case 'XP': return 'XP';
          case 'NT 5.0': return '2000';
          case 'NT 5.1': return 'XP';
          case 'NT 5.2': return '2003';
          case 'NT 6.0': return 'Vista';
          case 'NT 6.1': return '7';
          case 'NT 6.2': return '8';
          case 'NT 6.3': return '8.1';
          case 'NT 10.0': return '10';
          default: return undefined;
        }
      }

      /**
       * Get macOS version name
       *    10.5 - Leopard
       *    10.6 - Snow Leopard
       *    10.7 - Lion
       *    10.8 - Mountain Lion
       *    10.9 - Mavericks
       *    10.10 - Yosemite
       *    10.11 - El Capitan
       *    10.12 - Sierra
       *    10.13 - High Sierra
       *    10.14 - Mojave
       *    10.15 - Catalina
       *
       * @example
       *   getMacOSVersionName("10.14") // 'Mojave'
       *
       * @param  {string} version
       * @return {string} versionName
       */
      static getMacOSVersionName(version) {
        const v = version.split('.').splice(0, 2).map(s => parseInt(s, 10) || 0);
        v.push(0);
        if (v[0] !== 10) return undefined;
        switch (v[1]) {
          case 5: return 'Leopard';
          case 6: return 'Snow Leopard';
          case 7: return 'Lion';
          case 8: return 'Mountain Lion';
          case 9: return 'Mavericks';
          case 10: return 'Yosemite';
          case 11: return 'El Capitan';
          case 12: return 'Sierra';
          case 13: return 'High Sierra';
          case 14: return 'Mojave';
          case 15: return 'Catalina';
          default: return undefined;
        }
      }

      /**
       * Get Android version name
       *    1.5 - Cupcake
       *    1.6 - Donut
       *    2.0 - Eclair
       *    2.1 - Eclair
       *    2.2 - Froyo
       *    2.x - Gingerbread
       *    3.x - Honeycomb
       *    4.0 - Ice Cream Sandwich
       *    4.1 - Jelly Bean
       *    4.4 - KitKat
       *    5.x - Lollipop
       *    6.x - Marshmallow
       *    7.x - Nougat
       *    8.x - Oreo
       *    9.x - Pie
       *
       * @example
       *   getAndroidVersionName("7.0") // 'Nougat'
       *
       * @param  {string} version
       * @return {string} versionName
       */
      static getAndroidVersionName(version) {
        const v = version.split('.').splice(0, 2).map(s => parseInt(s, 10) || 0);
        v.push(0);
        if (v[0] === 1 && v[1] < 5) return undefined;
        if (v[0] === 1 && v[1] < 6) return 'Cupcake';
        if (v[0] === 1 && v[1] >= 6) return 'Donut';
        if (v[0] === 2 && v[1] < 2) return 'Eclair';
        if (v[0] === 2 && v[1] === 2) return 'Froyo';
        if (v[0] === 2 && v[1] > 2) return 'Gingerbread';
        if (v[0] === 3) return 'Honeycomb';
        if (v[0] === 4 && v[1] < 1) return 'Ice Cream Sandwich';
        if (v[0] === 4 && v[1] < 4) return 'Jelly Bean';
        if (v[0] === 4 && v[1] >= 4) return 'KitKat';
        if (v[0] === 5) return 'Lollipop';
        if (v[0] === 6) return 'Marshmallow';
        if (v[0] === 7) return 'Nougat';
        if (v[0] === 8) return 'Oreo';
        if (v[0] === 9) return 'Pie';
        return undefined;
      }

      /**
       * Get version precisions count
       *
       * @example
       *   getVersionPrecision("1.10.3") // 3
       *
       * @param  {string} version
       * @return {number}
       */
      static getVersionPrecision(version) {
        return version.split('.').length;
      }

      /**
       * Calculate browser version weight
       *
       * @example
       *   compareVersions('1.10.2.1',  '1.8.2.1.90')    // 1
       *   compareVersions('1.010.2.1', '1.09.2.1.90');  // 1
       *   compareVersions('1.10.2.1',  '1.10.2.1');     // 0
       *   compareVersions('1.10.2.1',  '1.0800.2');     // -1
       *   compareVersions('1.10.2.1',  '1.10',  true);  // 0
       *
       * @param {String} versionA versions versions to compare
       * @param {String} versionB versions versions to compare
       * @param {boolean} [isLoose] enable loose comparison
       * @return {Number} comparison result: -1 when versionA is lower,
       * 1 when versionA is bigger, 0 when both equal
       */
      /* eslint consistent-return: 1 */
      static compareVersions(versionA, versionB, isLoose = false) {
        // 1) get common precision for both versions, for example for "10.0" and "9" it should be 2
        const versionAPrecision = Utils.getVersionPrecision(versionA);
        const versionBPrecision = Utils.getVersionPrecision(versionB);

        let precision = Math.max(versionAPrecision, versionBPrecision);
        let lastPrecision = 0;

        const chunks = Utils.map([versionA, versionB], (version) => {
          const delta = precision - Utils.getVersionPrecision(version);

          // 2) "9" -> "9.0" (for precision = 2)
          const _version = version + new Array(delta + 1).join('.0');

          // 3) "9.0" -> ["000000000"", "000000009"]
          return Utils.map(_version.split('.'), chunk => new Array(20 - chunk.length).join('0') + chunk).reverse();
        });

        // adjust precision for loose comparison
        if (isLoose) {
          lastPrecision = precision - Math.min(versionAPrecision, versionBPrecision);
        }

        // iterate in reverse order by reversed chunks array
        precision -= 1;
        while (precision >= lastPrecision) {
          // 4) compare: "000000009" > "000000010" = false (but "9" > "10" = true)
          if (chunks[0][precision] > chunks[1][precision]) {
            return 1;
          }

          if (chunks[0][precision] === chunks[1][precision]) {
            if (precision === lastPrecision) {
              // all version chunks are same
              return 0;
            }

            precision -= 1;
          } else if (chunks[0][precision] < chunks[1][precision]) {
            return -1;
          }
        }

        return undefined;
      }

      /**
       * Array::map polyfill
       *
       * @param  {Array} arr
       * @param  {Function} iterator
       * @return {Array}
       */
      static map(arr, iterator) {
        const result = [];
        let i;
        if (Array.prototype.map) {
          return Array.prototype.map.call(arr, iterator);
        }
        for (i = 0; i < arr.length; i += 1) {
          result.push(iterator(arr[i]));
        }
        return result;
      }

      /**
       * Array::find polyfill
       *
       * @param  {Array} arr
       * @param  {Function} predicate
       * @return {Array}
       */
      static find(arr, predicate) {
        let i;
        let l;
        if (Array.prototype.find) {
          return Array.prototype.find.call(arr, predicate);
        }
        for (i = 0, l = arr.length; i < l; i += 1) {
          const value = arr[i];
          if (predicate(value, i)) {
            return value;
          }
        }
        return undefined;
      }

      /**
       * Object::assign polyfill
       *
       * @param  {Object} obj
       * @param  {Object} ...objs
       * @return {Object}
       */
      static assign(obj, ...assigners) {
        const result = obj;
        let i;
        let l;
        if (Object.assign) {
          return Object.assign(obj, ...assigners);
        }
        for (i = 0, l = assigners.length; i < l; i += 1) {
          const assigner = assigners[i];
          if (typeof assigner === 'object' && assigner !== null) {
            const keys = Object.keys(assigner);
            keys.forEach((key) => {
              result[key] = assigner[key];
            });
          }
        }
        return obj;
      }

      /**
       * Get short version/alias for a browser name
       *
       * @example
       *   getBrowserAlias('Microsoft Edge') // edge
       *
       * @param  {string} browserName
       * @return {string}
       */
      static getBrowserAlias(browserName) {
        return BROWSER_ALIASES_MAP[browserName];
      }

      /**
       * Get short version/alias for a browser name
       *
       * @example
       *   getBrowserAlias('edge') // Microsoft Edge
       *
       * @param  {string} browserAlias
       * @return {string}
       */
      static getBrowserTypeByAlias(browserAlias) {
        return BROWSER_MAP[browserAlias] || '';
      }
    }

    /**
     * Browsers' descriptors
     *
     * The idea of descriptors is simple. You should know about them two simple things:
     * 1. Every descriptor has a method or property called `test` and a `describe` method.
     * 2. Order of descriptors is important.
     *
     * More details:
     * 1. Method or property `test` serves as a way to detect whether the UA string
     * matches some certain browser or not. The `describe` method helps to make a result
     * object with params that show some browser-specific things: name, version, etc.
     * 2. Order of descriptors is important because a Parser goes through them one by one
     * in course. For example, if you insert Chrome's descriptor as the first one,
     * more then a half of browsers will be described as Chrome, because they will pass
     * the Chrome descriptor's test.
     *
     * Descriptor's `test` could be a property with an array of RegExps, where every RegExp
     * will be applied to a UA string to test it whether it matches or not.
     * If a descriptor has two or more regexps in the `test` array it tests them one by one
     * with a logical sum operation. Parser stops if it has found any RegExp that matches the UA.
     *
     * Or `test` could be a method. In that case it gets a Parser instance and should
     * return true/false to get the Parser know if this browser descriptor matches the UA or not.
     */

    const commonVersionIdentifier = /version\/(\d+(\.?_?\d+)+)/i;

    const browsersList = [
      /* Googlebot */
      {
        test: [/googlebot/i],
        describe(ua) {
          const browser = {
            name: 'Googlebot',
          };
          const version = Utils.getFirstMatch(/googlebot\/(\d+(\.\d+))/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },

      /* Opera < 13.0 */
      {
        test: [/opera/i],
        describe(ua) {
          const browser = {
            name: 'Opera',
          };
          const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },

      /* Opera > 13.0 */
      {
        test: [/opr\/|opios/i],
        describe(ua) {
          const browser = {
            name: 'Opera',
          };
          const version = Utils.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/SamsungBrowser/i],
        describe(ua) {
          const browser = {
            name: 'Samsung Internet for Android',
          };
          const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/Whale/i],
        describe(ua) {
          const browser = {
            name: 'NAVER Whale Browser',
          };
          const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/MZBrowser/i],
        describe(ua) {
          const browser = {
            name: 'MZ Browser',
          };
          const version = Utils.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/focus/i],
        describe(ua) {
          const browser = {
            name: 'Focus',
          };
          const version = Utils.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/swing/i],
        describe(ua) {
          const browser = {
            name: 'Swing',
          };
          const version = Utils.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/coast/i],
        describe(ua) {
          const browser = {
            name: 'Opera Coast',
          };
          const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/opt\/\d+(?:.?_?\d+)+/i],
        describe(ua) {
          const browser = {
            name: 'Opera Touch',
          };
          const version = Utils.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/yabrowser/i],
        describe(ua) {
          const browser = {
            name: 'Yandex Browser',
          };
          const version = Utils.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/ucbrowser/i],
        describe(ua) {
          const browser = {
            name: 'UC Browser',
          };
          const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/Maxthon|mxios/i],
        describe(ua) {
          const browser = {
            name: 'Maxthon',
          };
          const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/epiphany/i],
        describe(ua) {
          const browser = {
            name: 'Epiphany',
          };
          const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/puffin/i],
        describe(ua) {
          const browser = {
            name: 'Puffin',
          };
          const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/sleipnir/i],
        describe(ua) {
          const browser = {
            name: 'Sleipnir',
          };
          const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/k-meleon/i],
        describe(ua) {
          const browser = {
            name: 'K-Meleon',
          };
          const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/micromessenger/i],
        describe(ua) {
          const browser = {
            name: 'WeChat',
          };
          const version = Utils.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/qqbrowser/i],
        describe(ua) {
          const browser = {
            name: (/qqbrowserlite/i).test(ua) ? 'QQ Browser Lite' : 'QQ Browser',
          };
          const version = Utils.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/msie|trident/i],
        describe(ua) {
          const browser = {
            name: 'Internet Explorer',
          };
          const version = Utils.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/\sedg\//i],
        describe(ua) {
          const browser = {
            name: 'Microsoft Edge',
          };

          const version = Utils.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/edg([ea]|ios)/i],
        describe(ua) {
          const browser = {
            name: 'Microsoft Edge',
          };

          const version = Utils.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/vivaldi/i],
        describe(ua) {
          const browser = {
            name: 'Vivaldi',
          };
          const version = Utils.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/seamonkey/i],
        describe(ua) {
          const browser = {
            name: 'SeaMonkey',
          };
          const version = Utils.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/sailfish/i],
        describe(ua) {
          const browser = {
            name: 'Sailfish',
          };

          const version = Utils.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/silk/i],
        describe(ua) {
          const browser = {
            name: 'Amazon Silk',
          };
          const version = Utils.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/phantom/i],
        describe(ua) {
          const browser = {
            name: 'PhantomJS',
          };
          const version = Utils.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/slimerjs/i],
        describe(ua) {
          const browser = {
            name: 'SlimerJS',
          };
          const version = Utils.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
        describe(ua) {
          const browser = {
            name: 'BlackBerry',
          };
          const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/(web|hpw)[o0]s/i],
        describe(ua) {
          const browser = {
            name: 'WebOS Browser',
          };
          const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/bada/i],
        describe(ua) {
          const browser = {
            name: 'Bada',
          };
          const version = Utils.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/tizen/i],
        describe(ua) {
          const browser = {
            name: 'Tizen',
          };
          const version = Utils.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/qupzilla/i],
        describe(ua) {
          const browser = {
            name: 'QupZilla',
          };
          const version = Utils.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/firefox|iceweasel|fxios/i],
        describe(ua) {
          const browser = {
            name: 'Firefox',
          };
          const version = Utils.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/electron/i],
        describe(ua) {
          const browser = {
            name: 'Electron',
          };
          const version = Utils.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/MiuiBrowser/i],
        describe(ua) {
          const browser = {
            name: 'Miui',
          };
          const version = Utils.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/chromium/i],
        describe(ua) {
          const browser = {
            name: 'Chromium',
          };
          const version = Utils.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/chrome|crios|crmo/i],
        describe(ua) {
          const browser = {
            name: 'Chrome',
          };
          const version = Utils.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },
      {
        test: [/GSA/i],
        describe(ua) {
          const browser = {
            name: 'Google Search',
          };
          const version = Utils.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },

      /* Android Browser */
      {
        test(parser) {
          const notLikeAndroid = !parser.test(/like android/i);
          const butAndroid = parser.test(/android/i);
          return notLikeAndroid && butAndroid;
        },
        describe(ua) {
          const browser = {
            name: 'Android Browser',
          };
          const version = Utils.getFirstMatch(commonVersionIdentifier, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },

      /* PlayStation 4 */
      {
        test: [/playstation 4/i],
        describe(ua) {
          const browser = {
            name: 'PlayStation 4',
          };
          const version = Utils.getFirstMatch(commonVersionIdentifier, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },

      /* Safari */
      {
        test: [/safari|applewebkit/i],
        describe(ua) {
          const browser = {
            name: 'Safari',
          };
          const version = Utils.getFirstMatch(commonVersionIdentifier, ua);

          if (version) {
            browser.version = version;
          }

          return browser;
        },
      },

      /* Something else */
      {
        test: [/.*/i],
        describe(ua) {
          /* Here we try to make sure that there are explicit details about the device
           * in order to decide what regexp exactly we want to apply
           * (as there is a specific decision based on that conclusion)
           */
          const regexpWithoutDeviceSpec = /^(.*)\/(.*) /;
          const regexpWithDeviceSpec = /^(.*)\/(.*)[ \t]\((.*)/;
          const hasDeviceSpec = ua.search('\\(') !== -1;
          const regexp = hasDeviceSpec ? regexpWithDeviceSpec : regexpWithoutDeviceSpec;
          return {
            name: Utils.getFirstMatch(regexp, ua),
            version: Utils.getSecondMatch(regexp, ua),
          };
        },
      },
    ];

    var osParsersList = [
      /* Roku */
      {
        test: [/Roku\/DVP/],
        describe(ua) {
          const version = Utils.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i, ua);
          return {
            name: OS_MAP.Roku,
            version,
          };
        },
      },

      /* Windows Phone */
      {
        test: [/windows phone/i],
        describe(ua) {
          const version = Utils.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i, ua);
          return {
            name: OS_MAP.WindowsPhone,
            version,
          };
        },
      },

      /* Windows */
      {
        test: [/windows /i],
        describe(ua) {
          const version = Utils.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, ua);
          const versionName = Utils.getWindowsVersionName(version);

          return {
            name: OS_MAP.Windows,
            version,
            versionName,
          };
        },
      },

      /* Firefox on iPad */
      {
        test: [/Macintosh(.*?) FxiOS(.*?)\//],
        describe(ua) {
          const result = {
            name: OS_MAP.iOS,
          };
          const version = Utils.getSecondMatch(/(Version\/)(\d[\d.]+)/, ua);
          if (version) {
            result.version = version;
          }
          return result;
        },
      },

      /* macOS */
      {
        test: [/macintosh/i],
        describe(ua) {
          const version = Utils.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i, ua).replace(/[_\s]/g, '.');
          const versionName = Utils.getMacOSVersionName(version);

          const os = {
            name: OS_MAP.MacOS,
            version,
          };
          if (versionName) {
            os.versionName = versionName;
          }
          return os;
        },
      },

      /* iOS */
      {
        test: [/(ipod|iphone|ipad)/i],
        describe(ua) {
          const version = Utils.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i, ua).replace(/[_\s]/g, '.');

          return {
            name: OS_MAP.iOS,
            version,
          };
        },
      },

      /* Android */
      {
        test(parser) {
          const notLikeAndroid = !parser.test(/like android/i);
          const butAndroid = parser.test(/android/i);
          return notLikeAndroid && butAndroid;
        },
        describe(ua) {
          const version = Utils.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, ua);
          const versionName = Utils.getAndroidVersionName(version);
          const os = {
            name: OS_MAP.Android,
            version,
          };
          if (versionName) {
            os.versionName = versionName;
          }
          return os;
        },
      },

      /* WebOS */
      {
        test: [/(web|hpw)[o0]s/i],
        describe(ua) {
          const version = Utils.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i, ua);
          const os = {
            name: OS_MAP.WebOS,
          };

          if (version && version.length) {
            os.version = version;
          }
          return os;
        },
      },

      /* BlackBerry */
      {
        test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
        describe(ua) {
          const version = Utils.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i, ua)
            || Utils.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i, ua)
            || Utils.getFirstMatch(/\bbb(\d+)/i, ua);

          return {
            name: OS_MAP.BlackBerry,
            version,
          };
        },
      },

      /* Bada */
      {
        test: [/bada/i],
        describe(ua) {
          const version = Utils.getFirstMatch(/bada\/(\d+(\.\d+)*)/i, ua);

          return {
            name: OS_MAP.Bada,
            version,
          };
        },
      },

      /* Tizen */
      {
        test: [/tizen/i],
        describe(ua) {
          const version = Utils.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i, ua);

          return {
            name: OS_MAP.Tizen,
            version,
          };
        },
      },

      /* Linux */
      {
        test: [/linux/i],
        describe() {
          return {
            name: OS_MAP.Linux,
          };
        },
      },

      /* Chrome OS */
      {
        test: [/CrOS/],
        describe() {
          return {
            name: OS_MAP.ChromeOS,
          };
        },
      },

      /* Playstation 4 */
      {
        test: [/PlayStation 4/],
        describe(ua) {
          const version = Utils.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i, ua);
          return {
            name: OS_MAP.PlayStation4,
            version,
          };
        },
      },
    ];

    /*
     * Tablets go first since usually they have more specific
     * signs to detect.
     */

    var platformParsersList = [
      /* Googlebot */
      {
        test: [/googlebot/i],
        describe() {
          return {
            type: 'bot',
            vendor: 'Google',
          };
        },
      },

      /* Huawei */
      {
        test: [/huawei/i],
        describe(ua) {
          const model = Utils.getFirstMatch(/(can-l01)/i, ua) && 'Nova';
          const platform = {
            type: PLATFORMS_MAP.mobile,
            vendor: 'Huawei',
          };
          if (model) {
            platform.model = model;
          }
          return platform;
        },
      },

      /* Nexus Tablet */
      {
        test: [/nexus\s*(?:7|8|9|10).*/i],
        describe() {
          return {
            type: PLATFORMS_MAP.tablet,
            vendor: 'Nexus',
          };
        },
      },

      /* iPad */
      {
        test: [/ipad/i],
        describe() {
          return {
            type: PLATFORMS_MAP.tablet,
            vendor: 'Apple',
            model: 'iPad',
          };
        },
      },

      /* Firefox on iPad */
      {
        test: [/Macintosh(.*?) FxiOS(.*?)\//],
        describe() {
          return {
            type: PLATFORMS_MAP.tablet,
            vendor: 'Apple',
            model: 'iPad',
          };
        },
      },

      /* Amazon Kindle Fire */
      {
        test: [/kftt build/i],
        describe() {
          return {
            type: PLATFORMS_MAP.tablet,
            vendor: 'Amazon',
            model: 'Kindle Fire HD 7',
          };
        },
      },

      /* Another Amazon Tablet with Silk */
      {
        test: [/silk/i],
        describe() {
          return {
            type: PLATFORMS_MAP.tablet,
            vendor: 'Amazon',
          };
        },
      },

      /* Tablet */
      {
        test: [/tablet(?! pc)/i],
        describe() {
          return {
            type: PLATFORMS_MAP.tablet,
          };
        },
      },

      /* iPod/iPhone */
      {
        test(parser) {
          const iDevice = parser.test(/ipod|iphone/i);
          const likeIDevice = parser.test(/like (ipod|iphone)/i);
          return iDevice && !likeIDevice;
        },
        describe(ua) {
          const model = Utils.getFirstMatch(/(ipod|iphone)/i, ua);
          return {
            type: PLATFORMS_MAP.mobile,
            vendor: 'Apple',
            model,
          };
        },
      },

      /* Nexus Mobile */
      {
        test: [/nexus\s*[0-6].*/i, /galaxy nexus/i],
        describe() {
          return {
            type: PLATFORMS_MAP.mobile,
            vendor: 'Nexus',
          };
        },
      },

      /* Mobile */
      {
        test: [/[^-]mobi/i],
        describe() {
          return {
            type: PLATFORMS_MAP.mobile,
          };
        },
      },

      /* BlackBerry */
      {
        test(parser) {
          return parser.getBrowserName(true) === 'blackberry';
        },
        describe() {
          return {
            type: PLATFORMS_MAP.mobile,
            vendor: 'BlackBerry',
          };
        },
      },

      /* Bada */
      {
        test(parser) {
          return parser.getBrowserName(true) === 'bada';
        },
        describe() {
          return {
            type: PLATFORMS_MAP.mobile,
          };
        },
      },

      /* Windows Phone */
      {
        test(parser) {
          return parser.getBrowserName() === 'windows phone';
        },
        describe() {
          return {
            type: PLATFORMS_MAP.mobile,
            vendor: 'Microsoft',
          };
        },
      },

      /* Android Tablet */
      {
        test(parser) {
          const osMajorVersion = Number(String(parser.getOSVersion()).split('.')[0]);
          return parser.getOSName(true) === 'android' && (osMajorVersion >= 3);
        },
        describe() {
          return {
            type: PLATFORMS_MAP.tablet,
          };
        },
      },

      /* Android Mobile */
      {
        test(parser) {
          return parser.getOSName(true) === 'android';
        },
        describe() {
          return {
            type: PLATFORMS_MAP.mobile,
          };
        },
      },

      /* desktop */
      {
        test(parser) {
          return parser.getOSName(true) === 'macos';
        },
        describe() {
          return {
            type: PLATFORMS_MAP.desktop,
            vendor: 'Apple',
          };
        },
      },

      /* Windows */
      {
        test(parser) {
          return parser.getOSName(true) === 'windows';
        },
        describe() {
          return {
            type: PLATFORMS_MAP.desktop,
          };
        },
      },

      /* Linux */
      {
        test(parser) {
          return parser.getOSName(true) === 'linux';
        },
        describe() {
          return {
            type: PLATFORMS_MAP.desktop,
          };
        },
      },

      /* PlayStation 4 */
      {
        test(parser) {
          return parser.getOSName(true) === 'playstation 4';
        },
        describe() {
          return {
            type: PLATFORMS_MAP.tv,
          };
        },
      },

      /* Roku */
      {
        test(parser) {
          return parser.getOSName(true) === 'roku';
        },
        describe() {
          return {
            type: PLATFORMS_MAP.tv,
          };
        },
      },
    ];

    /*
     * More specific goes first
     */
    var enginesParsersList = [
      /* EdgeHTML */
      {
        test(parser) {
          return parser.getBrowserName(true) === 'microsoft edge';
        },
        describe(ua) {
          const isBlinkBased = /\sedg\//i.test(ua);

          // return blink if it's blink-based one
          if (isBlinkBased) {
            return {
              name: ENGINE_MAP.Blink,
            };
          }

          // otherwise match the version and return EdgeHTML
          const version = Utils.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i, ua);

          return {
            name: ENGINE_MAP.EdgeHTML,
            version,
          };
        },
      },

      /* Trident */
      {
        test: [/trident/i],
        describe(ua) {
          const engine = {
            name: ENGINE_MAP.Trident,
          };

          const version = Utils.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            engine.version = version;
          }

          return engine;
        },
      },

      /* Presto */
      {
        test(parser) {
          return parser.test(/presto/i);
        },
        describe(ua) {
          const engine = {
            name: ENGINE_MAP.Presto,
          };

          const version = Utils.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            engine.version = version;
          }

          return engine;
        },
      },

      /* Gecko */
      {
        test(parser) {
          const isGecko = parser.test(/gecko/i);
          const likeGecko = parser.test(/like gecko/i);
          return isGecko && !likeGecko;
        },
        describe(ua) {
          const engine = {
            name: ENGINE_MAP.Gecko,
          };

          const version = Utils.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            engine.version = version;
          }

          return engine;
        },
      },

      /* Blink */
      {
        test: [/(apple)?webkit\/537\.36/i],
        describe() {
          return {
            name: ENGINE_MAP.Blink,
          };
        },
      },

      /* WebKit */
      {
        test: [/(apple)?webkit/i],
        describe(ua) {
          const engine = {
            name: ENGINE_MAP.WebKit,
          };

          const version = Utils.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i, ua);

          if (version) {
            engine.version = version;
          }

          return engine;
        },
      },
    ];

    /**
     * The main class that arranges the whole parsing process.
     */
    class Parser {
      /**
       * Create instance of Parser
       *
       * @param {String} UA User-Agent string
       * @param {Boolean} [skipParsing=false] parser can skip parsing in purpose of performance
       * improvements if you need to make a more particular parsing
       * like {@link Parser#parseBrowser} or {@link Parser#parsePlatform}
       *
       * @throw {Error} in case of empty UA String
       *
       * @constructor
       */
      constructor(UA, skipParsing = false) {
        if (UA === void (0) || UA === null || UA === '') {
          throw new Error("UserAgent parameter can't be empty");
        }

        this._ua = UA;

        /**
         * @typedef ParsedResult
         * @property {Object} browser
         * @property {String|undefined} [browser.name]
         * Browser name, like `"Chrome"` or `"Internet Explorer"`
         * @property {String|undefined} [browser.version] Browser version as a String `"12.01.45334.10"`
         * @property {Object} os
         * @property {String|undefined} [os.name] OS name, like `"Windows"` or `"macOS"`
         * @property {String|undefined} [os.version] OS version, like `"NT 5.1"` or `"10.11.1"`
         * @property {String|undefined} [os.versionName] OS name, like `"XP"` or `"High Sierra"`
         * @property {Object} platform
         * @property {String|undefined} [platform.type]
         * platform type, can be either `"desktop"`, `"tablet"` or `"mobile"`
         * @property {String|undefined} [platform.vendor] Vendor of the device,
         * like `"Apple"` or `"Samsung"`
         * @property {String|undefined} [platform.model] Device model,
         * like `"iPhone"` or `"Kindle Fire HD 7"`
         * @property {Object} engine
         * @property {String|undefined} [engine.name]
         * Can be any of this: `WebKit`, `Blink`, `Gecko`, `Trident`, `Presto`, `EdgeHTML`
         * @property {String|undefined} [engine.version] String version of the engine
         */
        this.parsedResult = {};

        if (skipParsing !== true) {
          this.parse();
        }
      }

      /**
       * Get UserAgent string of current Parser instance
       * @return {String} User-Agent String of the current <Parser> object
       *
       * @public
       */
      getUA() {
        return this._ua;
      }

      /**
       * Test a UA string for a regexp
       * @param {RegExp} regex
       * @return {Boolean}
       */
      test(regex) {
        return regex.test(this._ua);
      }

      /**
       * Get parsed browser object
       * @return {Object}
       */
      parseBrowser() {
        this.parsedResult.browser = {};

        const browserDescriptor = Utils.find(browsersList, (_browser) => {
          if (typeof _browser.test === 'function') {
            return _browser.test(this);
          }

          if (_browser.test instanceof Array) {
            return _browser.test.some(condition => this.test(condition));
          }

          throw new Error("Browser's test function is not valid");
        });

        if (browserDescriptor) {
          this.parsedResult.browser = browserDescriptor.describe(this.getUA());
        }

        return this.parsedResult.browser;
      }

      /**
       * Get parsed browser object
       * @return {Object}
       *
       * @public
       */
      getBrowser() {
        if (this.parsedResult.browser) {
          return this.parsedResult.browser;
        }

        return this.parseBrowser();
      }

      /**
       * Get browser's name
       * @return {String} Browser's name or an empty string
       *
       * @public
       */
      getBrowserName(toLowerCase) {
        if (toLowerCase) {
          return String(this.getBrowser().name).toLowerCase() || '';
        }
        return this.getBrowser().name || '';
      }


      /**
       * Get browser's version
       * @return {String} version of browser
       *
       * @public
       */
      getBrowserVersion() {
        return this.getBrowser().version;
      }

      /**
       * Get OS
       * @return {Object}
       *
       * @example
       * this.getOS();
       * {
       *   name: 'macOS',
       *   version: '10.11.12'
       * }
       */
      getOS() {
        if (this.parsedResult.os) {
          return this.parsedResult.os;
        }

        return this.parseOS();
      }

      /**
       * Parse OS and save it to this.parsedResult.os
       * @return {*|{}}
       */
      parseOS() {
        this.parsedResult.os = {};

        const os = Utils.find(osParsersList, (_os) => {
          if (typeof _os.test === 'function') {
            return _os.test(this);
          }

          if (_os.test instanceof Array) {
            return _os.test.some(condition => this.test(condition));
          }

          throw new Error("Browser's test function is not valid");
        });

        if (os) {
          this.parsedResult.os = os.describe(this.getUA());
        }

        return this.parsedResult.os;
      }

      /**
       * Get OS name
       * @param {Boolean} [toLowerCase] return lower-cased value
       * @return {String} name of the OS — macOS, Windows, Linux, etc.
       */
      getOSName(toLowerCase) {
        const { name } = this.getOS();

        if (toLowerCase) {
          return String(name).toLowerCase() || '';
        }

        return name || '';
      }

      /**
       * Get OS version
       * @return {String} full version with dots ('10.11.12', '5.6', etc)
       */
      getOSVersion() {
        return this.getOS().version;
      }

      /**
       * Get parsed platform
       * @return {{}}
       */
      getPlatform() {
        if (this.parsedResult.platform) {
          return this.parsedResult.platform;
        }

        return this.parsePlatform();
      }

      /**
       * Get platform name
       * @param {Boolean} [toLowerCase=false]
       * @return {*}
       */
      getPlatformType(toLowerCase = false) {
        const { type } = this.getPlatform();

        if (toLowerCase) {
          return String(type).toLowerCase() || '';
        }

        return type || '';
      }

      /**
       * Get parsed platform
       * @return {{}}
       */
      parsePlatform() {
        this.parsedResult.platform = {};

        const platform = Utils.find(platformParsersList, (_platform) => {
          if (typeof _platform.test === 'function') {
            return _platform.test(this);
          }

          if (_platform.test instanceof Array) {
            return _platform.test.some(condition => this.test(condition));
          }

          throw new Error("Browser's test function is not valid");
        });

        if (platform) {
          this.parsedResult.platform = platform.describe(this.getUA());
        }

        return this.parsedResult.platform;
      }

      /**
       * Get parsed engine
       * @return {{}}
       */
      getEngine() {
        if (this.parsedResult.engine) {
          return this.parsedResult.engine;
        }

        return this.parseEngine();
      }

      /**
       * Get engines's name
       * @return {String} Engines's name or an empty string
       *
       * @public
       */
      getEngineName(toLowerCase) {
        if (toLowerCase) {
          return String(this.getEngine().name).toLowerCase() || '';
        }
        return this.getEngine().name || '';
      }

      /**
       * Get parsed platform
       * @return {{}}
       */
      parseEngine() {
        this.parsedResult.engine = {};

        const engine = Utils.find(enginesParsersList, (_engine) => {
          if (typeof _engine.test === 'function') {
            return _engine.test(this);
          }

          if (_engine.test instanceof Array) {
            return _engine.test.some(condition => this.test(condition));
          }

          throw new Error("Browser's test function is not valid");
        });

        if (engine) {
          this.parsedResult.engine = engine.describe(this.getUA());
        }

        return this.parsedResult.engine;
      }

      /**
       * Parse full information about the browser
       * @returns {Parser}
       */
      parse() {
        this.parseBrowser();
        this.parseOS();
        this.parsePlatform();
        this.parseEngine();

        return this;
      }

      /**
       * Get parsed result
       * @return {ParsedResult}
       */
      getResult() {
        return Utils.assign({}, this.parsedResult);
      }

      /**
       * Check if parsed browser matches certain conditions
       *
       * @param {Object} checkTree It's one or two layered object,
       * which can include a platform or an OS on the first layer
       * and should have browsers specs on the bottom-laying layer
       *
       * @returns {Boolean|undefined} Whether the browser satisfies the set conditions or not.
       * Returns `undefined` when the browser is no described in the checkTree object.
       *
       * @example
       * const browser = Bowser.getParser(window.navigator.userAgent);
       * if (browser.satisfies({chrome: '>118.01.1322' }))
       * // or with os
       * if (browser.satisfies({windows: { chrome: '>118.01.1322' } }))
       * // or with platforms
       * if (browser.satisfies({desktop: { chrome: '>118.01.1322' } }))
       */
      satisfies(checkTree) {
        const platformsAndOSes = {};
        let platformsAndOSCounter = 0;
        const browsers = {};
        let browsersCounter = 0;

        const allDefinitions = Object.keys(checkTree);

        allDefinitions.forEach((key) => {
          const currentDefinition = checkTree[key];
          if (typeof currentDefinition === 'string') {
            browsers[key] = currentDefinition;
            browsersCounter += 1;
          } else if (typeof currentDefinition === 'object') {
            platformsAndOSes[key] = currentDefinition;
            platformsAndOSCounter += 1;
          }
        });

        if (platformsAndOSCounter > 0) {
          const platformsAndOSNames = Object.keys(platformsAndOSes);
          const OSMatchingDefinition = Utils.find(platformsAndOSNames, name => (this.isOS(name)));

          if (OSMatchingDefinition) {
            const osResult = this.satisfies(platformsAndOSes[OSMatchingDefinition]);

            if (osResult !== void 0) {
              return osResult;
            }
          }

          const platformMatchingDefinition = Utils.find(
            platformsAndOSNames,
            name => (this.isPlatform(name)),
          );
          if (platformMatchingDefinition) {
            const platformResult = this.satisfies(platformsAndOSes[platformMatchingDefinition]);

            if (platformResult !== void 0) {
              return platformResult;
            }
          }
        }

        if (browsersCounter > 0) {
          const browserNames = Object.keys(browsers);
          const matchingDefinition = Utils.find(browserNames, name => (this.isBrowser(name, true)));

          if (matchingDefinition !== void 0) {
            return this.compareVersion(browsers[matchingDefinition]);
          }
        }

        return undefined;
      }

      /**
       * Check if the browser name equals the passed string
       * @param browserName The string to compare with the browser name
       * @param [includingAlias=false] The flag showing whether alias will be included into comparison
       * @returns {boolean}
       */
      isBrowser(browserName, includingAlias = false) {
        const defaultBrowserName = this.getBrowserName().toLowerCase();
        let browserNameLower = browserName.toLowerCase();
        const alias = Utils.getBrowserTypeByAlias(browserNameLower);

        if (includingAlias && alias) {
          browserNameLower = alias.toLowerCase();
        }
        return browserNameLower === defaultBrowserName;
      }

      compareVersion(version) {
        let expectedResults = [0];
        let comparableVersion = version;
        let isLoose = false;

        const currentBrowserVersion = this.getBrowserVersion();

        if (typeof currentBrowserVersion !== 'string') {
          return void 0;
        }

        if (version[0] === '>' || version[0] === '<') {
          comparableVersion = version.substr(1);
          if (version[1] === '=') {
            isLoose = true;
            comparableVersion = version.substr(2);
          } else {
            expectedResults = [];
          }
          if (version[0] === '>') {
            expectedResults.push(1);
          } else {
            expectedResults.push(-1);
          }
        } else if (version[0] === '=') {
          comparableVersion = version.substr(1);
        } else if (version[0] === '~') {
          isLoose = true;
          comparableVersion = version.substr(1);
        }

        return expectedResults.indexOf(
          Utils.compareVersions(currentBrowserVersion, comparableVersion, isLoose),
        ) > -1;
      }

      isOS(osName) {
        return this.getOSName(true) === String(osName).toLowerCase();
      }

      isPlatform(platformType) {
        return this.getPlatformType(true) === String(platformType).toLowerCase();
      }

      isEngine(engineName) {
        return this.getEngineName(true) === String(engineName).toLowerCase();
      }

      /**
       * Is anything? Check if the browser is called "anything",
       * the OS called "anything" or the platform called "anything"
       * @param {String} anything
       * @param [includingAlias=false] The flag showing whether alias will be included into comparison
       * @returns {Boolean}
       */
      is(anything, includingAlias = false) {
        return this.isBrowser(anything, includingAlias) || this.isOS(anything)
          || this.isPlatform(anything);
      }

      /**
       * Check if any of the given values satisfies this.is(anything)
       * @param {String[]} anythings
       * @returns {Boolean}
       */
      some(anythings = []) {
        return anythings.some(anything => this.is(anything));
      }
    }

    /*!
     * Bowser - a browser detector
     * https://github.com/lancedikson/bowser
     * MIT License | (c) Dustin Diaz 2012-2015
     * MIT License | (c) Denis Demchenko 2015-2019
     */

    /**
     * Bowser class.
     * Keep it simple as much as it can be.
     * It's supposed to work with collections of {@link Parser} instances
     * rather then solve one-instance problems.
     * All the one-instance stuff is located in Parser class.
     *
     * @class
     * @classdesc Bowser is a static object, that provides an API to the Parsers
     * @hideconstructor
     */
    class Bowser {
      /**
       * Creates a {@link Parser} instance
       *
       * @param {String} UA UserAgent string
       * @param {Boolean} [skipParsing=false] Will make the Parser postpone parsing until you ask it
       * explicitly. Same as `skipParsing` for {@link Parser}.
       * @returns {Parser}
       * @throws {Error} when UA is not a String
       *
       * @example
       * const parser = Bowser.getParser(window.navigator.userAgent);
       * const result = parser.getResult();
       */
      static getParser(UA, skipParsing = false) {
        if (typeof UA !== 'string') {
          throw new Error('UserAgent should be a string');
        }
        return new Parser(UA, skipParsing);
      }

      /**
       * Creates a {@link Parser} instance and runs {@link Parser.getResult} immediately
       *
       * @param UA
       * @return {ParsedResult}
       *
       * @example
       * const result = Bowser.parse(window.navigator.userAgent);
       */
      static parse(UA) {
        return (new Parser(UA)).getResult();
      }

      static get BROWSER_MAP() {
        return BROWSER_MAP;
      }

      static get ENGINE_MAP() {
        return ENGINE_MAP;
      }

      static get OS_MAP() {
        return OS_MAP;
      }

      static get PLATFORMS_MAP() {
        return PLATFORMS_MAP;
      }
    }

    /*
     * Functions to help with features that vary through browsers
     */
    /**
     * Returns detailed human-readable browser, engine, and os information
     */
    var getBrowserInfo = function (userAgent) {
        if (userAgent === void 0) { userAgent = window.navigator.userAgent; }
        return Bowser.parse(userAgent);
    };
    /**
     * Checks whether the browser is based on Trident (the Internet Explorer engine) without using user-agent.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isTrident() {
        var w = window;
        var n = navigator;
        // The properties are checked to be in IE 10, IE 11 and not to be in other browsers in October 2020
        return (countTruthy([
            'MSCSSMatrix' in w,
            'msSetImmediate' in w,
            'msIndexedDB' in w,
            'msMaxTouchPoints' in n,
            'msPointerEnabled' in n,
        ]) >= 4);
    }
    /**
     * Checks whether the browser is based on EdgeHTML (the pre-Chromium Edge engine) without using user-agent.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isEdgeHTML() {
        // Based on research in October 2020
        var w = window;
        var n = navigator;
        return (countTruthy(['msWriteProfilerMark' in w, 'MSStream' in w, 'msLaunchUri' in n, 'msSaveBlob' in n]) >= 3 &&
            !isTrident());
    }
    /**
     * Checks whether the browser is based on Chromium without using user-agent.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isChromium() {
        // Based on research in October 2020. Tested to detect Chromium 42-86.
        var w = window;
        var n = navigator;
        return (countTruthy([
            'webkitPersistentStorage' in n,
            'webkitTemporaryStorage' in n,
            n.vendor.indexOf('Google') === 0,
            'webkitResolveLocalFileSystemURL' in w,
            'BatteryManager' in w,
            'webkitMediaStream' in w,
            'webkitSpeechGrammar' in w,
        ]) >= 5);
    }
    /**
     * Checks whether the browser is based on mobile or desktop Safari without using user-agent.
     * All iOS browsers use WebKit (the Safari engine).
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isWebKit() {
        // Based on research in September 2020
        var w = window;
        var n = navigator;
        return (countTruthy([
            'ApplePayError' in w,
            'CSSPrimitiveValue' in w,
            'Counter' in w,
            n.vendor.indexOf('Apple') === 0,
            'getStorageUpdates' in n,
            'WebKitMediaKeys' in w,
        ]) >= 4);
    }
    /**
     * Checks whether the WebKit browser is a desktop Safari.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isDesktopSafari() {
        var w = window;
        return (countTruthy([
            'safari' in w,
            !('DeviceMotionEvent' in w),
            !('ongestureend' in w),
            !('standalone' in navigator),
        ]) >= 3);
    }
    /**
     * Checks whether the browser is based on Gecko (Firefox engine) without using user-agent.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isGecko() {
        var _a, _b;
        var w = window;
        // Based on research in September 2020
        return (countTruthy([
            'buildID' in navigator,
            'MozAppearance' in ((_b = (_a = document.documentElement) === null || _a === void 0 ? void 0 : _a.style) !== null && _b !== void 0 ? _b : {}),
            'onmozfullscreenchange' in w,
            'mozInnerScreenX' in w,
            'CSSMozDocumentRule' in w,
            'CanvasCaptureMediaStream' in w,
        ]) >= 4);
    }
    /**
     * Checks whether the browser is based on Chromium version ≥86 without using user-agent.
     * It doesn't check that the browser is based on Chromium, there is a separate function for this.
     */
    function isChromium86OrNewer() {
        // Checked in Chrome 85 vs Chrome 86 both on desktop and Android
        var w = window;
        return (countTruthy([
            !('MediaSettingsRange' in w),
            'RTCEncodedAudioFrame' in w,
            '' + w.Intl === '[object Intl]',
            '' + w.Reflect === '[object Reflect]',
        ]) >= 3);
    }
    /**
     * Checks whether the browser is based on WebKit version ≥606 (Safari ≥12) without using user-agent.
     * It doesn't check that the browser is based on WebKit, there is a separate function for this.
     *
     * @link https://en.wikipedia.org/wiki/Safari_version_history#Release_history Safari-WebKit versions map
     */
    function isWebKit606OrNewer() {
        // Checked in Safari 9–14
        var w = window;
        return (countTruthy([
            'DOMRectList' in w,
            'RTCPeerConnectionIceEvent' in w,
            'SVGGeometryElement' in w,
            'ontransitioncancel' in w,
        ]) >= 3);
    }
    /**
     * Checks whether the device is an iPad.
     * It doesn't check that the engine is WebKit and that the WebKit isn't desktop.
     */
    function isIPad() {
        // Checked on:
        // Safari on iPadOS (both mobile and desktop modes): 8, 11, 12, 13, 14
        // Chrome on iPadOS (both mobile and desktop modes): 11, 12, 13, 14
        // Safari on iOS (both mobile and desktop modes): 9, 10, 11, 12, 13, 14
        // Chrome on iOS (both mobile and desktop modes): 9, 10, 11, 12, 13, 14
        // Before iOS 13. Safari tampers the value in "request desktop site" mode since iOS 13.
        if (navigator.platform === 'iPad') {
            return true;
        }
        var s = screen;
        var screenRatio = s.width / s.height;
        return (countTruthy([
            'MediaSource' in window,
            !!Element.prototype.webkitRequestFullscreen,
            // iPhone 4S that runs iOS 9 matches this. But it won't match the criteria above, so it won't be detected as iPad.
            screenRatio > 0.65 && screenRatio < 1.53,
        ]) >= 2);
    }
    /**
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function getFullscreenElement() {
        var d = document;
        return d.fullscreenElement || d.msFullscreenElement || d.mozFullScreenElement || d.webkitFullscreenElement || null;
    }
    function exitFullscreen() {
        var d = document;
        // `call` is required because the function throws an error without a proper "this" context
        return (d.exitFullscreen || d.msExitFullscreen || d.mozCancelFullScreen || d.webkitExitFullscreen).call(d);
    }
    /**
     * Checks whether the device runs on Android without using user-agent.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isAndroid() {
        var isItChromium = isChromium();
        var isItGecko = isGecko();
        // Only 2 browser engines are presented on Android.
        // Actually, there is also Android 4.1 browser, but it's not worth detecting it at the moment.
        if (!isItChromium && !isItGecko) {
            return false;
        }
        var w = window;
        // Chrome removes all words "Android" from `navigator` when desktop version is requested
        // Firefox keeps "Android" in `navigator.appVersion` when desktop version is requested
        return (countTruthy([
            'onorientationchange' in w,
            'orientation' in w,
            isItChromium && !('SharedWorker' in w),
            isItGecko && /android/i.test(navigator.appVersion),
        ]) >= 2);
    }

    /**
     * A deep description: https://fingerprintjs.com/blog/audio-fingerprinting/
     * Inspired by and based on https://github.com/cozylife/audio-fingerprint
     */
    function getAudioFingerprint() {
        var w = window;
        var AudioContext = w.OfflineAudioContext || w.webkitOfflineAudioContext;
        if (!AudioContext) {
            return -2 /* NotSupported */;
        }
        // In some browsers, audio context always stays suspended unless the context is started in response to a user action
        // (e.g. a click or a tap). It prevents audio fingerprint from being taken at an arbitrary moment of time.
        // Such browsers are old and unpopular, so the audio fingerprinting is just skipped in them.
        // See a similar case explanation at https://stackoverflow.com/questions/46363048/onaudioprocess-not-called-on-ios11#46534088
        if (doesCurrentBrowserSuspendAudioContext()) {
            return -1 /* KnownToSuspend */;
        }
        var hashFromIndex = 4500;
        var hashToIndex = 5000;
        var context = new AudioContext(1, hashToIndex, 44100);
        var oscillator = context.createOscillator();
        oscillator.type = 'triangle';
        oscillator.frequency.value = 10000;
        var compressor = context.createDynamicsCompressor();
        compressor.threshold.value = -50;
        compressor.knee.value = 40;
        compressor.ratio.value = 12;
        compressor.attack.value = 0;
        compressor.release.value = 0.25;
        oscillator.connect(compressor);
        compressor.connect(context.destination);
        oscillator.start(0);
        var _a = startRenderingAudio(context), renderPromise = _a[0], finishRendering = _a[1];
        var fingerprintPromise = renderPromise.then(function (buffer) { return getHash(buffer.getChannelData(0).subarray(hashFromIndex)); }, function (error) {
            if (error.name === "timeout" /* Timeout */ || error.name === "suspended" /* Suspended */) {
                return -3 /* Timeout */;
            }
            throw error;
        });
        // Suppresses the console error message in case when the fingerprint fails before requested
        fingerprintPromise.catch(function () { return undefined; });
        return function () {
            finishRendering();
            return fingerprintPromise;
        };
    }
    /**
     * Checks if the current browser is known to always suspend audio context
     */
    function doesCurrentBrowserSuspendAudioContext() {
        return isWebKit() && !isDesktopSafari() && !isWebKit606OrNewer();
    }
    /**
     * Starts rendering the audio context.
     * When the returned function is called, the render process starts finishing.
     */
    function startRenderingAudio(context) {
        var renderTryMaxCount = 3;
        var renderRetryDelay = 500;
        var runningMaxAwaitTime = 500;
        var runningSufficientTime = 5000;
        var finalize = function () { return undefined; };
        var resultPromise = new Promise(function (resolve, reject) {
            var isFinalized = false;
            var renderTryCount = 0;
            var startedRunningAt = 0;
            context.oncomplete = function (event) { return resolve(event.renderedBuffer); };
            var startRunningTimeout = function () {
                setTimeout(function () { return reject(makeInnerError("timeout" /* Timeout */)); }, Math.min(runningMaxAwaitTime, startedRunningAt + runningSufficientTime - Date.now()));
            };
            var tryRender = function () {
                try {
                    context.startRendering();
                    switch (context.state) {
                        case 'running':
                            startedRunningAt = Date.now();
                            if (isFinalized) {
                                startRunningTimeout();
                            }
                            break;
                        // Sometimes the audio context doesn't start after calling `startRendering` (in addition to the cases where
                        // audio context doesn't start at all). A known case is starting an audio context when the browser tab is in
                        // background on iPhone. Retries usually help in this case.
                        case 'suspended':
                            // The audio context can reject starting until the tab is in foreground. Long fingerprint duration
                            // in background isn't a problem, therefore the retry attempts don't count in background. It can lead to
                            // a situation when a fingerprint takes very long time and finishes successfully. FYI, the audio context
                            // can be suspended when `document.hidden === false` and start running after a retry.
                            if (!document.hidden) {
                                renderTryCount++;
                            }
                            if (isFinalized && renderTryCount >= renderTryMaxCount) {
                                reject(makeInnerError("suspended" /* Suspended */));
                            }
                            else {
                                setTimeout(tryRender, renderRetryDelay);
                            }
                            break;
                    }
                }
                catch (error) {
                    reject(error);
                }
            };
            tryRender();
            finalize = function () {
                if (!isFinalized) {
                    isFinalized = true;
                    if (startedRunningAt > 0) {
                        startRunningTimeout();
                    }
                }
            };
        });
        return [resultPromise, finalize];
    }
    function getHash(signal) {
        var hash = 0;
        for (var i = 0; i < signal.length; ++i) {
            hash += Math.abs(signal[i]);
        }
        return hash;
    }
    function makeInnerError(name) {
        var error = new Error(name);
        error.name = name;
        return error;
    }

    /**
     * Creates and keeps an invisible iframe while the given function runs.
     * The given function is called when the iframe is loaded and has a body.
     * The iframe allows to measure DOM sizes inside itself.
     *
     * Notice: passing an initial HTML code doesn't work in IE.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function withIframe(action, initialHtml, domPollInterval) {
        var _a, _b, _c;
        if (domPollInterval === void 0) { domPollInterval = 50; }
        return __awaiter(this, void 0, void 0, function () {
            var d, iframe;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        d = document;
                        _d.label = 1;
                    case 1:
                        if (!!d.body) return [3 /*break*/, 3];
                        return [4 /*yield*/, wait(domPollInterval)];
                    case 2:
                        _d.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        iframe = d.createElement('iframe');
                        _d.label = 4;
                    case 4:
                        _d.trys.push([4, , 10, 11]);
                        return [4 /*yield*/, new Promise(function (_resolve, _reject) {
                                var isComplete = false;
                                var resolve = function () {
                                    isComplete = true;
                                    _resolve();
                                };
                                var reject = function (error) {
                                    isComplete = true;
                                    _reject(error);
                                };
                                iframe.onload = resolve;
                                iframe.onerror = reject;
                                var style = iframe.style;
                                style.setProperty('display', 'block', 'important'); // Required for browsers to calculate the layout
                                style.position = 'absolute';
                                style.top = '0';
                                style.left = '0';
                                style.visibility = 'hidden';
                                if (initialHtml && 'srcdoc' in iframe) {
                                    iframe.srcdoc = initialHtml;
                                }
                                else {
                                    iframe.src = 'about:blank';
                                }
                                d.body.appendChild(iframe);
                                // WebKit in WeChat doesn't fire the iframe's `onload` for some reason.
                                // This code checks for the loading state manually.
                                // See https://github.com/fingerprintjs/fingerprintjs/issues/645
                                var checkReadyState = function () {
                                    var _a, _b;
                                    // The ready state may never become 'complete' in Firefox despite the 'load' event being fired.
                                    // So an infinite setTimeout loop can happen without this check.
                                    // See https://github.com/fingerprintjs/fingerprintjs/pull/716#issuecomment-986898796
                                    if (isComplete) {
                                        return;
                                    }
                                    // Make sure iframe.contentWindow and iframe.contentWindow.document are both loaded
                                    // The contentWindow.document can miss in JSDOM (https://github.com/jsdom/jsdom).
                                    if (((_b = (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.readyState) === 'complete') {
                                        resolve();
                                    }
                                    else {
                                        setTimeout(checkReadyState, 10);
                                    }
                                };
                                checkReadyState();
                            })];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6:
                        if (!!((_b = (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.body)) return [3 /*break*/, 8];
                        return [4 /*yield*/, wait(domPollInterval)];
                    case 7:
                        _d.sent();
                        return [3 /*break*/, 6];
                    case 8: return [4 /*yield*/, action(iframe, iframe.contentWindow)];
                    case 9: return [2 /*return*/, _d.sent()];
                    case 10:
                        (_c = iframe.parentNode) === null || _c === void 0 ? void 0 : _c.removeChild(iframe);
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    }
    /**
     * Creates a DOM element that matches the given selector.
     * Only single element selector are supported (without operators like space, +, >, etc).
     */
    function selectorToElement(selector) {
        var _a = parseSimpleCssSelector(selector), tag = _a[0], attributes = _a[1];
        var element = document.createElement(tag !== null && tag !== void 0 ? tag : 'div');
        for (var _i = 0, _b = Object.keys(attributes); _i < _b.length; _i++) {
            var name_1 = _b[_i];
            var value = attributes[name_1].join(' ');
            // Changing the `style` attribute can cause a CSP error, therefore we change the `style.cssText` property.
            // https://github.com/fingerprintjs/fingerprintjs/issues/733
            if (name_1 === 'style') {
                addStyleString(element.style, value);
            }
            else {
                element.setAttribute(name_1, value);
            }
        }
        return element;
    }
    /**
     * Adds CSS styles from a string in such a way that doesn't trigger a CSP warning (unsafe-inline or unsafe-eval)
     */
    function addStyleString(style, source) {
        // We don't use `style.cssText` because browsers must block it when no `unsafe-eval` CSP is presented: https://csplite.com/csp145/#w3c_note
        // Even though the browsers ignore this standard, we don't use `cssText` just in case.
        for (var _i = 0, _a = source.split(';'); _i < _a.length; _i++) {
            var property = _a[_i];
            var match = /^\s*([\w-]+)\s*:\s*(.+?)(\s*!([\w-]+))?\s*$/.exec(property);
            if (match) {
                var name_2 = match[1], value = match[2], priority = match[4];
                style.setProperty(name_2, value, priority || ''); // The last argument can't be undefined in IE11
            }
        }
    }

    // We use m or w because these two characters take up the maximum width.
    // And we use a LLi so that the same matching fonts can get separated.
    var testString = 'mmMwWLliI0O&1';
    // We test using 48px font size, we may use any size. I guess larger the better.
    var textSize = '48px';
    // A font will be compared against all the three default fonts.
    // And if for any default fonts it doesn't match, then that font is available.
    var baseFonts = ['monospace', 'sans-serif', 'serif'];
    var fontList = [
        // This is android-specific font from "Roboto" family
        'sans-serif-thin',
        'ARNO PRO',
        'Agency FB',
        'Arabic Typesetting',
        'Arial Unicode MS',
        'AvantGarde Bk BT',
        'BankGothic Md BT',
        'Batang',
        'Bitstream Vera Sans Mono',
        'Calibri',
        'Century',
        'Century Gothic',
        'Clarendon',
        'EUROSTILE',
        'Franklin Gothic',
        'Futura Bk BT',
        'Futura Md BT',
        'GOTHAM',
        'Gill Sans',
        'HELV',
        'Haettenschweiler',
        'Helvetica Neue',
        'Humanst521 BT',
        'Leelawadee',
        'Letter Gothic',
        'Levenim MT',
        'Lucida Bright',
        'Lucida Sans',
        'Menlo',
        'MS Mincho',
        'MS Outlook',
        'MS Reference Specialty',
        'MS UI Gothic',
        'MT Extra',
        'MYRIAD PRO',
        'Marlett',
        'Meiryo UI',
        'Microsoft Uighur',
        'Minion Pro',
        'Monotype Corsiva',
        'PMingLiU',
        'Pristina',
        'SCRIPTINA',
        'Segoe UI Light',
        'Serifa',
        'SimHei',
        'Small Fonts',
        'Staccato222 BT',
        'TRAJAN PRO',
        'Univers CE 55 Medium',
        'Vrinda',
        'ZWAdobeF',
    ];
    // kudos to http://www.lalit.org/lab/javascript-css-font-detect/
    function getFonts() {
        // Running the script in an iframe makes it not affect the page look and not be affected by the page CSS. See:
        // https://github.com/fingerprintjs/fingerprintjs/issues/592
        // https://github.com/fingerprintjs/fingerprintjs/issues/628
        return withIframe(function (_, _a) {
            var document = _a.document;
            var holder = document.body;
            holder.style.fontSize = textSize;
            // div to load spans for the default fonts and the fonts to detect
            var spansContainer = document.createElement('div');
            var defaultWidth = {};
            var defaultHeight = {};
            // creates a span where the fonts will be loaded
            var createSpan = function (fontFamily) {
                var span = document.createElement('span');
                var style = span.style;
                style.position = 'absolute';
                style.top = '0';
                style.left = '0';
                style.fontFamily = fontFamily;
                span.textContent = testString;
                spansContainer.appendChild(span);
                return span;
            };
            // creates a span and load the font to detect and a base font for fallback
            var createSpanWithFonts = function (fontToDetect, baseFont) {
                return createSpan("'" + fontToDetect + "'," + baseFont);
            };
            // creates spans for the base fonts and adds them to baseFontsDiv
            var initializeBaseFontsSpans = function () {
                return baseFonts.map(createSpan);
            };
            // creates spans for the fonts to detect and adds them to fontsDiv
            var initializeFontsSpans = function () {
                // Stores {fontName : [spans for that font]}
                var spans = {};
                var _loop_1 = function (font) {
                    spans[font] = baseFonts.map(function (baseFont) { return createSpanWithFonts(font, baseFont); });
                };
                for (var _i = 0, fontList_1 = fontList; _i < fontList_1.length; _i++) {
                    var font = fontList_1[_i];
                    _loop_1(font);
                }
                return spans;
            };
            // checks if a font is available
            var isFontAvailable = function (fontSpans) {
                return baseFonts.some(function (baseFont, baseFontIndex) {
                    return fontSpans[baseFontIndex].offsetWidth !== defaultWidth[baseFont] ||
                        fontSpans[baseFontIndex].offsetHeight !== defaultHeight[baseFont];
                });
            };
            // create spans for base fonts
            var baseFontsSpans = initializeBaseFontsSpans();
            // create spans for fonts to detect
            var fontsSpans = initializeFontsSpans();
            // add all the spans to the DOM
            holder.appendChild(spansContainer);
            // get the default width for the three base fonts
            for (var index = 0; index < baseFonts.length; index++) {
                defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth; // width for the default font
                defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight; // height for the default font
            }
            // check available fonts
            return fontList.filter(function (font) { return isFontAvailable(fontsSpans[font]); });
        });
    }

    function getPlugins() {
        var rawPlugins = navigator.plugins;
        if (!rawPlugins) {
            return undefined;
        }
        var plugins = [];
        // Safari 10 doesn't support iterating navigator.plugins with for...of
        for (var i = 0; i < rawPlugins.length; ++i) {
            var plugin = rawPlugins[i];
            if (!plugin) {
                continue;
            }
            var mimeTypes = [];
            for (var j = 0; j < plugin.length; ++j) {
                var mimeType = plugin[j];
                mimeTypes.push({
                    type: mimeType.type,
                    suffixes: mimeType.suffixes,
                });
            }
            plugins.push({
                name: plugin.name,
                description: plugin.description,
                mimeTypes: mimeTypes,
            });
        }
        return plugins;
    }

    // https://www.browserleaks.com/canvas#how-does-it-work
    function getCanvasFingerprint() {
        var _a = makeCanvasContext(), canvas = _a[0], context = _a[1];
        if (!isSupported(canvas, context)) {
            return { winding: false, geometry: '', text: '' };
        }
        return {
            winding: doesSupportWinding(context),
            geometry: makeGeometryImage(canvas, context),
            // Text is unstable:
            // https://github.com/fingerprintjs/fingerprintjs/issues/583
            // https://github.com/fingerprintjs/fingerprintjs/issues/103
            // Therefore it's extracted into a separate image.
            text: makeTextImage(canvas, context),
        };
    }
    function makeCanvasContext() {
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return [canvas, canvas.getContext('2d')];
    }
    function isSupported(canvas, context) {
        // TODO: look into: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
        return !!(context && canvas.toDataURL);
    }
    function doesSupportWinding(context) {
        // https://web.archive.org/web/20170825024655/http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
        // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
        context.rect(0, 0, 10, 10);
        context.rect(2, 2, 6, 6);
        return !context.isPointInPath(5, 5, 'evenodd');
    }
    function makeTextImage(canvas, context) {
        // Resizing the canvas cleans it
        canvas.width = 240;
        canvas.height = 60;
        context.textBaseline = 'alphabetic';
        context.fillStyle = '#f60';
        context.fillRect(100, 1, 62, 20);
        context.fillStyle = '#069';
        // It's important to use explicit built-in fonts in order to exclude the affect of font preferences
        // (there is a separate entropy source for them).
        context.font = '11pt "Times New Roman"';
        // The choice of emojis has a gigantic impact on rendering performance (especially in FF).
        // Some newer emojis cause it to slow down 50-200 times.
        // There must be no text to the right of the emoji, see https://github.com/fingerprintjs/fingerprintjs/issues/574
        // A bare emoji shouldn't be used because the canvas will change depending on the script encoding:
        // https://github.com/fingerprintjs/fingerprintjs/issues/66
        // Escape sequence shouldn't be used too because Terser will turn it into a bare unicode.
        var printedText = "Cwm fjordbank gly " + String.fromCharCode(55357, 56835) /* 😃 */;
        context.fillText(printedText, 2, 15);
        context.fillStyle = 'rgba(102, 204, 0, 0.2)';
        context.font = '18pt Arial';
        context.fillText(printedText, 4, 45);
        return save(canvas);
    }
    function makeGeometryImage(canvas, context) {
        // Resizing the canvas cleans it
        canvas.width = 122;
        canvas.height = 110;
        // Canvas blending
        // https://web.archive.org/web/20170826194121/http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
        // http://jsfiddle.net/NDYV8/16/
        context.globalCompositeOperation = 'multiply';
        for (var _i = 0, _a = [
            ['#f2f', 40, 40],
            ['#2ff', 80, 40],
            ['#ff2', 60, 80],
        ]; _i < _a.length; _i++) {
            var _b = _a[_i], color = _b[0], x = _b[1], y = _b[2];
            context.fillStyle = color;
            context.beginPath();
            context.arc(x, y, 40, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
        }
        // Canvas winding
        // https://web.archive.org/web/20130913061632/http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
        // http://jsfiddle.net/NDYV8/19/
        context.fillStyle = '#f9c';
        context.arc(60, 60, 60, 0, Math.PI * 2, true);
        context.arc(60, 60, 20, 0, Math.PI * 2, true);
        context.fill('evenodd');
        return save(canvas);
    }
    function save(canvas) {
        // TODO: look into: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
        return canvas.toDataURL();
    }

    /**
     * This is a crude and primitive touch screen detection. It's not possible to currently reliably detect the availability
     * of a touch screen with a JS, without actually subscribing to a touch event.
     *
     * @see http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
     * @see https://github.com/Modernizr/Modernizr/issues/548
     */
    function getTouchSupport() {
        var n = navigator;
        var maxTouchPoints = 0;
        var touchEvent;
        if (n.maxTouchPoints !== undefined) {
            maxTouchPoints = toInt(n.maxTouchPoints);
        }
        else if (n.msMaxTouchPoints !== undefined) {
            maxTouchPoints = n.msMaxTouchPoints;
        }
        try {
            document.createEvent('TouchEvent');
            touchEvent = true;
        }
        catch (_a) {
            touchEvent = false;
        }
        var touchStart = 'ontouchstart' in window;
        return {
            maxTouchPoints: maxTouchPoints,
            touchEvent: touchEvent,
            touchStart: touchStart,
        };
    }

    function getOsCpu() {
        return navigator.oscpu;
    }

    function getLanguages() {
        var n = navigator;
        var result = [];
        var language = n.language || n.userLanguage || n.browserLanguage || n.systemLanguage;
        if (language !== undefined) {
            result.push([language]);
        }
        if (Array.isArray(n.languages)) {
            // Starting from Chromium 86, there is only a single value in `navigator.language` in Incognito mode:
            // the value of `navigator.language`. Therefore the value is ignored in this browser.
            if (!(isChromium() && isChromium86OrNewer())) {
                result.push(n.languages);
            }
        }
        else if (typeof n.languages === 'string') {
            var languages = n.languages;
            if (languages) {
                result.push(languages.split(','));
            }
        }
        return result;
    }

    function getColorDepth() {
        return window.screen.colorDepth;
    }

    function getDeviceMemory() {
        // `navigator.deviceMemory` is a string containing a number in some unidentified cases
        return replaceNaN(toFloat(navigator.deviceMemory), undefined);
    }

    function getScreenResolution() {
        var s = screen;
        // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
        // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
        // Some browsers even return  screen resolution as not numbers.
        var parseDimension = function (value) { return replaceNaN(toInt(value), null); };
        var dimensions = [parseDimension(s.width), parseDimension(s.height)];
        dimensions.sort().reverse();
        return dimensions;
    }

    var screenFrameCheckInterval = 2500;
    var roundingPrecision = 10;
    // The type is readonly to protect from unwanted mutations
    var screenFrameBackup;
    var screenFrameSizeTimeoutId;
    /**
     * Starts watching the screen frame size. When a non-zero size appears, the size is saved and the watch is stopped.
     * Later, when `getScreenFrame` runs, it will return the saved non-zero size if the current size is null.
     *
     * This trick is required to mitigate the fact that the screen frame turns null in some cases.
     * See more on this at https://github.com/fingerprintjs/fingerprintjs/issues/568
     */
    function watchScreenFrame() {
        if (screenFrameSizeTimeoutId !== undefined) {
            return;
        }
        var checkScreenFrame = function () {
            var frameSize = getCurrentScreenFrame();
            if (isFrameSizeNull(frameSize)) {
                screenFrameSizeTimeoutId = setTimeout(checkScreenFrame, screenFrameCheckInterval);
            }
            else {
                screenFrameBackup = frameSize;
                screenFrameSizeTimeoutId = undefined;
            }
        };
        checkScreenFrame();
    }
    function getScreenFrame() {
        var _this = this;
        watchScreenFrame();
        return function () { return __awaiter(_this, void 0, void 0, function () {
            var frameSize;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        frameSize = getCurrentScreenFrame();
                        if (!isFrameSizeNull(frameSize)) return [3 /*break*/, 2];
                        if (screenFrameBackup) {
                            return [2 /*return*/, __spreadArrays(screenFrameBackup)];
                        }
                        if (!getFullscreenElement()) return [3 /*break*/, 2];
                        // Some browsers set the screen frame to zero when programmatic fullscreen is on.
                        // There is a chance of getting a non-zero frame after exiting the fullscreen.
                        // See more on this at https://github.com/fingerprintjs/fingerprintjs/issues/568
                        return [4 /*yield*/, exitFullscreen()];
                    case 1:
                        // Some browsers set the screen frame to zero when programmatic fullscreen is on.
                        // There is a chance of getting a non-zero frame after exiting the fullscreen.
                        // See more on this at https://github.com/fingerprintjs/fingerprintjs/issues/568
                        _a.sent();
                        frameSize = getCurrentScreenFrame();
                        _a.label = 2;
                    case 2:
                        if (!isFrameSizeNull(frameSize)) {
                            screenFrameBackup = frameSize;
                        }
                        return [2 /*return*/, frameSize];
                }
            });
        }); };
    }
    /**
     * Sometimes the available screen resolution changes a bit, e.g. 1900x1440 → 1900x1439. A possible reason: macOS Dock
     * shrinks to fit more icons when there is too little space. The rounding is used to mitigate the difference.
     */
    function getRoundedScreenFrame() {
        var _this = this;
        var screenFrameGetter = getScreenFrame();
        return function () { return __awaiter(_this, void 0, void 0, function () {
            var frameSize, processSize;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, screenFrameGetter()];
                    case 1:
                        frameSize = _a.sent();
                        processSize = function (sideSize) {
                            return sideSize === null ? null : round(sideSize, roundingPrecision);
                        };
                        // It might look like I don't know about `for` and `map`.
                        // In fact, such code is used to avoid TypeScript issues without using `as`.
                        return [2 /*return*/, [processSize(frameSize[0]), processSize(frameSize[1]), processSize(frameSize[2]), processSize(frameSize[3])]];
                }
            });
        }); };
    }
    function getCurrentScreenFrame() {
        var s = screen;
        // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
        // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
        //
        // Some browsers (IE, Edge ≤18) don't provide `screen.availLeft` and `screen.availTop`. The property values are
        // replaced with 0 in such cases to not lose the entropy from `screen.availWidth` and `screen.availHeight`.
        return [
            replaceNaN(toFloat(s.availTop), null),
            replaceNaN(toFloat(s.width) - toFloat(s.availWidth) - replaceNaN(toFloat(s.availLeft), 0), null),
            replaceNaN(toFloat(s.height) - toFloat(s.availHeight) - replaceNaN(toFloat(s.availTop), 0), null),
            replaceNaN(toFloat(s.availLeft), null),
        ];
    }
    function isFrameSizeNull(frameSize) {
        for (var i = 0; i < 4; ++i) {
            if (frameSize[i]) {
                return false;
            }
        }
        return true;
    }

    function getHardwareConcurrency() {
        // sometimes hardware concurrency is a string
        return replaceNaN(toInt(navigator.hardwareConcurrency), undefined);
    }

    function getTimezone() {
        var _a;
        var DateTimeFormat = (_a = window.Intl) === null || _a === void 0 ? void 0 : _a.DateTimeFormat;
        if (DateTimeFormat) {
            var timezone = new DateTimeFormat().resolvedOptions().timeZone;
            if (timezone) {
                return timezone;
            }
        }
        // For browsers that don't support timezone names
        // The minus is intentional because the JS offset is opposite to the real offset
        var offset = -getTimezoneOffset();
        return "UTC" + (offset >= 0 ? '+' : '') + Math.abs(offset);
    }
    function getTimezoneOffset() {
        var currentYear = new Date().getFullYear();
        // The timezone offset may change over time due to daylight saving time (DST) shifts.
        // The non-DST timezone offset is used as the result timezone offset.
        // Since the DST season differs in the northern and the southern hemispheres,
        // both January and July timezones offsets are considered.
        return Math.max(
        // `getTimezoneOffset` returns a number as a string in some unidentified cases
        toFloat(new Date(currentYear, 0, 1).getTimezoneOffset()), toFloat(new Date(currentYear, 6, 1).getTimezoneOffset()));
    }

    function getSessionStorage() {
        try {
            return !!window.sessionStorage;
        }
        catch (error) {
            /* SecurityError when referencing it means it exists */
            return true;
        }
    }

    // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
    function getLocalStorage() {
        try {
            return !!window.localStorage;
        }
        catch (e) {
            /* SecurityError when referencing it means it exists */
            return true;
        }
    }

    function getIndexedDB() {
        // IE and Edge don't allow accessing indexedDB in private mode, therefore IE and Edge will have different
        // visitor identifier in normal and private modes.
        if (isTrident() || isEdgeHTML()) {
            return undefined;
        }
        try {
            return !!window.indexedDB;
        }
        catch (e) {
            /* SecurityError when referencing it means it exists */
            return true;
        }
    }

    function getOpenDatabase() {
        return !!window.openDatabase;
    }

    function getCpuClass() {
        return navigator.cpuClass;
    }

    function getPlatform() {
        // Android Chrome 86 and 87 and Android Firefox 80 and 84 don't mock the platform value when desktop mode is requested
        var platform = navigator.platform;
        // iOS mocks the platform value when desktop version is requested: https://github.com/fingerprintjs/fingerprintjs/issues/514
        // iPad uses desktop mode by default since iOS 13
        // The value is 'MacIntel' on M1 Macs
        // The value is 'iPhone' on iPod Touch
        if (platform === 'MacIntel') {
            if (isWebKit() && !isDesktopSafari()) {
                return isIPad() ? 'iPad' : 'iPhone';
            }
        }
        return platform;
    }

    function getVendor() {
        return navigator.vendor || '';
    }

    /**
     * Checks for browser-specific (not engine specific) global variables to tell browsers with the same engine apart.
     * Only somewhat popular browsers are considered.
     */
    function getVendorFlavors() {
        var flavors = [];
        for (var _i = 0, _a = [
            // Blink and some browsers on iOS
            'chrome',
            // Safari on macOS
            'safari',
            // Chrome on iOS (checked in 85 on 13 and 87 on 14)
            '__crWeb',
            '__gCrWeb',
            // Yandex Browser on iOS, macOS and Android (checked in 21.2 on iOS 14, macOS and Android)
            'yandex',
            // Yandex Browser on iOS (checked in 21.2 on 14)
            '__yb',
            '__ybro',
            // Firefox on iOS (checked in 32 on 14)
            '__firefox__',
            // Edge on iOS (checked in 46 on 14)
            '__edgeTrackingPreventionStatistics',
            'webkit',
            // Opera Touch on iOS (checked in 2.6 on 14)
            'oprt',
            // Samsung Internet on Android (checked in 11.1)
            'samsungAr',
            // UC Browser on Android (checked in 12.10 and 13.0)
            'ucweb',
            'UCShellJava',
            // Puffin on Android (checked in 9.0)
            'puffinDevice',
        ]; _i < _a.length; _i++) {
            var key = _a[_i];
            var value = window[key];
            if (value && typeof value === 'object') {
                flavors.push(key);
            }
        }
        return flavors.sort();
    }

    /**
     * navigator.cookieEnabled cannot detect custom or nuanced cookie blocking configurations. For example, when blocking
     * cookies via the Advanced Privacy Settings in IE9, it always returns true. And there have been issues in the past with
     * site-specific exceptions. Don't rely on it.
     *
     * @see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js Taken from here
     */
    function areCookiesEnabled() {
        var d = document;
        // Taken from here: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js
        // navigator.cookieEnabled cannot detect custom or nuanced cookie blocking configurations. For example, when blocking
        // cookies via the Advanced Privacy Settings in IE9, it always returns true. And there have been issues in the past
        // with site-specific exceptions. Don't rely on it.
        // try..catch because some in situations `document.cookie` is exposed but throws a
        // SecurityError if you try to access it; e.g. documents created from data URIs
        // or in sandboxed iframes (depending on flags/context)
        try {
            // Create cookie
            d.cookie = 'cookietest=1; SameSite=Strict;';
            var result = d.cookie.indexOf('cookietest=') !== -1;
            // Delete cookie
            d.cookie = 'cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT';
            return result;
        }
        catch (e) {
            return false;
        }
    }

    /**
     * Only single element selector are supported (no operators like space, +, >, etc).
     * `embed` and `position: fixed;` will be considered as blocked anyway because it always has no offsetParent.
     * Avoid `iframe` and anything with `[src=]` because they produce excess HTTP requests.
     *
     * See docs/content_blockers.md to learn how to make the list
     */
    var filters = {
        abpIndo: [
            '#Iklan-Melayang',
            '#Kolom-Iklan-728',
            '#SidebarIklan-wrapper',
            'a[title="7naga poker" i]',
            '[title="ALIENBOLA" i]',
        ],
        abpvn: [
            '#quangcaomb',
            '.iosAdsiosAds-layout',
            '.quangcao',
            '[href^="https://r88.vn/"]',
            '[href^="https://zbet.vn/"]',
        ],
        adBlockFinland: [
            '.mainostila',
            '.sponsorit',
            '.ylamainos',
            'a[href*="/clickthrgh.asp?"]',
            'a[href^="https://app.readpeak.com/ads"]',
        ],
        adBlockPersian: [
            '#navbar_notice_50',
            'a[href^="http://g1.v.fwmrm.net/ad/"]',
            '.kadr',
            'TABLE[width="140px"]',
            '#divAgahi',
        ],
        adBlockWarningRemoval: ['#adblock-honeypot', '.adblocker-root', '.wp_adblock_detect'],
        adGuardAnnoyances: ['amp-embed[type="zen"]', '.hs-sosyal', '#cookieconsentdiv', 'div[class^="app_gdpr"]', '.as-oil'],
        adGuardBase: ['#ad-after', '#ad-p3', '.BetterJsPopOverlay', '#ad_300X250', '#bannerfloat22'],
        adGuardChinese: [
            // Disabled because not reproducible. Will be replaced during the next filter update.
            // '#piao_div_0[style*="width:140px;"]',
            'a[href*=".ttz5.cn"]',
            'a[href*=".yabovip2027.com/"]',
            '.tm3all2h4b',
            '.cc5278_banner_ad',
        ],
        adGuardFrench: [
            '.zonepub',
            '[class*="_adLeaderboard"]',
            '[id^="block-xiti_oas-"]',
            'a[href^="http://ptapjmp.com/"]',
            'a[href^="https://go.alvexo.com/"]',
        ],
        adGuardGerman: [
            '.banneritemwerbung_head_1',
            '.boxstartwerbung',
            '.werbung3',
            'a[href^="http://www.eis.de/index.phtml?refid="]',
            'a[href^="https://www.tipico.com/?affiliateId="]',
        ],
        adGuardJapanese: [
            '#kauli_yad_1',
            '#ad-giftext',
            '#adsSPRBlock',
            'a[href^="http://ad2.trafficgate.net/"]',
            'a[href^="http://www.rssad.jp/"]',
        ],
        adGuardMobile: ['amp-auto-ads', '#mgid_iframe', '.amp_ad', 'amp-embed[type="24smi"]', '#mgid_iframe1'],
        adGuardRussian: [
            'a[href^="https://ya-distrib.ru/r/"]',
            'a[href^="https://ad.letmeads.com/"]',
            '.reclama',
            'div[id^="smi2adblock"]',
            'div[id^="AdFox_banner_"]',
        ],
        adGuardSocial: [
            'a[href^="//www.stumbleupon.com/submit?url="]',
            'a[href^="//telegram.me/share/url?"]',
            '.etsy-tweet',
            '#inlineShare',
            '.popup-social',
        ],
        adGuardSpanishPortuguese: [
            '#barraPublicidade',
            '#Publicidade',
            '#publiEspecial',
            '#queTooltip',
            '[href^="http://ads.glispa.com/"]',
        ],
        adGuardTrackingProtection: [
            'amp-embed[type="taboola"]',
            '#qoo-counter',
            'a[href^="http://click.hotlog.ru/"]',
            'a[href^="http://hitcounter.ru/top/stat.php"]',
            'a[href^="http://top.mail.ru/jump"]',
        ],
        adGuardTurkish: [
            '#backkapat',
            '#reklami',
            'a[href^="http://adserv.ontek.com.tr/"]',
            'a[href^="http://izlenzi.com/campaign/"]',
            'a[href^="http://www.installads.net/"]',
        ],
        bulgarian: ['td#freenet_table_ads', '#adbody', '#ea_intext_div', '.lapni-pop-over', '#xenium_hot_offers'],
        easyList: ['#AD_banner_bottom', '#Ads_google_02', '#N-ad-article-rightRail-1', '#ad-fullbanner2', '#ad-zone-2'],
        easyListChina: [
            'a[href*=".wensixuetang.com/"]',
            'A[href*="/hth107.com/"]',
            '.appguide-wrap[onclick*="bcebos.com"]',
            '.frontpageAdvM',
            '#taotaole',
        ],
        easyListCookie: ['#adtoniq-msg-bar', '#CoockiesPage', '#CookieModal_cookiemodal', '#DO_CC_PANEL', '#ShowCookie'],
        easyListCzechSlovak: ['#onlajny-stickers', '#reklamni-box', '.reklama-megaboard', '.sklik', '[id^="sklikReklama"]'],
        easyListDutch: [
            '#advertentie',
            '#vipAdmarktBannerBlock',
            '.adstekst',
            'a[href^="https://xltube.nl/click/"]',
            '#semilo-lrectangle',
        ],
        easyListGermany: [
            'a[href^="http://www.hw-area.com/?dp="]',
            'a[href^="https://ads.sunmaker.com/tracking.php?"]',
            '.werbung-skyscraper2',
            '.bannergroup_werbung',
            '.ads_rechts',
        ],
        easyListItaly: [
            '.box_adv_annunci',
            '.sb-box-pubbliredazionale',
            'a[href^="http://affiliazioniads.snai.it/"]',
            'a[href^="https://adserver.html.it/"]',
            'a[href^="https://affiliazioniads.snai.it/"]',
        ],
        easyListLithuania: [
            '.reklamos_tarpas',
            '.reklamos_nuorodos',
            'img[alt="Reklaminis skydelis"]',
            'img[alt="Dedikuoti.lt serveriai"]',
            'img[alt="Hostingas Serveriai.lt"]',
        ],
        estonian: ['A[href*="http://pay4results24.eu"]'],
        fanboyAnnoyances: [
            '#feedback-tab',
            '#taboola-below-article',
            '.feedburnerFeedBlock',
            '.widget-feedburner-counter',
            '[title="Subscribe to our blog"]',
        ],
        fanboyAntiFacebook: ['.util-bar-module-firefly-visible'],
        fanboyEnhancedTrackers: [
            '.open.pushModal',
            '#issuem-leaky-paywall-articles-zero-remaining-nag',
            '#sovrn_container',
            'div[class$="-hide"][zoompage-fontsize][style="display: block;"]',
            '.BlockNag__Card',
        ],
        fanboySocial: [
            '.td-tags-and-social-wrapper-box',
            '.twitterContainer',
            '.youtube-social',
            'a[title^="Like us on Facebook"]',
            'img[alt^="Share on Digg"]',
        ],
        frellwitSwedish: [
            'a[href*="casinopro.se"][target="_blank"]',
            'a[href*="doktor-se.onelink.me"]',
            'article.category-samarbete',
            'div.holidAds',
            'ul.adsmodern',
        ],
        greekAdBlock: [
            'A[href*="adman.otenet.gr/click?"]',
            'A[href*="http://axiabanners.exodus.gr/"]',
            'A[href*="http://interactive.forthnet.gr/click?"]',
            'DIV.agores300',
            'TABLE.advright',
        ],
        hungarian: [
            'A[href*="ad.eval.hu"]',
            'A[href*="ad.netmedia.hu"]',
            'A[href*="daserver.ultraweb.hu"]',
            '#cemp_doboz',
            '.optimonk-iframe-container',
        ],
        iDontCareAboutCookies: [
            '.alert-info[data-block-track*="CookieNotice"]',
            '.ModuleTemplateCookieIndicator',
            '.o--cookies--container',
            '.cookie-msg-info-container',
            '#cookies-policy-sticky',
        ],
        icelandicAbp: ['A[href^="/framework/resources/forms/ads.aspx"]'],
        latvian: [
            'a[href="http://www.salidzini.lv/"][style="display: block; width: 120px; height: 40px; overflow: hidden; position: relative;"]',
            'a[href="http://www.salidzini.lv/"][style="display: block; width: 88px; height: 31px; overflow: hidden; position: relative;"]',
        ],
        listKr: [
            'a[href*="//kingtoon.slnk.kr"]',
            'a[href*="//playdsb.com/kr"]',
            'div.logly-lift-adz',
            'div[data-widget_id="ml6EJ074"]',
            'ins.daum_ddn_area',
        ],
        listeAr: [
            '.geminiLB1Ad',
            '.right-and-left-sponsers',
            'a[href*=".aflam.info"]',
            'a[href*="booraq.org"]',
            'a[href*="dubizzle.com/ar/?utm_source="]',
        ],
        listeFr: [
            'a[href^="http://promo.vador.com/"]',
            '#adcontainer_recherche',
            'a[href*="weborama.fr/fcgi-bin/"]',
            '.site-pub-interstitiel',
            'div[id^="crt-"][data-criteo-id]',
        ],
        officialPolish: [
            '#ceneo-placeholder-ceneo-12',
            '[href^="https://aff.sendhub.pl/"]',
            'a[href^="http://advmanager.techfun.pl/redirect/"]',
            'a[href^="http://www.trizer.pl/?utm_source"]',
            'div#skapiec_ad',
        ],
        ro: [
            'a[href^="//afftrk.altex.ro/Counter/Click"]',
            'a[href^="/magazin/"]',
            'a[href^="https://blackfridaysales.ro/trk/shop/"]',
            'a[href^="https://event.2performant.com/events/click"]',
            'a[href^="https://l.profitshare.ro/"]',
        ],
        ruAd: [
            'a[href*="//febrare.ru/"]',
            'a[href*="//utimg.ru/"]',
            'a[href*="://chikidiki.ru"]',
            '#pgeldiz',
            '.yandex-rtb-block',
        ],
        thaiAds: ['a[href*=macau-uta-popup]', '#ads-google-middle_rectangle-group', '.ads300s', '.bumq', '.img-kosana'],
        webAnnoyancesUltralist: [
            '#mod-social-share-2',
            '#social-tools',
            '.ctpl-fullbanner',
            '.zergnet-recommend',
            '.yt.btn-link.btn-md.btn',
        ],
    };
    /**
     * The order of the returned array means nothing (it's always sorted alphabetically).
     *
     * Notice that the source is slightly unstable.
     * Safari provides a 2-taps way to disable all content blockers on a page temporarily.
     * Also content blockers can be disabled permanently for a domain, but it requires 4 taps.
     * So empty array shouldn't be treated as "no blockers", it should be treated as "no signal".
     * If you are a website owner, don't make your visitors want to disable content blockers.
     */
    function getDomBlockers(_a) {
        var debug = (_a === void 0 ? {} : _a).debug;
        return __awaiter(this, void 0, void 0, function () {
            var filterNames, allSelectors, blockedSelectors, activeBlockers;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!isApplicable()) {
                            return [2 /*return*/, undefined];
                        }
                        filterNames = Object.keys(filters);
                        allSelectors = (_b = []).concat.apply(_b, filterNames.map(function (filterName) { return filters[filterName]; }));
                        return [4 /*yield*/, getBlockedSelectors(allSelectors)];
                    case 1:
                        blockedSelectors = _c.sent();
                        if (debug) {
                            printDebug(blockedSelectors);
                        }
                        activeBlockers = filterNames.filter(function (filterName) {
                            var selectors = filters[filterName];
                            var blockedCount = countTruthy(selectors.map(function (selector) { return blockedSelectors[selector]; }));
                            return blockedCount > selectors.length * 0.6;
                        });
                        activeBlockers.sort();
                        return [2 /*return*/, activeBlockers];
                }
            });
        });
    }
    function isApplicable() {
        // Safari (desktop and mobile) and all Android browsers keep content blockers in both regular and private mode
        return isWebKit() || isAndroid();
    }
    function getBlockedSelectors(selectors) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var d, root, elements, blockedSelectors, i, element, holder, i;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        d = document;
                        root = d.createElement('div');
                        elements = new Array(selectors.length);
                        blockedSelectors = {};
                        forceShow(root);
                        // First create all elements that can be blocked. If the DOM steps below are done in a single cycle,
                        // browser will alternate tree modification and layout reading, that is very slow.
                        for (i = 0; i < selectors.length; ++i) {
                            element = selectorToElement(selectors[i]);
                            holder = d.createElement('div');
                            forceShow(holder);
                            holder.appendChild(element);
                            root.appendChild(holder);
                            elements[i] = element;
                        }
                        _b.label = 1;
                    case 1:
                        if (!!d.body) return [3 /*break*/, 3];
                        return [4 /*yield*/, wait(50)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        d.body.appendChild(root);
                        try {
                            // Then check which of the elements are blocked
                            for (i = 0; i < selectors.length; ++i) {
                                if (!elements[i].offsetParent) {
                                    blockedSelectors[selectors[i]] = true;
                                }
                            }
                        }
                        finally {
                            // Then remove the elements
                            (_a = root.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(root);
                        }
                        return [2 /*return*/, blockedSelectors];
                }
            });
        });
    }
    function forceShow(element) {
        element.style.setProperty('display', 'block', 'important');
    }
    function printDebug(blockedSelectors) {
        var message = 'DOM blockers debug:\n```';
        for (var _i = 0, _a = Object.keys(filters); _i < _a.length; _i++) {
            var filterName = _a[_i];
            message += "\n" + filterName + ":";
            for (var _b = 0, _c = filters[filterName]; _b < _c.length; _b++) {
                var selector = _c[_b];
                message += "\n  " + selector + " " + (blockedSelectors[selector] ? '🚫' : '➡️');
            }
        }
        // console.log is ok here because it's under a debug clause
        // eslint-disable-next-line no-console
        console.log(message + "\n```");
    }

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color-gamut
     */
    function getColorGamut() {
        // rec2020 includes p3 and p3 includes srgb
        for (var _i = 0, _a = ['rec2020', 'p3', 'srgb']; _i < _a.length; _i++) {
            var gamut = _a[_i];
            if (matchMedia("(color-gamut: " + gamut + ")").matches) {
                return gamut;
            }
        }
        return undefined;
    }

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/inverted-colors
     */
    function areColorsInverted() {
        if (doesMatch('inverted')) {
            return true;
        }
        if (doesMatch('none')) {
            return false;
        }
        return undefined;
    }
    function doesMatch(value) {
        return matchMedia("(inverted-colors: " + value + ")").matches;
    }

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors
     */
    function areColorsForced() {
        if (doesMatch$1('active')) {
            return true;
        }
        if (doesMatch$1('none')) {
            return false;
        }
        return undefined;
    }
    function doesMatch$1(value) {
        return matchMedia("(forced-colors: " + value + ")").matches;
    }

    var maxValueToCheck = 100;
    /**
     * If the display is monochrome (e.g. black&white), the value will be ≥0 and will mean the number of bits per pixel.
     * If the display is not monochrome, the returned value will be 0.
     * If the browser doesn't support this feature, the returned value will be undefined.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/monochrome
     */
    function getMonochromeDepth() {
        if (!matchMedia('(min-monochrome: 0)').matches) {
            // The media feature isn't supported by the browser
            return undefined;
        }
        // A variation of binary search algorithm can be used here.
        // But since expected values are very small (≤10), there is no sense in adding the complexity.
        for (var i = 0; i <= maxValueToCheck; ++i) {
            if (matchMedia("(max-monochrome: " + i + ")").matches) {
                return i;
            }
        }
        throw new Error('Too high value');
    }

    /**
     * @see https://www.w3.org/TR/mediaqueries-5/#prefers-contrast
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast
     */
    function getContrastPreference() {
        if (doesMatch$2('no-preference')) {
            return 0 /* None */;
        }
        // The sources contradict on the keywords. Probably 'high' and 'low' will never be implemented.
        // Need to check it when all browsers implement the feature.
        if (doesMatch$2('high') || doesMatch$2('more')) {
            return 1 /* More */;
        }
        if (doesMatch$2('low') || doesMatch$2('less')) {
            return -1 /* Less */;
        }
        if (doesMatch$2('forced')) {
            return 10 /* ForcedColors */;
        }
        return undefined;
    }
    function doesMatch$2(value) {
        return matchMedia("(prefers-contrast: " + value + ")").matches;
    }

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
     */
    function isMotionReduced() {
        if (doesMatch$3('reduce')) {
            return true;
        }
        if (doesMatch$3('no-preference')) {
            return false;
        }
        return undefined;
    }
    function doesMatch$3(value) {
        return matchMedia("(prefers-reduced-motion: " + value + ")").matches;
    }

    /**
     * @see https://www.w3.org/TR/mediaqueries-5/#dynamic-range
     */
    function isHDR() {
        if (doesMatch$4('high')) {
            return true;
        }
        if (doesMatch$4('standard')) {
            return false;
        }
        return undefined;
    }
    function doesMatch$4(value) {
        return matchMedia("(dynamic-range: " + value + ")").matches;
    }

    var M = Math; // To reduce the minified code size
    var fallbackFn = function () { return 0; };
    /**
     * @see https://gitlab.torproject.org/legacy/trac/-/issues/13018
     * @see https://bugzilla.mozilla.org/show_bug.cgi?id=531915
     */
    function getMathFingerprint() {
        // Native operations
        var acos = M.acos || fallbackFn;
        var acosh = M.acosh || fallbackFn;
        var asin = M.asin || fallbackFn;
        var asinh = M.asinh || fallbackFn;
        var atanh = M.atanh || fallbackFn;
        var atan = M.atan || fallbackFn;
        var sin = M.sin || fallbackFn;
        var sinh = M.sinh || fallbackFn;
        var cos = M.cos || fallbackFn;
        var cosh = M.cosh || fallbackFn;
        var tan = M.tan || fallbackFn;
        var tanh = M.tanh || fallbackFn;
        var exp = M.exp || fallbackFn;
        var expm1 = M.expm1 || fallbackFn;
        var log1p = M.log1p || fallbackFn;
        // Operation polyfills
        var powPI = function (value) { return M.pow(M.PI, value); };
        var acoshPf = function (value) { return M.log(value + M.sqrt(value * value - 1)); };
        var asinhPf = function (value) { return M.log(value + M.sqrt(value * value + 1)); };
        var atanhPf = function (value) { return M.log((1 + value) / (1 - value)) / 2; };
        var sinhPf = function (value) { return M.exp(value) - 1 / M.exp(value) / 2; };
        var coshPf = function (value) { return (M.exp(value) + 1 / M.exp(value)) / 2; };
        var expm1Pf = function (value) { return M.exp(value) - 1; };
        var tanhPf = function (value) { return (M.exp(2 * value) - 1) / (M.exp(2 * value) + 1); };
        var log1pPf = function (value) { return M.log(1 + value); };
        // Note: constant values are empirical
        return {
            acos: acos(0.123124234234234242),
            acosh: acosh(1e308),
            acoshPf: acoshPf(1e154),
            asin: asin(0.123124234234234242),
            asinh: asinh(1),
            asinhPf: asinhPf(1),
            atanh: atanh(0.5),
            atanhPf: atanhPf(0.5),
            atan: atan(0.5),
            sin: sin(-1e300),
            sinh: sinh(1),
            sinhPf: sinhPf(1),
            cos: cos(10.000000000123),
            cosh: cosh(1),
            coshPf: coshPf(1),
            tan: tan(-1e300),
            tanh: tanh(1),
            tanhPf: tanhPf(1),
            exp: exp(1),
            expm1: expm1(1),
            expm1Pf: expm1Pf(1),
            log1p: log1p(10),
            log1pPf: log1pPf(10),
            powPI: powPI(-100),
        };
    }

    /**
     * We use m or w because these two characters take up the maximum width.
     * Also there are a couple of ligatures.
     */
    var defaultText = 'mmMwWLliI0fiflO&1';
    /**
     * Settings of text blocks to measure. The keys are random but persistent words.
     */
    var presets = {
        /**
         * The default font. User can change it in desktop Chrome, desktop Firefox, IE 11,
         * Android Chrome (but only when the size is ≥ than the default) and Android Firefox.
         */
        default: [],
        /** OS font on macOS. User can change its size and weight. Applies after Safari restart. */
        apple: [{ font: '-apple-system-body' }],
        /** User can change it in desktop Chrome and desktop Firefox. */
        serif: [{ fontFamily: 'serif' }],
        /** User can change it in desktop Chrome and desktop Firefox. */
        sans: [{ fontFamily: 'sans-serif' }],
        /** User can change it in desktop Chrome and desktop Firefox. */
        mono: [{ fontFamily: 'monospace' }],
        /**
         * Check the smallest allowed font size. User can change it in desktop Chrome, desktop Firefox and desktop Safari.
         * The height can be 0 in Chrome on a retina display.
         */
        min: [{ fontSize: '1px' }],
        /** Tells one OS from another in desktop Chrome. */
        system: [{ fontFamily: 'system-ui' }],
    };
    /**
     * The result is a dictionary of the width of the text samples.
     * Heights aren't included because they give no extra entropy and are unstable.
     *
     * The result is very stable in IE 11, Edge 18 and Safari 14.
     * The result changes when the OS pixel density changes in Chromium 87. The real pixel density is required to solve,
     * but seems like it's impossible: https://stackoverflow.com/q/1713771/1118709.
     * The "min" and the "mono" (only on Windows) value may change when the page is zoomed in Firefox 87.
     */
    function getFontPreferences() {
        return withNaturalFonts(function (document, container) {
            var elements = {};
            var sizes = {};
            // First create all elements to measure. If the DOM steps below are done in a single cycle,
            // browser will alternate tree modification and layout reading, that is very slow.
            for (var _i = 0, _a = Object.keys(presets); _i < _a.length; _i++) {
                var key = _a[_i];
                var _b = presets[key], _c = _b[0], style = _c === void 0 ? {} : _c, _d = _b[1], text = _d === void 0 ? defaultText : _d;
                var element = document.createElement('span');
                element.textContent = text;
                element.style.whiteSpace = 'nowrap';
                for (var _e = 0, _f = Object.keys(style); _e < _f.length; _e++) {
                    var name_1 = _f[_e];
                    var value = style[name_1];
                    if (value !== undefined) {
                        element.style[name_1] = value;
                    }
                }
                elements[key] = element;
                container.appendChild(document.createElement('br'));
                container.appendChild(element);
            }
            // Then measure the created elements
            for (var _g = 0, _h = Object.keys(presets); _g < _h.length; _g++) {
                var key = _h[_g];
                sizes[key] = elements[key].getBoundingClientRect().width;
            }
            return sizes;
        });
    }
    /**
     * Creates a DOM environment that provides the most natural font available, including Android OS font.
     * Measurements of the elements are zoom-independent.
     * Don't put a content to measure inside an absolutely positioned element.
     */
    function withNaturalFonts(action, containerWidthPx) {
        if (containerWidthPx === void 0) { containerWidthPx = 4000; }
        /*
         * Requirements for Android Chrome to apply the system font size to a text inside an iframe:
         * - The iframe mustn't have a `display: none;` style;
         * - The text mustn't be positioned absolutely;
         * - The text block must be wide enough.
         *   2560px on some devices in portrait orientation for the biggest font size option (32px);
         * - There must be much enough text to form a few lines (I don't know the exact numbers);
         * - The text must have the `text-size-adjust: none` style. Otherwise the text will scale in "Desktop site" mode;
         *
         * Requirements for Android Firefox to apply the system font size to a text inside an iframe:
         * - The iframe document must have a header: `<meta name="viewport" content="width=device-width, initial-scale=1" />`.
         *   The only way to set it is to use the `srcdoc` attribute of the iframe;
         * - The iframe content must get loaded before adding extra content with JavaScript;
         *
         * https://example.com as the iframe target always inherits Android font settings so it can be used as a reference.
         *
         * Observations on how page zoom affects the measurements:
         * - macOS Safari 11.1, 12.1, 13.1, 14.0: zoom reset + offsetWidth = 100% reliable;
         * - macOS Safari 11.1, 12.1, 13.1, 14.0: zoom reset + getBoundingClientRect = 100% reliable;
         * - macOS Safari 14.0: offsetWidth = 5% fluctuation;
         * - macOS Safari 14.0: getBoundingClientRect = 5% fluctuation;
         * - iOS Safari 9, 10, 11.0, 12.0: haven't found a way to zoom a page (pinch doesn't change layout);
         * - iOS Safari 13.1, 14.0: zoom reset + offsetWidth = 100% reliable;
         * - iOS Safari 13.1, 14.0: zoom reset + getBoundingClientRect = 100% reliable;
         * - iOS Safari 14.0: offsetWidth = 100% reliable;
         * - iOS Safari 14.0: getBoundingClientRect = 100% reliable;
         * - Chrome 42, 65, 80, 87: zoom 1/devicePixelRatio + offsetWidth = 1px fluctuation;
         * - Chrome 42, 65, 80, 87: zoom 1/devicePixelRatio + getBoundingClientRect = 100% reliable;
         * - Chrome 87: offsetWidth = 1px fluctuation;
         * - Chrome 87: getBoundingClientRect = 0.7px fluctuation;
         * - Firefox 48, 51: offsetWidth = 10% fluctuation;
         * - Firefox 48, 51: getBoundingClientRect = 10% fluctuation;
         * - Firefox 52, 53, 57, 62, 66, 67, 68, 71, 75, 80, 84: offsetWidth = width 100% reliable, height 10% fluctuation;
         * - Firefox 52, 53, 57, 62, 66, 67, 68, 71, 75, 80, 84: getBoundingClientRect = width 100% reliable, height 10%
         *   fluctuation;
         * - Android Chrome 86: haven't found a way to zoom a page (pinch doesn't change layout);
         * - Android Firefox 84: font size in accessibility settings changes all the CSS sizes, but offsetWidth and
         *   getBoundingClientRect keep measuring with regular units, so the size reflects the font size setting and doesn't
         *   fluctuate;
         * - IE 11, Edge 18: zoom 1/devicePixelRatio + offsetWidth = 100% reliable;
         * - IE 11, Edge 18: zoom 1/devicePixelRatio + getBoundingClientRect = reflects the zoom level;
         * - IE 11, Edge 18: offsetWidth = 100% reliable;
         * - IE 11, Edge 18: getBoundingClientRect = 100% reliable;
         */
        return withIframe(function (_, iframeWindow) {
            var iframeDocument = iframeWindow.document;
            var iframeBody = iframeDocument.body;
            var bodyStyle = iframeBody.style;
            bodyStyle.width = containerWidthPx + "px";
            bodyStyle.webkitTextSizeAdjust = bodyStyle.textSizeAdjust = 'none';
            // See the big comment above
            if (isChromium()) {
                iframeBody.style.zoom = "" + 1 / iframeWindow.devicePixelRatio;
            }
            else if (isWebKit()) {
                iframeBody.style.zoom = 'reset';
            }
            // See the big comment above
            var linesOfText = iframeDocument.createElement('div');
            linesOfText.textContent = __spreadArrays(Array((containerWidthPx / 20) << 0)).map(function () { return 'word'; }).join(' ');
            iframeBody.appendChild(linesOfText);
            return action(iframeDocument, iframeBody);
        }, '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">');
    }

    /**
     * The list of entropy sources used to make visitor identifiers.
     *
     * This value isn't restricted by Semantic Versioning, i.e. it may be changed without bumping minor or major version of
     * this package.
     */
    var sources = {
        // READ FIRST:
        // See https://github.com/fingerprintjs/fingerprintjs/blob/master/contributing.md#how-to-make-an-entropy-source
        // to learn how entropy source works and how to make your own.
        // The sources run in this exact order.
        // The asynchronous sources are at the start to run in parallel with other sources.
        fonts: getFonts,
        domBlockers: getDomBlockers,
        fontPreferences: getFontPreferences,
        audio: getAudioFingerprint,
        screenFrame: getRoundedScreenFrame,
        osCpu: getOsCpu,
        languages: getLanguages,
        colorDepth: getColorDepth,
        deviceMemory: getDeviceMemory,
        screenResolution: getScreenResolution,
        hardwareConcurrency: getHardwareConcurrency,
        timezone: getTimezone,
        sessionStorage: getSessionStorage,
        localStorage: getLocalStorage,
        indexedDB: getIndexedDB,
        openDatabase: getOpenDatabase,
        cpuClass: getCpuClass,
        platform: getPlatform,
        plugins: getPlugins,
        canvas: getCanvasFingerprint,
        touchSupport: getTouchSupport,
        vendor: getVendor,
        vendorFlavors: getVendorFlavors,
        cookiesEnabled: areCookiesEnabled,
        colorGamut: getColorGamut,
        invertedColors: areColorsInverted,
        forcedColors: areColorsForced,
        monochrome: getMonochromeDepth,
        contrast: getContrastPreference,
        reducedMotion: isMotionReduced,
        hdr: isHDR,
        math: getMathFingerprint,
    };
    /**
     * Loads the built-in entropy sources.
     * Returns a function that collects the entropy components to make the visitor identifier.
     */
    function loadBuiltinSources(options) {
        return loadSources(sources, options, []);
    }

    var commentTemplate = '$ if upgrade to Pro: https://fpjs.dev/pro';
    // (components: Omit<SourcesToComponents<{ platform: () => string }>, any>)
    function getConfidence(components) {
        var openConfidenceScore = getOpenConfidenceScore(components);
        var proConfidenceScore = deriveProConfidenceScore(openConfidenceScore);
        return { score: openConfidenceScore, comment: commentTemplate.replace(/\$/g, "" + proConfidenceScore) };
    }
    function getOpenConfidenceScore(components) {
        // In order to calculate the true probability of the visitor identifier being correct, we need to know the number of
        // website visitors (the higher the number, the less the probability because the fingerprint entropy is limited).
        // JS agent doesn't know the number of visitors, so we can only do an approximate assessment.
        if (isAndroid()) {
            return 0.4;
        }
        // Safari (mobile and desktop)
        if (isWebKit()) {
            return isDesktopSafari() ? 0.5 : 0.3;
        }
        var platform = components.platform.value || '';
        // Windows
        if (/^Win/.test(platform)) {
            // The score is greater than on macOS because of the higher variety of devices running Windows.
            // Chrome provides more entropy than Firefox according too
            // https://netmarketshare.com/browser-market-share.aspx?options=%7B%22filter%22%3A%7B%22%24and%22%3A%5B%7B%22platform%22%3A%7B%22%24in%22%3A%5B%22Windows%22%5D%7D%7D%5D%7D%2C%22dateLabel%22%3A%22Trend%22%2C%22attributes%22%3A%22share%22%2C%22group%22%3A%22browser%22%2C%22sort%22%3A%7B%22share%22%3A-1%7D%2C%22id%22%3A%22browsersDesktop%22%2C%22dateInterval%22%3A%22Monthly%22%2C%22dateStart%22%3A%222019-11%22%2C%22dateEnd%22%3A%222020-10%22%2C%22segments%22%3A%22-1000%22%7D
            // So we assign the same score to them.
            return 0.6;
        }
        // macOS
        if (/^Mac/.test(platform)) {
            // Chrome provides more entropy than Safari and Safari provides more entropy than Firefox.
            // Chrome is more popular than Safari and Safari is more popular than Firefox according to
            // https://netmarketshare.com/browser-market-share.aspx?options=%7B%22filter%22%3A%7B%22%24and%22%3A%5B%7B%22platform%22%3A%7B%22%24in%22%3A%5B%22Mac%20OS%22%5D%7D%7D%5D%7D%2C%22dateLabel%22%3A%22Trend%22%2C%22attributes%22%3A%22share%22%2C%22group%22%3A%22browser%22%2C%22sort%22%3A%7B%22share%22%3A-1%7D%2C%22id%22%3A%22browsersDesktop%22%2C%22dateInterval%22%3A%22Monthly%22%2C%22dateStart%22%3A%222019-11%22%2C%22dateEnd%22%3A%222020-10%22%2C%22segments%22%3A%22-1000%22%7D
            // So we assign the same score to them.
            return 0.5;
        }
        // Another platform, e.g. a desktop Linux. It's rare, so it should be pretty unique.
        return 0.7;
    }
    function deriveProConfidenceScore(openConfidenceScore) {
        return round(0.99 + 0.01 * openConfidenceScore, 0.0001);
    }

    /*
     * Taken from https://github.com/karanlyons/murmurHash3.js/blob/a33d0723127e2e5415056c455f8aed2451ace208/murmurHash3.js
     */
    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // added together as a 64bit int (as an array of two 32bit ints).
    //
    function x64Add(m, n) {
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
    }
    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // multiplied together as a 64bit int (as an array of two 32bit ints).
    //
    function x64Multiply(m, n) {
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
        o[0] += m[0] * n[3] + m[1] * n[2] + m[2] * n[1] + m[3] * n[0];
        o[0] &= 0xffff;
        return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    }
    //
    // Given a 64bit int (as an array of two 32bit ints) and an int
    // representing a number of bit positions, returns the 64bit int (as an
    // array of two 32bit ints) rotated left by that number of positions.
    //
    function x64Rotl(m, n) {
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
    }
    //
    // Given a 64bit int (as an array of two 32bit ints) and an int
    // representing a number of bit positions, returns the 64bit int (as an
    // array of two 32bit ints) shifted left by that number of positions.
    //
    function x64LeftShift(m, n) {
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
    }
    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // xored together as a 64bit int (as an array of two 32bit ints).
    //
    function x64Xor(m, n) {
        return [m[0] ^ n[0], m[1] ^ n[1]];
    }
    //
    // Given a block, returns murmurHash3's final x64 mix of that block.
    // (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
    // only place where we need to right shift 64bit ints.)
    //
    function x64Fmix(h) {
        h = x64Xor(h, [0, h[0] >>> 1]);
        h = x64Multiply(h, [0xff51afd7, 0xed558ccd]);
        h = x64Xor(h, [0, h[0] >>> 1]);
        h = x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
        h = x64Xor(h, [0, h[0] >>> 1]);
        return h;
    }
    //
    // Given a string and an optional seed as an int, returns a 128 bit
    // hash using the x64 flavor of MurmurHash3, as an unsigned hex.
    //
    function x64hash128(key, seed) {
        key = key || '';
        seed = seed || 0;
        var remainder = key.length % 16;
        var bytes = key.length - remainder;
        var h1 = [0, seed];
        var h2 = [0, seed];
        var k1 = [0, 0];
        var k2 = [0, 0];
        var c1 = [0x87c37b91, 0x114253d5];
        var c2 = [0x4cf5ad43, 0x2745937f];
        var i;
        for (i = 0; i < bytes; i = i + 16) {
            k1 = [
                (key.charCodeAt(i + 4) & 0xff) |
                    ((key.charCodeAt(i + 5) & 0xff) << 8) |
                    ((key.charCodeAt(i + 6) & 0xff) << 16) |
                    ((key.charCodeAt(i + 7) & 0xff) << 24),
                (key.charCodeAt(i) & 0xff) |
                    ((key.charCodeAt(i + 1) & 0xff) << 8) |
                    ((key.charCodeAt(i + 2) & 0xff) << 16) |
                    ((key.charCodeAt(i + 3) & 0xff) << 24),
            ];
            k2 = [
                (key.charCodeAt(i + 12) & 0xff) |
                    ((key.charCodeAt(i + 13) & 0xff) << 8) |
                    ((key.charCodeAt(i + 14) & 0xff) << 16) |
                    ((key.charCodeAt(i + 15) & 0xff) << 24),
                (key.charCodeAt(i + 8) & 0xff) |
                    ((key.charCodeAt(i + 9) & 0xff) << 8) |
                    ((key.charCodeAt(i + 10) & 0xff) << 16) |
                    ((key.charCodeAt(i + 11) & 0xff) << 24),
            ];
            k1 = x64Multiply(k1, c1);
            k1 = x64Rotl(k1, 31);
            k1 = x64Multiply(k1, c2);
            h1 = x64Xor(h1, k1);
            h1 = x64Rotl(h1, 27);
            h1 = x64Add(h1, h2);
            h1 = x64Add(x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
            k2 = x64Multiply(k2, c2);
            k2 = x64Rotl(k2, 33);
            k2 = x64Multiply(k2, c1);
            h2 = x64Xor(h2, k2);
            h2 = x64Rotl(h2, 31);
            h2 = x64Add(h2, h1);
            h2 = x64Add(x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
        }
        k1 = [0, 0];
        k2 = [0, 0];
        switch (remainder) {
            case 15:
                k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 14)], 48));
            // fallthrough
            case 14:
                k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 13)], 40));
            // fallthrough
            case 13:
                k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 12)], 32));
            // fallthrough
            case 12:
                k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 11)], 24));
            // fallthrough
            case 11:
                k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 10)], 16));
            // fallthrough
            case 10:
                k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 9)], 8));
            // fallthrough
            case 9:
                k2 = x64Xor(k2, [0, key.charCodeAt(i + 8)]);
                k2 = x64Multiply(k2, c2);
                k2 = x64Rotl(k2, 33);
                k2 = x64Multiply(k2, c1);
                h2 = x64Xor(h2, k2);
            // fallthrough
            case 8:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 7)], 56));
            // fallthrough
            case 7:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 6)], 48));
            // fallthrough
            case 6:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 5)], 40));
            // fallthrough
            case 5:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 4)], 32));
            // fallthrough
            case 4:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 3)], 24));
            // fallthrough
            case 3:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 2)], 16));
            // fallthrough
            case 2:
                k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 1)], 8));
            // fallthrough
            case 1:
                k1 = x64Xor(k1, [0, key.charCodeAt(i)]);
                k1 = x64Multiply(k1, c1);
                k1 = x64Rotl(k1, 31);
                k1 = x64Multiply(k1, c2);
                h1 = x64Xor(h1, k1);
            // fallthrough
        }
        h1 = x64Xor(h1, [0, key.length]);
        h2 = x64Xor(h2, [0, key.length]);
        h1 = x64Add(h1, h2);
        h2 = x64Add(h2, h1);
        h1 = x64Fmix(h1);
        h2 = x64Fmix(h2);
        h1 = x64Add(h1, h2);
        h2 = x64Add(h2, h1);
        return (('00000000' + (h1[0] >>> 0).toString(16)).slice(-8) +
            ('00000000' + (h1[1] >>> 0).toString(16)).slice(-8) +
            ('00000000' + (h2[0] >>> 0).toString(16)).slice(-8) +
            ('00000000' + (h2[1] >>> 0).toString(16)).slice(-8));
    }

    /**
     * Converts an error object to a plain object that can be used with `JSON.stringify`.
     * If you just run `JSON.stringify(error)`, you'll get `'{}'`.
     */
    function errorToObject(error) {
        var _a;
        return __assign({ name: error.name, message: error.message, stack: (_a = error.stack) === null || _a === void 0 ? void 0 : _a.split('\n') }, error);
    }

    var version = '1.0';
    function componentsToCanonicalString(components, browserInfo, ipInfo) {
        var result = '';
        // console.log('componentsToCanonicalString', browserInfo, components);
        for (var _i = 0, _a = Object.keys(components).sort(); _i < _a.length; _i++) {
            var componentKey = _a[_i];
            var component = components[componentKey];
            var value = component.error ? 'error' : JSON.stringify(component.value);
            result += "" + (result ? '|' : '') + componentKey.replace(/([:|\\])/g, '\\$1') + ":" + value;
        }
        var checkPath = function (obj, paths) {
            if (paths === void 0) { paths = []; }
            paths.forEach(function (path) {
                result += obj && obj[path] ? JSON.stringify(obj[path]) : '';
            });
        };
        var browser = browserInfo.browser, os = browserInfo.os, platform = browserInfo.platform, engine = browserInfo.engine;
        checkPath(browser, ['name', 'version']);
        checkPath(os, ['name', 'version', 'versionName']);
        checkPath(platform, ['type']);
        checkPath(engine, ['name', 'version']);
        var ip = ipInfo.ip;
        if (ip)
            result += JSON.stringify(ip);
        return result;
    }
    function componentsToDebugString(components) {
        return JSON.stringify(components, function (_key, value) {
            if (value instanceof Error) {
                return errorToObject(value);
            }
            return value;
        }, 2);
    }
    function hashComponents(components, browserInfo, ipInfo) {
        return x64hash128(componentsToCanonicalString(components, browserInfo, ipInfo));
    }
    /**
     * Makes a GetResult implementation that calculates the visitor id hash on demand.
     * Designed for optimisation.
     */
    function makeLazyGetResult(components, browserInfo, ipInfo) {
        var visitorIdCache;
        // This function runs very fast, so there is no need to make it lazy
        var confidence = getConfidence(components);
        // A plain class isn't used because its getters and setters aren't enumerable.
        return {
            get visitorId() {
                if (visitorIdCache === undefined) {
                    visitorIdCache = hashComponents(this.components, this.browserInfo, this.ipInfo);
                }
                return visitorIdCache;
            },
            set visitorId(visitorId) {
                visitorIdCache = visitorId;
            },
            confidence: confidence,
            components: components,
            browserInfo: browserInfo,
            ipInfo: ipInfo,
            version: version,
        };
    }
    /**
     * A delay is required to ensure consistent entropy components.
     * See https://github.com/fingerprintjs/fingerprintjs/issues/254
     * and https://github.com/fingerprintjs/fingerprintjs/issues/307
     * and https://github.com/fingerprintjs/fingerprintjs/commit/945633e7c5f67ae38eb0fea37349712f0e669b18
     */
    function prepareForSources(delayFallback) {
        if (delayFallback === void 0) { delayFallback = 50; }
        // A proper deadline is unknown. Let it be twice the fallback timeout so that both cases have the same average time.
        return requestIdleCallbackIfAvailable(delayFallback, delayFallback * 2);
    }
    /**
     * The function isn't exported from the index.ts file to not allow to call it without `load()`.
     * The hiding gives more freedom for future non-breaking updates.
     *
     * A factory function is used instead of a class to shorten the attribute names in the minified code.
     * Native private class fields could've been used, but TypeScript doesn't allow them with `"target": "es5"`.
     */
    function makeAgent(ipInfo, getComponents, debug) {
        var creationTime = Date.now();
        return {
            get: function (options) {
                return __awaiter(this, void 0, void 0, function () {
                    var startTime, components, browserInfo, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                startTime = Date.now();
                                return [4 /*yield*/, getComponents()];
                            case 1:
                                components = _a.sent();
                                browserInfo = getBrowserInfo();
                                result = makeLazyGetResult(components, browserInfo, ipInfo);
                                if (debug || (options === null || options === void 0 ? void 0 : options.debug)) {
                                    // console.log is ok here because it's under a debug clause
                                    // eslint-disable-next-line no-console
                                    console.log("Copy the text below to get the debug data:\n\n```\nversion: " + result.version + "\nuserAgent: " + navigator.userAgent + "\ntimeBetweenLoadAndGet: " + (startTime - creationTime) + "\nvisitorId: " + result.visitorId + "\ncomponents: " + componentsToDebugString(components) + "\n```");
                                }
                                return [2 /*return*/, result];
                        }
                    });
                });
            },
        };
    }
    /**
     * Builds an instance of Agent and waits a delay required for a proper operation.
     */
    function load(ipInfo, _a) {
        var _b = _a === void 0 ? {} : _a, delayFallback = _b.delayFallback, debug = _b.debug, _c = _b.monitoring;
        return __awaiter(this, void 0, void 0, function () {
            var getComponents;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        return [4 /*yield*/, prepareForSources(delayFallback)];
                    case 1:
                        _d.sent();
                        getComponents = loadBuiltinSources({ debug: debug });
                        return [2 /*return*/, makeAgent(ipInfo, getComponents, debug)];
                }
            });
        });
    }

    // The default export is a syntax sugar (`import * as FP from '...' → import FP from '...'`).
    // It should contain all the public exported values.
    var index = { load: load, hashComponents: hashComponents, componentsToDebugString: componentsToDebugString };
    // The exports below are for private usage. They may change unexpectedly. Use them at your own risk.
    /** Not documented, out of Semantic Versioning, usage is at your own risk */
    var murmurX64Hash128 = x64hash128;

    exports.componentsToDebugString = componentsToDebugString;
    exports.default = index;
    exports.getFullscreenElement = getFullscreenElement;
    exports.getScreenFrame = getScreenFrame;
    exports.hashComponents = hashComponents;
    exports.isAndroid = isAndroid;
    exports.isChromium = isChromium;
    exports.isDesktopSafari = isDesktopSafari;
    exports.isEdgeHTML = isEdgeHTML;
    exports.isGecko = isGecko;
    exports.isTrident = isTrident;
    exports.isWebKit = isWebKit;
    exports.load = load;
    exports.loadSources = loadSources;
    exports.murmurX64Hash128 = murmurX64Hash128;
    exports.prepareForSources = prepareForSources;
    exports.sources = sources;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

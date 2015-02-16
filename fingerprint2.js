/*
* Fingerprintjs2 0.0.1 - Modern & flexible browser fingerprint library v2
* https://github.com/Valve/fingerprintjs2
* Copyright (c) 2015 Valentin Vasilyev (valentin.vasilyev@outlook.com)
* Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
* THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function (name, context, definition) {
  "use strict";
  if (typeof module !== "undefined" && module.exports) { module.exports = definition(); }
  else if (typeof define === "function" && define.amd) { define(definition); }
  else { context[name] = definition(); }
})("Fingerprint2", this, function() {
  "use strict";
  var Fingerprint2 = function(options) {
    this.options = options;
    this.nativeForEach = Array.prototype.forEach;
    this.nativeMap = Array.prototype.map;
  };
  Fingerprint2.prototype = {
    get: function(){
      return this.hashString(navigator.userAgent);
    },
    
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
    },

    mul32: function(m, n) {
      var nlo = n & 0xffff;
      var nhi = n - nlo;
      return ((nhi * m | 0) + (nlo * m | 0)) | 0;
    },

    hashString: function(data, len, seed) {
      var c1 = 0xcc9e2d51, c2 = 0x1b873593;

      var h1 = seed;
      var roundedEnd = len & ~0x1;

      for (var i = 0; i < roundedEnd; i += 2) {
        var k1 = data.charCodeAt(i) | (data.charCodeAt(i + 1) << 16);

        k1 = this.mul32(k1, c1);
        k1 = ((k1 & 0x1ffff) << 15) | (k1 >>> 17);  // ROTL32(k1,15);
        k1 = this.mul32(k1, c2);

        h1 ^= k1;
        h1 = ((h1 & 0x7ffff) << 13) | (h1 >>> 19);  // ROTL32(h1,13);
        h1 = (h1 * 5 + 0xe6546b64) | 0;
      }

      if((len % 2) == 1) {
        k1 = data.charCodeAt(roundedEnd);
        k1 = this.mul32(k1, c1);
        k1 = ((k1 & 0x1ffff) << 15) | (k1 >>> 17);  // ROTL32(k1,15);
        k1 = this.mul32(k1, c2);
        h1 ^= k1;
      }

      // finalization
      h1 ^= (len << 1);

      // fmix(h1);
      h1 ^= h1 >>> 16;
      h1  = this.mul32(h1, 0x85ebca6b);
      h1 ^= h1 >>> 13;
      h1  = this.mul32(h1, 0xc2b2ae35);
      h1 ^= h1 >>> 16;
      return h1;
    }
  };
  return Fingerprint2;
});

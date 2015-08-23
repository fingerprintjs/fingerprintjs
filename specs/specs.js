"use strict";
describe("Fingerprint2", function () {
  describe("new", function () {
    it("creates a new instance of FP2", function () {
      expect(new Fingerprint2()).not.toBeNull();
    });

    it("accepts an empty options object", function () {
      expect(new Fingerprint2({})).not.toBeNull();
    });

    it("uses default options", function () {
      var fp2 = new Fingerprint2();
      expect(fp2.options.swfContainerId).toEqual("fingerprintjs2");
      expect(fp2.options.swfPath).toEqual("flash/compiled/FontList.swf");
    });

    it("allows to override default options", function () {
      var fp2 = new Fingerprint2({swfPath: "newpath"});
      expect(fp2.options.swfContainerId).toEqual("fingerprintjs2");
      expect(fp2.options.swfPath).toEqual("newpath");
    });

    it("allows to add new options", function () {
      var fp2 = new Fingerprint2({excludeUserAgent: true});
      expect(fp2.options.swfContainerId).toEqual("fingerprintjs2");
      expect(fp2.options.swfPath).toEqual("flash/compiled/FontList.swf");
      expect(fp2.options.excludeUserAgent).toBe(true);
    });

    describe("sortPluginsFor", function () {
      it("has default value", function (){
        var fp2 = new Fingerprint2();
        expect(fp2.options.sortPluginsFor).toEqual([/palemoon/i]);
      });

      it("allows to set new array of regexes", function () {
        var fp2 = new Fingerprint2({sortPluginsFor: [/firefox/i, /chrome/i]});
        expect(fp2.options.sortPluginsFor).toEqual([/firefox/i, /chrome/i]);
      });
    });
  });

  describe("get", function () {
    describe("default options", function () {
      it("calculates fingerprint", function (done) {
        var fp2 = new Fingerprint2();
        fp2.get(function(result){
          expect(result).toMatch(/^[0-9a-f]{32}$/i);
          done();
        });
      });

      it("does not try calling flash font detection", function (done) {
        var fp2 = new Fingerprint2();
        spyOn(fp2, "flashFontsKey");
        fp2.get(function(result) {
          expect(fp2.flashFontsKey).not.toHaveBeenCalled();
          done();
        });
      });
    });

    describe("non-default options", function () {
      it("does not use userAgent when excluded", function (done) {
        var fp2 = new Fingerprint2({excludeUserAgent: true});
        spyOn(fp2, "getUserAgent");
        fp2.get(function(result) {
          expect(fp2.getUserAgent).not.toHaveBeenCalled();
          done();
        });
      });

      it("does not use screen resolution when excluded", function (done) {
        var fp2 = new Fingerprint2({excludeScreenResolution: true});
        spyOn(fp2, "getScreenResolution");
        fp2.get(function(result) {
          expect(fp2.getScreenResolution).not.toHaveBeenCalled();
          done();
        });
      });

      it("does not use plugins info when excluded", function (done) {
        var fp2 = new Fingerprint2({excludePlugins: true});
        spyOn(fp2, "getRegularPluginsString");
        fp2.get(function(result) {
          expect(fp2.getRegularPluginsString).not.toHaveBeenCalled();
          done();
        });
      });
    });
  });
});

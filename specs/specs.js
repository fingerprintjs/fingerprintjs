"use strict";
describe("Fingerprint2", function () {
  
  describe("default hash function", function () {
    it("to return a consistent output", function () {
      var fp = (new Fingerprint2);
      expect(fp.hash("Fingerprint2")).toEqual("e21f41d6b7647f96669464911ca315a2");
      expect(fp.hash("0")).toEqual("f982a041f3a826073bb481082fd56879");
      expect(fp.hash("1")).toEqual("47bc2f23bb3f7690a0c98e87c61414f5");
      expect(fp.hash("12")).toEqual("31af169c87804504a942c81c5cef0e35");
      expect(fp.hash("123")).toEqual("1af2ed2b456a1a4cbcb55df6df43e656");
      expect(fp.hash("1234")).toEqual("9d9f872c68c88451e9ad37c16e54b819");
      expect(fp.hash("12345")).toEqual("f2bd2fce3e12a85676ae834d0db69514");
      expect(fp.hash("123456")).toEqual("6547add326df62b27b66592696cb0502");
      expect(fp.hash("1234567")).toEqual("cb16e0247cea6b0bf433b3bc0cdf8152");
      expect(fp.hash("12345678")).toEqual("2706bf3219ba51c122c1dbdfe1ea3abf");
      expect(fp.hash("123456789")).toEqual("41ab5d0479145278beb599f9cb4e62b1");
      expect(fp.hash("1234567890")).toEqual("1fd36595dd963bcd1fbec2a8924f6089");
      expect(fp.hash("12345678901")).toEqual("9cb7c5bfcd0274ba0d7bbcf17bf6ee1c");
      expect(fp.hash("123456789012")).toEqual("581f6d701a6b2afb07a96ef14844e692");
      expect(fp.hash("1234567890123")).toEqual("898020b89dedc7b57403a905fe58dc60");
      expect(fp.hash("12345678901234")).toEqual("0a9d9312458225765f4a68429a95c08c");
      expect(fp.hash("123456789012345")).toEqual("313ba32ccfcbcce86af69e963c5bbb4e");
      expect(fp.hash("1234567890123456")).toEqual("b8655b10eba486e0a9f941b171e7b0bc");
    });
  });
  
  describe("new", function () {
    it("creates a new instance of FP2", function () {
      expect(new Fingerprint2()).not.toBeNull();
    });

    it("accepts an empty options object", function () {
      expect(new Fingerprint2({})).not.toBeNull();
    });

    it("uses default options", function () {
      var fp2 = new Fingerprint2();
      expect(fp2.options.userDefinedFonts).toEqual([]);
    });

    it("allows to override default options", function () {
      var fp2 = new Fingerprint2({swfPath: "newpath", userDefinedFonts: ["Ethos", "Quenda"]});
      expect(fp2.options.userDefinedFonts).toEqual(["Ethos", "Quenda"]);
    });

    it("allows to add new options", function () {
      var fp2 = new Fingerprint2({excludeUserAgent: true});
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

  describe("without new keyword", function () {
    it("creates a new instance of FP2", function () {
      expect(Fingerprint2()).not.toBeNull();
    });
  })

  describe("get", function () {
    describe("default options", function () {
      it("calculates fingerprint", function (done) {
        var fp2 = new Fingerprint2();
        var result = fp2.get();
        expect(result).toMatch(/^[0-9a-f]{32}$/i);

        fp2 = new Fingerprint2();
        var resultTuple = fp2.getWithComponents();
        var result = resultTuple[0];
        expect(result).toMatch(/^[0-9a-f]{32}$/i);

        fp2 = new Fingerprint2();
        fp2.get(function(result){
          expect(result).toMatch(/^[0-9a-f]{32}$/i);
          done();
        });
      });
    });

    describe("non-default options", function () {
      it("does not use userAgent when excluded", function (done) {
        var fp2 = new Fingerprint2({excludeUserAgent: true});
        spyOn(fp2, "userAgentKey");
        fp2.get(function(result) {
          expect(fp2.userAgentKey).not.toHaveBeenCalled();
          done();
        });
      });

      it("does not use pixelRatio when excluded", function (done) {
        var fp2 = new Fingerprint2({excludePixelRatio: true});
        spyOn(fp2, "pixelRatioKey");
        fp2.get(function(result) {
          expect(fp2.pixelRatioKey).not.toHaveBeenCalled();
          done();
        });
      });

      it("does not use screen resolution when excluded", function (done) {
        var fp2 = new Fingerprint2({excludeScreenResolution: true});
        spyOn(fp2, "screenResolutionKey");
        fp2.get(function(result) {
          expect(fp2.screenResolutionKey).not.toHaveBeenCalled();
          done();
        });
      });

      it("does not use available screen resolution when excluded", function (done) {
        var fp2 = new Fingerprint2({excludeAvailableScreenResolution: true});
        spyOn(fp2, "availableScreenResolutionKey");
        fp2.get(function(result) {
          expect(fp2.availableScreenResolutionKey).not.toHaveBeenCalled();
          done();
        });
      });

      it("does not use plugins info when excluded", function (done) {
        var fp2 = new Fingerprint2({excludePlugins: true});
        spyOn(fp2, "getRegularPlugins");
        fp2.get(function(result) {
          expect(fp2.getRegularPlugins).not.toHaveBeenCalled();
          done();
        });
      });

      it("does not use IE plugins info when excluded", function (done) {
        var fp2 = new Fingerprint2({excludeIEPlugins: true});
        spyOn(fp2, "getIEPlugins");
        fp2.get(function(result) {
          expect(fp2.getIEPlugins).not.toHaveBeenCalled();
          done();
        });
      });

    });

    describe("returns components", function () {
      it("does it return components as a second argument to callback", function (done) {
        var fp2 = new Fingerprint2();
        var resultTuple = fp2.getWithComponents();
        var components = resultTuple[1];
        expect(components).not.toBeNull();

        fp2 = new Fingerprint2();
        fp2.get(function(result, components) {
          expect(components).not.toBeNull();
          done();
        });
      });

      it("checks if returned components is array", function (done) {
        var fp2 = new Fingerprint2();
        var resultTuple = fp2.getWithComponents();
        var components = resultTuple[1];
        expect(components).toBeArrayOfObjects();

        fp2 = new Fingerprint2();
        fp2.get(function(result, components) {
          expect(components).toBeArrayOfObjects();
          done();
        });
      });

      it("checks if js_fonts component is array", function (done) {
        var fp2 = new Fingerprint2();
        fp2.get(function(result, components) {
          for(var x = 0; x < components.length; x++) {
            if(components[x].key == "js_fonts") {
                expect(components[x].value).toBeArray();
            }
          }
          done();
        });
      });

      it("returns user_agent as the first element", function (done) {
        var fp2 = new Fingerprint2();
        fp2.get(function(result, components) {
          expect(components[0].key).toEqual("user_agent");
          done();
        });
      });
    });

    describe("baseFontArray iteration", function () {
      it("only iterates specified items", function (done) {
        var baseFonts = ["monospace", "sans-serif", "serif"];
        var ctr = 0;
        for (var x in baseFonts) {
          ctr++;
        }

        expect(baseFonts.length).toEqual(3);
        expect(ctr).toEqual(baseFonts.length);

        // Somewhere deep in your JavaScript library...
        Array.prototype.foo = 1;
        Array.prototype.bar = 2;
        ctr = 0;
        for (var x in baseFonts) {
          console.log(x);
          ctr++;
          // Now foo & bar is a part of EVERY array and
          // will show up here as a value of 'x'.
        }

        expect(baseFonts.length).toEqual(3);
        // sadface
        expect(ctr).not.toEqual(baseFonts.length);
        expect(ctr).toEqual(5);
        done();
      });
    });

    describe("userDefinedFonts option", function () {
      it("concatinates existing fonts with user-defined", function (done) {
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

        expect(fontList.length).toEqual(65);
        var userDefinedFonts = [];
        fontList.concat(userDefinedFonts);
        expect(fontList.length).toEqual(65);


        userDefinedFonts = ["Adria Grotesk", "Butler", "Nimbus Mono"];
        expect(userDefinedFonts.length).toEqual(3);
        fontList = fontList.concat(userDefinedFonts);
        expect(fontList.length).toEqual(65 + 3);
        done();
      });
    });
  });
});

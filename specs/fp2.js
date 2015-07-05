"use strict";
describe("Fingerprint2", function () {
  describe("new", function () {
    it("creates a new instance of FP2", function () {
      expect(new Fingerprint2()).not.toBeNull();
    });
  });

  describe("get", function () {
    it("calculates fingerprint with default options", function () {
      var fp2 = new Fingerprint2();
      fp2.get(function(result){
        expect(result).not.toBeNull();
      });
    });
  });
});

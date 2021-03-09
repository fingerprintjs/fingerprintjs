import getVendorFlavors from './vendor_flavors'

describe('Sources', () => {
  describe('vendorFlavors', () => {
    it("doesn't fail", () => {
      const flavors = getVendorFlavors()
      expect(flavors).toBeInstanceOf(Array)
      for (let i = 0; i < flavors.length; ++i) {
        expect(typeof flavors[i])
          .withContext(`The item #${i}`)
          .toBe('string')
      }
    })
  })
})

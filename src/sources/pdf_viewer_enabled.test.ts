import isPdfViewerEnabled from './pdf_viewer_enabled'

describe('Sources', () => {
  describe('pdvViewerEnabled', () => {
    it('returns boolean or undefined', () => {
      expect(['boolean', 'undefined']).toContain(typeof isPdfViewerEnabled())
    })
  })
})

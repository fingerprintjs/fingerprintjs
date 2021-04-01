import { withMockMatchMedia } from '../../tests/utils'
import getContrastPreference, { ContrastPreference } from './contrast'

describe('Sources', () => {
  describe('contrast', () => {
    it('handles browser native value', () => {
      expect([
        undefined,
        ContrastPreference.Less,
        ContrastPreference.None,
        ContrastPreference.More,
        ContrastPreference.ForcedColors,
      ]).toContain(getContrastPreference())
    })

    it('handles various cases', async () => {
      await withMockMatchMedia({ 'prefers-contrast': [undefined] }, true, () =>
        expect(getContrastPreference()).toBeUndefined(),
      )
      await withMockMatchMedia({ 'prefers-contrast': ['no-preference'] }, true, () =>
        expect(getContrastPreference()).toBe(ContrastPreference.None),
      )
      await withMockMatchMedia({ 'prefers-contrast': ['high'] }, true, () =>
        expect(getContrastPreference()).toBe(ContrastPreference.More),
      )
      await withMockMatchMedia({ 'prefers-contrast': ['more'] }, true, () =>
        expect(getContrastPreference()).toBe(ContrastPreference.More),
      )
      await withMockMatchMedia({ 'prefers-contrast': ['low'] }, true, () =>
        expect(getContrastPreference()).toBe(ContrastPreference.Less),
      )
      await withMockMatchMedia({ 'prefers-contrast': ['less'] }, true, () =>
        expect(getContrastPreference()).toBe(ContrastPreference.Less),
      )
      await withMockMatchMedia({ 'prefers-contrast': ['forced'] }, true, () =>
        expect(getContrastPreference()).toBe(ContrastPreference.ForcedColors),
      )
    })
  })
})

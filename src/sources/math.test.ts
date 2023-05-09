import getMathFingerprint from './math'

const expectedKeys = [
  'acos',
  'acosh',
  'acoshPf',
  'asin',
  'asinh',
  'asinhPf',
  'atanh',
  'atanhPf',
  'atan',
  'sin',
  'sinh',
  'sinhPf',
  'cos',
  'cosh',
  'coshPf',
  'tan',
  'tanh',
  'tanhPf',
  'exp',
  'expm1',
  'expm1Pf',
  'log1p',
  'log1pPf',
  'powPI',
]

describe('Sources', () => {
  describe('math', () => {
    it('works correctly', () => {
      const data = getMathFingerprint()

      let sum = 0

      for (const key of expectedKeys) {
        const value = data[key]
        expect(typeof value).toBe('number')
        sum += value
      }

      expect(sum).not.toBe(0)
    })

    it('returns stable values', () => {
      const first = getMathFingerprint()
      const second = getMathFingerprint()

      expect(second).toEqual(first)
    })
  })
})

import { toFloat, toInt } from './data'

describe('Data utilities', () => {
  it('converts to integer', () => {
    expect(toInt(42)).toBe(42)
    expect(toInt(12.6)).toBe(12)
    expect(toInt(-273)).toBe(-273)
    expect(toInt(-1.5)).toBe(-1)
    expect(toInt('42')).toBe(42)
    expect(toInt('12.6')).toBe(12)
    expect(toInt('-273')).toBe(-273)
    expect(toInt('-1.5')).toBe(-1)
    expect(toInt('foo')).toBeNaN()
  })

  it('converts to float', () => {
    expect(toFloat(42)).toBe(42)
    expect(toFloat(12.6)).toBe(12.6)
    expect(toFloat(-273)).toBe(-273)
    expect(toFloat(-1.5)).toBe(-1.5)
    expect(toFloat('42')).toBe(42)
    expect(toFloat('12.6')).toBe(12.6)
    expect(toFloat('-273')).toBe(-273)
    expect(toFloat('-1.5')).toBe(-1.5)
    expect(toFloat('foo')).toBeNaN()
  })
})

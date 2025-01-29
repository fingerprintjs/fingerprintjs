import { areSetsEqual, getUTF8Bytes, maxInIterator, parseSimpleCssSelector, round, toFloat, toInt } from './data'

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

  it('rounds', () => {
    expect(round(7.9)).toBe(8)
    expect(round(29847.23, 10)).toBe(29850)
    expect(round(0.1234321, 0.0001)).toBe(0.1234)
    expect(round(-234.65, 2)).toBe(-234)
    expect(round(4.2, -5)).toBe(5)
    expect(round(-36.6, -1)).toBe(-37)
    expect(round(NaN)).toBeNaN()
    expect(round(NaN, 10)).toBeNaN()
    expect(round(1.5, NaN)).toBeNaN()
  })

  it('parses CSS selectors', () => {
    expect(parseSimpleCssSelector('#narrow_ad_unit.top-menu-ads.foo_bar')).toEqual([
      undefined,
      { id: ['narrow_ad_unit'], class: ['top-menu-ads', 'foo_bar'] },
    ])
    expect(parseSimpleCssSelector('a[href^="https://syndication.optimizesrv.com/splash.php?"]')).toEqual([
      'a',
      { href: ['https://syndication.optimizesrv.com/splash.php?'] },
    ])
    expect(parseSimpleCssSelector(' img[width="460"][height=60 i]')).toEqual([
      'img',
      { width: ['460'], height: ['60'] },
    ])
    expect(parseSimpleCssSelector('a[href^="https://www.adultempire.com/"][href*="?partner_id="]')).toEqual([
      'a',
      { href: ['https://www.adultempire.com/', '?partner_id='] },
    ])
    expect(parseSimpleCssSelector('.mainmenu[style="padding:10px 0 0 0 !important;"]')).toEqual([
      undefined,
      { class: ['mainmenu'], style: ['padding:10px 0 0 0 !important;'] },
    ])
  })

  it('checks whether sets are equal', () => {
    if (typeof Set === 'undefined') {
      return
    }

    const makeSet = (...values: unknown[]): Set<unknown> => {
      const set = new Set() // Just `new Set(values)` doesn't work in IE11
      for (const value of values) {
        set.add(value)
      }
      return set
    }

    const set = makeSet('foo', 'bar')
    expect(areSetsEqual(set, set)).toBeTrue()
    expect(areSetsEqual(makeSet('hello', 1, set), makeSet(1, set, 'hello'))).toBeTrue()
    expect(areSetsEqual(makeSet({}), makeSet({}))).toBeFalse()
    expect(areSetsEqual(makeSet(), makeSet())).toBeTrue()
    expect(areSetsEqual(makeSet('Hello', 'world'), makeSet('Hello, world'))).toBeFalse()
  })

  it('gets maximum in iterator', () => {
    function* generator() {
      yield { val: 3 }
      yield { val: 2 }
      yield { val: 6 }
      yield { val: 1 }
      yield { val: 5 }
      yield { val: 4 }
      yield { val: 8 }
      yield { val: 7 }
    }

    function* emptyGenerator() {
      // Nothing
    }
    expect(maxInIterator(generator(), (item) => item.val)).toEqual({ val: 8 })
    expect(maxInIterator(generator(), (item) => -item.val)).toEqual({ val: 1 })
    expect(maxInIterator(generator(), (item) => (item.val % 2 === 0 ? item.val : item.val * 2))).toEqual({ val: 7 })
    expect(maxInIterator(emptyGenerator(), () => Math.random())).toBeUndefined()
  })

  it('converts string to UTF8 bytes', () => {
    expect(getUTF8Bytes('Hello, world!')).toEqual(
      new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]),
    )
    expect(getUTF8Bytes('fё%?=🤔')).toEqual(new Uint8Array([102, 209, 145, 37, 63, 61, 240, 159, 164, 148]))
  })
})

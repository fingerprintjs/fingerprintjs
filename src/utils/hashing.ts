/**
 * Adds two 64-bit values (provided as tuples of 32-bit values)
 * and updates (mutates) first value to write the result
 */
function x64Add(m: number[], n: number[]): void {
  const m0 = m[0] >>> 16,
    m1 = m[0] & 0xffff,
    m2 = m[1] >>> 16,
    m3 = m[1] & 0xffff

  const n0 = n[0] >>> 16,
    n1 = n[0] & 0xffff,
    n2 = n[1] >>> 16,
    n3 = n[1] & 0xffff

  let o0 = 0,
    o1 = 0,
    o2 = 0,
    o3 = 0
  o3 += m3 + n3
  o2 += o3 >>> 16
  o3 &= 0xffff
  o2 += m2 + n2
  o1 += o2 >>> 16
  o2 &= 0xffff
  o1 += m1 + n1
  o0 += o1 >>> 16
  o1 &= 0xffff
  o0 += m0 + n0
  o0 &= 0xffff

  m[0] = (o0 << 16) | o1
  m[1] = (o2 << 16) | o3
}

/**
 * Multiplies two 64-bit values (provided as tuples of 32-bit values)
 * and updates (mutates) first value to write the result
 */
function x64Multiply(m: number[], n: number[]): void {
  const m0 = m[0] >>> 16,
    m1 = m[0] & 0xffff,
    m2 = m[1] >>> 16,
    m3 = m[1] & 0xffff

  const n0 = n[0] >>> 16,
    n1 = n[0] & 0xffff,
    n2 = n[1] >>> 16,
    n3 = n[1] & 0xffff
  let o0 = 0,
    o1 = 0,
    o2 = 0,
    o3 = 0

  o3 += m3 * n3
  o2 += o3 >>> 16
  o3 &= 0xffff
  o2 += m2 * n3
  o1 += o2 >>> 16
  o2 &= 0xffff
  o2 += m3 * n2
  o1 += o2 >>> 16
  o2 &= 0xffff
  o1 += m1 * n3
  o0 += o1 >>> 16
  o1 &= 0xffff
  o1 += m2 * n2
  o0 += o1 >>> 16
  o1 &= 0xffff
  o1 += m3 * n1
  o0 += o1 >>> 16
  o1 &= 0xffff
  o0 += m0 * n3 + m1 * n2 + m2 * n1 + m3 * n0
  o0 &= 0xffff

  m[0] = (o0 << 16) | o1
  m[1] = (o2 << 16) | o3
}

/**
 * Provides left rotation of the given int64 value (provided as tuple of two int32)
 * by given number of bits. Result is written back to the value
 */
function x64Rotl(m: number[], bits: number): void {
  const m0 = m[0]
  bits %= 64
  if (bits === 32) {
    m[0] = m[1]
    m[1] = m0
  } else if (bits < 32) {
    m[0] = (m0 << bits) | (m[1] >>> (32 - bits))
    m[1] = (m[1] << bits) | (m0 >>> (32 - bits))
  } else {
    bits -= 32
    m[0] = (m[1] << bits) | (m0 >>> (32 - bits))
    m[1] = (m0 << bits) | (m[1] >>> (32 - bits))
  }
}

/**
 * Provides a left shift of the given int32 value (provided as tuple of [0, int32])
 * by given number of bits. Result is written back to the value
 */
function x64LeftShift(m: number[], bits: number): void {
  bits %= 64
  if (bits === 0) {
    return
  } else if (bits < 32) {
    m[0] = m[1] >>> (32 - bits)
    m[1] = m[1] << bits
  } else {
    m[0] = m[1] << (bits - 32)
    m[1] = 0
  }
}
/**
 * Provides a XOR of the given int64 values(provided as tuple of two int32).
 * Result is written back to the first value
 */
function x64Xor(m: number[], n: number[]): void {
  m[0] ^= n[0]
  m[1] ^= n[1]
}

const F1 = [0xff51afd7, 0xed558ccd]
const F2 = [0xc4ceb9fe, 0x1a85ec53]
/**
 * Calculates murmurHash3's final x64 mix of that block and writes result back to the input value.
 * (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
 * only place where we need to right shift 64bit ints.)
 */
function x64Fmix(h: number[]): void {
  const shifted = [0, h[0] >>> 1]
  x64Xor(h, shifted)
  x64Multiply(h, F1)
  shifted[1] = h[0] >>> 1
  x64Xor(h, shifted)
  x64Multiply(h, F2)
  shifted[1] = h[0] >>> 1
  x64Xor(h, shifted)
}

const C1 = [0x87c37b91, 0x114253d5]
const C2 = [0x4cf5ad43, 0x2745937f]
const M = [0, 5]
const N1 = [0, 0x52dce729]
const N2 = [0, 0x38495ab5]
/**
 * Given a string and an optional seed as an int, returns a 128 bit
 * hash using the x64 flavor of MurmurHash3, as an unsigned hex.
 * All internal functions mutates passed value to achieve minimal memory allocations and GC load
 *
 * Benchmark https://jsbench.me/p4lkpaoabi/2
 */
export function x64hash128(key: string, seed?: number): string {
  seed = seed || 0
  const h1 = [0, seed]
  const h2 = [0, seed]
  const k1 = [0, 0]
  const k2 = [0, 0]
  const length = key.length
  let byteLength = 0

  let i = 0
  let remainder = 0
  let overflow = 0
  const chunk = new Array(20) // legnth calculated as 16 + 4 to respect 4-byte overflow

  while (i < length) {
    for (let k = 0; k < overflow; k++) {
      chunk[k] = chunk[16 + k]
    }
    let j = overflow
    overflow = 0
    while (j < 16 && i < length) {
      const codePoint = key.codePointAt(i) as number
      if (isSurrogatePairCodePoint(codePoint)) {
        // Skips next char since it's a part of the current code point
        i++
      }

      // UTF-8 encoding algorithm https://www.herongyang.com/Unicode/UTF-8-UTF-8-Encoding.html
      if (codePoint < 0x80) {
        chunk[j] = codePoint
        j++
      } else if (codePoint < 0x0800) {
        chunk[j] = (codePoint >> 6) | 0xc0
        chunk[j + 1] = (codePoint & 0x3f) | 0x80
        j += 2
      } else if (codePoint < 0x010000) {
        chunk[j] = (codePoint >> 12) | 0xe0
        chunk[j + 1] = ((codePoint >> 6) & 0x3f) | 0x80
        chunk[j + 2] = (codePoint & 0x3f) | 0x80
        j += 3
      } else {
        chunk[j] = ((codePoint >> 18) & 0x07) | 0xf0
        chunk[j + 1] = ((codePoint >> 12) & 0x3f) | 0x80
        chunk[j + 2] = ((codePoint >> 6) & 0x3f) | 0x80
        chunk[j + 3] = (codePoint & 0x3f) | 0x80
        j += 4
      }
      i++
    }

    // If we have less than 16 bytes - go straight to remainder logic
    if (j < 16) {
      remainder = j
      break
    }

    // If we have more than 16 bytes - we need to process the overflow in the next iteration
    if (j > 16) {
      overflow = j - 16
    }

    byteLength += 16

    k1[0] = chunk[4] | (chunk[5] << 8) | (chunk[6] << 16) | (chunk[7] << 24)
    k1[1] = chunk[0] | (chunk[1] << 8) | (chunk[2] << 16) | (chunk[3] << 24)
    k2[0] = chunk[12] | (chunk[13] << 8) | (chunk[14] << 16) | (chunk[15] << 24)
    k2[1] = chunk[8] | (chunk[9] << 8) | (chunk[10] << 16) | (chunk[11] << 24)

    x64Multiply(k1, C1)
    x64Rotl(k1, 31)
    x64Multiply(k1, C2)
    x64Xor(h1, k1)
    x64Rotl(h1, 27)
    x64Add(h1, h2)
    x64Multiply(h1, M)
    x64Add(h1, N1)
    x64Multiply(k2, C2)
    x64Rotl(k2, 33)
    x64Multiply(k2, C1)
    x64Xor(h2, k2)
    x64Rotl(h2, 31)
    x64Add(h2, h1)
    x64Multiply(h2, M)
    x64Add(h2, N2)
  }

  byteLength += remainder

  k1[0] = 0
  k1[1] = 0
  k2[0] = 0
  k2[1] = 0

  const val = [0, 0]

  switch (remainder) {
    case 15:
      val[1] = chunk[14]
      x64LeftShift(val, 48)
      x64Xor(k2, val)
    // fallthrough
    case 14:
      val[1] = chunk[13]
      x64LeftShift(val, 40)
      x64Xor(k2, val)
    // fallthrough
    case 13:
      val[1] = chunk[12]
      x64LeftShift(val, 32)
      x64Xor(k2, val)
    // fallthrough
    case 12:
      val[1] = chunk[11]
      x64LeftShift(val, 24)
      x64Xor(k2, val)
    // fallthrough
    case 11:
      val[1] = chunk[10]
      x64LeftShift(val, 16)
      x64Xor(k2, val)
    // fallthrough
    case 10:
      val[1] = chunk[9]
      x64LeftShift(val, 8)
      x64Xor(k2, val)
    // fallthrough
    case 9:
      val[1] = chunk[8]

      x64Xor(k2, val)
      x64Multiply(k2, C2)
      x64Rotl(k2, 33)
      x64Multiply(k2, C1)
      x64Xor(h2, k2)
    // fallthrough
    case 8:
      val[1] = chunk[7]
      x64LeftShift(val, 56)
      x64Xor(k1, val)
    // fallthrough
    case 7:
      val[1] = chunk[6]
      x64LeftShift(val, 48)
      x64Xor(k1, val)
    // fallthrough
    case 6:
      val[1] = chunk[5]
      x64LeftShift(val, 40)
      x64Xor(k1, val)
    // fallthrough
    case 5:
      val[1] = chunk[4]
      x64LeftShift(val, 32)
      x64Xor(k1, val)
    // fallthrough
    case 4:
      val[1] = chunk[3]
      x64LeftShift(val, 24)
      x64Xor(k1, val)
    // fallthrough
    case 3:
      val[1] = chunk[2]
      x64LeftShift(val, 16)
      x64Xor(k1, val)
    // fallthrough
    case 2:
      val[1] = chunk[1]
      x64LeftShift(val, 8)
      x64Xor(k1, val)
    // fallthrough
    case 1:
      val[1] = chunk[0]

      x64Xor(k1, val)
      x64Multiply(k1, C1)
      x64Rotl(k1, 31)
      x64Multiply(k1, C2)
      x64Xor(h1, k1)
    // fallthrough
  }

  const byteLength64 = [0, byteLength]
  x64Xor(h1, byteLength64)
  x64Xor(h2, byteLength64)
  x64Add(h1, h2)
  x64Add(h2, h1)
  x64Fmix(h1)
  x64Fmix(h2)
  x64Add(h1, h2)
  x64Add(h2, h1)
  return (
    ('00000000' + (h1[0] >>> 0).toString(16)).slice(-8) +
    ('00000000' + (h1[1] >>> 0).toString(16)).slice(-8) +
    ('00000000' + (h2[0] >>> 0).toString(16)).slice(-8) +
    ('00000000' + (h2[1] >>> 0).toString(16)).slice(-8)
  )
}

function isSurrogatePairCodePoint(codePoint: number) {
  return codePoint > 0xffff
}

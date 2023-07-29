/*
 * Taken from https://github.com/karanlyons/murmurHash3.js/blob/a33d0723127e2e5415056c455f8aed2451ace208/murmurHash3.js
 */

//
// Given two 64bit ints (as an array of two 32bit ints) returns the two
// added together as a 64bit int (as an array of two 32bit ints).
//
function x64Add(m: number[], n: number[]) {
  m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff]
  n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff]
  let o0 = 0,
    o1 = 0,
    o2 = 0,
    o3 = 0
  o3 += m[3] + n[3]
  o2 += o3 >>> 16
  o3 &= 0xffff
  o2 += m[2] + n[2]
  o1 += o2 >>> 16
  o2 &= 0xffff
  o1 += m[1] + n[1]
  o0 += o1 >>> 16
  o1 &= 0xffff
  o0 += m[0] + n[0]
  o0 &= 0xffff
  return [(o0 << 16) | o1, (o2 << 16) | o3]
}

/**
 * Multiplies two 64-bit values (provided as tuples of 32-bit values)
 * and updates (mutates first value to write the result
 */
function x64Multiply(m: number[], n: number[]) {
  m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff]
  n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff]
  let o0 = 0,
    o1 = 0,
    o2 = 0,
    o3 = 0
  o3 += m[3] * n[3]
  o2 += o3 >>> 16
  o3 &= 0xffff
  o2 += m[2] * n[3]
  o1 += o2 >>> 16
  o2 &= 0xffff
  o2 += m[3] * n[2]
  o1 += o2 >>> 16
  o2 &= 0xffff
  o1 += m[1] * n[3]
  o0 += o1 >>> 16
  o1 &= 0xffff
  o1 += m[2] * n[2]
  o0 += o1 >>> 16
  o1 &= 0xffff
  o1 += m[3] * n[1]
  o0 += o1 >>> 16
  o1 &= 0xffff
  o0 += m[0] * n[3] + m[1] * n[2] + m[2] * n[1] + m[3] * n[0]
  o0 &= 0xffff
  return [(o0 << 16) | o1, (o2 << 16) | o3]
}

/**
 * Provides left rotation of the given int64 value (provided as tuple of two int32)
 * by given number of bits
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
//
// Given two 64bit ints (as an array of two 32bit ints) returns the two
// xored together as a 64bit int (as an array of two 32bit ints).
//
function x64Xor(m: number[], n: number[]) {
  return [m[0] ^ n[0], m[1] ^ n[1]]
}
//
// Given a block, returns murmurHash3's final x64 mix of that block.
// (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
// only place where we need to right shift 64bit ints.)
//
function x64Fmix(h: number[]) {
  h = x64Xor(h, [0, h[0] >>> 1])
  h = x64Multiply(h, [0xff51afd7, 0xed558ccd])
  h = x64Xor(h, [0, h[0] >>> 1])
  h = x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53])
  h = x64Xor(h, [0, h[0] >>> 1])
  return h
}

function encode(text: string): Uint8Array {
  // Benchmark: https://jsbench.me/b6klaaxgwq/1
  // If you want to just count bytes, see solutions at https://jsbench.me/ehklab415e/1
  if (typeof TextEncoder === 'function') {
    return new TextEncoder().encode(text) // From https://stackoverflow.com/a/11411402/1118709
  }

  // From https://stackoverflow.com/a/18722848/1118709
  const binaryText = unescape(encodeURI(text))
  const bytes = new Uint8Array(binaryText.length)

  for (let i = 0; i < binaryText.length; ++i) {
    bytes[i] = binaryText.charCodeAt(i)
  }

  return bytes
}

function getUTF8Bytes(input: string) {
  const result = new Uint8Array(input.length)
  for (let i = 0; i < input.length; i++) {
    // `charCode` is faster than encoding so we prefer that when it's possible
    const charCode = input.charCodeAt(i)

    // In case of non-ASCII symbols we use proper encoding
    if (charCode < 0 || charCode > 127) {
      return encode(input)
    }
    result[i] = charCode
  }
  return result
}

//
// Given a string and an optional seed as an int, returns a 128 bit
// hash using the x64 flavor of MurmurHash3, as an unsigned hex.
//
export function x64hash128(input: string, seed?: number): string {
  const key = getUTF8Bytes(input)
  seed = seed || 0
  const remainder = key.length % 16
  const bytes = key.length - remainder
  let h1 = [0, seed]
  let h2 = [0, seed]
  let k1 = [0, 0]
  let k2 = [0, 0]
  const c1 = [0x87c37b91, 0x114253d5]
  const c2 = [0x4cf5ad43, 0x2745937f]
  let i: number
  for (i = 0; i < bytes; i = i + 16) {
    k1[0] = key[i + 4] | (key[i + 5] << 8) | (key[i + 6] << 16) | (key[i + 7] << 24)
    k1[1] = key[i] | (key[i + 1] << 8) | (key[i + 2] << 16) | (key[i + 3] << 24)
    k2[0] = key[i + 12] | (key[i + 13] << 8) | (key[i + 14] << 16) | (key[i + 15] << 24)
    k2[1] = key[i + 8] | (key[i + 9] << 8) | (key[i + 10] << 16) | (key[i + 11] << 24)

    k1 = x64Multiply(k1, c1)
    x64Rotl(k1, 31)
    k1 = x64Multiply(k1, c2)
    h1 = x64Xor(h1, k1)
    x64Rotl(h1, 27)
    h1 = x64Add(h1, h2)
    h1 = x64Add(x64Multiply(h1, [0, 5]), [0, 0x52dce729])
    k2 = x64Multiply(k2, c2)
    x64Rotl(k2, 33)
    k2 = x64Multiply(k2, c1)
    h2 = x64Xor(h2, k2)
    x64Rotl(h2, 31)
    h2 = x64Add(h2, h1)
    h2 = x64Add(x64Multiply(h2, [0, 5]), [0, 0x38495ab5])
  }
  k1[0] = 0
  k1[1] = 0
  k2[0] = 0
  k2[1] = 0
  const val = [0, 0]
  switch (remainder) {
    case 15:
      val[1] = key[i + 14]
      x64LeftShift(val, 48)
      k2 = x64Xor(k2, val)
    // fallthrough
    case 14:
      val[1] = key[i + 13]
      x64LeftShift(val, 40)
      k2 = x64Xor(k2, val)
    // fallthrough
    case 13:
      val[1] = key[i + 12]
      x64LeftShift(val, 32)
      k2 = x64Xor(k2, val)
    // fallthrough
    case 12:
      val[1] = key[i + 11]
      x64LeftShift(val, 24)
      k2 = x64Xor(k2, val)
    // fallthrough
    case 11:
      val[1] = key[i + 10]
      x64LeftShift(val, 16)
      k2 = x64Xor(k2, val)
    // fallthrough
    case 10:
      val[1] = key[i + 9]
      x64LeftShift(val, 8)
      k2 = x64Xor(k2, val)
    // fallthrough
    case 9:
      k2 = x64Xor(k2, [0, key[i + 8]])
      k2 = x64Multiply(k2, c2)
      x64Rotl(k2, 33)
      k2 = x64Multiply(k2, c1)
      h2 = x64Xor(h2, k2)
    // fallthrough
    case 8:
      val[1] = key[i + 7]
      x64LeftShift(val, 56)
      k1 = x64Xor(k1, val)
    // fallthrough
    case 7:
      val[1] = key[i + 6]
      x64LeftShift(val, 48)
      k1 = x64Xor(k1, val)
    // fallthrough
    case 6:
      val[1] = key[i + 5]
      x64LeftShift(val, 40)
      k1 = x64Xor(k1, val)
    // fallthrough
    case 5:
      val[1] = key[i + 4]
      x64LeftShift(val, 32)
      k1 = x64Xor(k1, val)
    // fallthrough
    case 4:
      val[1] = key[i + 3]
      x64LeftShift(val, 24)
      k1 = x64Xor(k1, val)
    // fallthrough
    case 3:
      val[1] = key[i + 2]
      x64LeftShift(val, 16)
      k1 = x64Xor(k1, val)
    // fallthrough
    case 2:
      val[1] = key[i + 1]
      x64LeftShift(val, 8)
      k1 = x64Xor(k1, val)
    // fallthrough
    case 1:
      k1 = x64Xor(k1, [0, key[i]])
      k1 = x64Multiply(k1, c1)
      x64Rotl(k1, 31)
      k1 = x64Multiply(k1, c2)
      h1 = x64Xor(h1, k1)
    // fallthrough
  }
  h1 = x64Xor(h1, [0, key.length])
  h2 = x64Xor(h2, [0, key.length])
  h1 = x64Add(h1, h2)
  h2 = x64Add(h2, h1)
  h1 = x64Fmix(h1)
  h2 = x64Fmix(h2)
  h1 = x64Add(h1, h2)
  h2 = x64Add(h2, h1)
  return (
    ('00000000' + (h1[0] >>> 0).toString(16)).slice(-8) +
    ('00000000' + (h1[1] >>> 0).toString(16)).slice(-8) +
    ('00000000' + (h2[0] >>> 0).toString(16)).slice(-8) +
    ('00000000' + (h2[1] >>> 0).toString(16)).slice(-8)
  )
}

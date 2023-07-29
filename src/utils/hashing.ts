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
  const o = [0, 0, 0, 0]
  o[3] += m[3] + n[3]
  o[2] += o[3] >>> 16
  o[3] &= 0xffff
  o[2] += m[2] + n[2]
  o[1] += o[2] >>> 16
  o[2] &= 0xffff
  o[1] += m[1] + n[1]
  o[0] += o[1] >>> 16
  o[1] &= 0xffff
  o[0] += m[0] + n[0]
  o[0] &= 0xffff
  return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]]
}

//
// Given two 64bit ints (as an array of two 32bit ints) returns the two
// multiplied together as a 64bit int (as an array of two 32bit ints).
//
function x64Multiply(m: number[], n: number[]) {
  m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff]
  n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff]
  const o = [0, 0, 0, 0]
  o[3] += m[3] * n[3]
  o[2] += o[3] >>> 16
  o[3] &= 0xffff
  o[2] += m[2] * n[3]
  o[1] += o[2] >>> 16
  o[2] &= 0xffff
  o[2] += m[3] * n[2]
  o[1] += o[2] >>> 16
  o[2] &= 0xffff
  o[1] += m[1] * n[3]
  o[0] += o[1] >>> 16
  o[1] &= 0xffff
  o[1] += m[2] * n[2]
  o[0] += o[1] >>> 16
  o[1] &= 0xffff
  o[1] += m[3] * n[1]
  o[0] += o[1] >>> 16
  o[1] &= 0xffff
  o[0] += m[0] * n[3] + m[1] * n[2] + m[2] * n[1] + m[3] * n[0]
  o[0] &= 0xffff
  return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]]
}

//
// Given a 64bit int (as an array of two 32bit ints) and an int
// representing a number of bit positions, returns the 64bit int (as an
// array of two 32bit ints) rotated left by that number of positions.
//
function x64Rotl(m: number[], n: number) {
  n %= 64
  if (n === 32) {
    return [m[1], m[0]]
  } else if (n < 32) {
    return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))]
  } else {
    n -= 32
    return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))]
  }
}

//
// Given a 64bit int (as an array of two 32bit ints) and an int
// representing a number of bit positions, returns the 64bit int (as an
// array of two 32bit ints) shifted left by that number of positions.
//
function x64LeftShift(m: number[], n: number) {
  n %= 64
  if (n === 0) {
    return m
  } else if (n < 32) {
    return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n]
  } else {
    return [m[1] << (n - 32), 0]
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
    k1 = [
      key[i + 4] | (key[i + 5] << 8) | (key[i + 6] << 16) | (key[i + 7] << 24),
      key[i] | (key[i + 1] << 8) | (key[i + 2] << 16) | (key[i + 3] << 24),
    ]
    k2 = [
      key[i + 12] | (key[i + 13] << 8) | (key[i + 14] << 16) | (key[i + 15] << 24),
      key[i + 8] | (key[i + 9] << 8) | (key[i + 10] << 16) | (key[i + 11] << 24),
    ]
    k1 = x64Multiply(k1, c1)
    k1 = x64Rotl(k1, 31)
    k1 = x64Multiply(k1, c2)
    h1 = x64Xor(h1, k1)
    h1 = x64Rotl(h1, 27)
    h1 = x64Add(h1, h2)
    h1 = x64Add(x64Multiply(h1, [0, 5]), [0, 0x52dce729])
    k2 = x64Multiply(k2, c2)
    k2 = x64Rotl(k2, 33)
    k2 = x64Multiply(k2, c1)
    h2 = x64Xor(h2, k2)
    h2 = x64Rotl(h2, 31)
    h2 = x64Add(h2, h1)
    h2 = x64Add(x64Multiply(h2, [0, 5]), [0, 0x38495ab5])
  }
  k1 = [0, 0]
  k2 = [0, 0]
  switch (remainder) {
    case 15:
      k2 = x64Xor(k2, x64LeftShift([0, key[i + 14]], 48))
    // fallthrough
    case 14:
      k2 = x64Xor(k2, x64LeftShift([0, key[i + 13]], 40))
    // fallthrough
    case 13:
      k2 = x64Xor(k2, x64LeftShift([0, key[i + 12]], 32))
    // fallthrough
    case 12:
      k2 = x64Xor(k2, x64LeftShift([0, key[i + 11]], 24))
    // fallthrough
    case 11:
      k2 = x64Xor(k2, x64LeftShift([0, key[i + 10]], 16))
    // fallthrough
    case 10:
      k2 = x64Xor(k2, x64LeftShift([0, key[i + 9]], 8))
    // fallthrough
    case 9:
      k2 = x64Xor(k2, [0, key[i + 8]])
      k2 = x64Multiply(k2, c2)
      k2 = x64Rotl(k2, 33)
      k2 = x64Multiply(k2, c1)
      h2 = x64Xor(h2, k2)
    // fallthrough
    case 8:
      k1 = x64Xor(k1, x64LeftShift([0, key[i + 7]], 56))
    // fallthrough
    case 7:
      k1 = x64Xor(k1, x64LeftShift([0, key[i + 6]], 48))
    // fallthrough
    case 6:
      k1 = x64Xor(k1, x64LeftShift([0, key[i + 5]], 40))
    // fallthrough
    case 5:
      k1 = x64Xor(k1, x64LeftShift([0, key[i + 4]], 32))
    // fallthrough
    case 4:
      k1 = x64Xor(k1, x64LeftShift([0, key[i + 3]], 24))
    // fallthrough
    case 3:
      k1 = x64Xor(k1, x64LeftShift([0, key[i + 2]], 16))
    // fallthrough
    case 2:
      k1 = x64Xor(k1, x64LeftShift([0, key[i + 1]], 8))
    // fallthrough
    case 1:
      k1 = x64Xor(k1, [0, key[i]])
      k1 = x64Multiply(k1, c1)
      k1 = x64Rotl(k1, 31)
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

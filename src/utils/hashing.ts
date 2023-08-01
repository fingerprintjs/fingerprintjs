import { getUTF8Bytes } from './data'

const C1 = BigInt('0x87c37b91114253d5')
const C2 = BigInt('0x4cf5ad432745937f')
const M = BigInt(5)
const N1 = BigInt(0x52dce729)
const N2 = BigInt(0x38495ab5)
const R1 = BigInt(31)
const R2 = BigInt(27)
const R3 = BigInt(33)
const INT64_MAX = BigInt('0xffffffffffffffff')
const INT64_LENGTH = BigInt(64)
const UINT64_MIN = BigInt(0)

/**
 * Provides left rotation of the given int64 value (provided as tuple of two int32)
 * by given number of bits. Result is written back to the value
 */
function rotl(m: bigint, bits: bigint): bigint {
  bits %= BigInt(64)

  return ((m << bits) | (m >> (INT64_LENGTH - bits))) & INT64_MAX
}

const F1 = BigInt('0xff51afd7ed558ccd')
const F2 = BigInt('0xc4ceb9fe1a85ec53')
const F_NUM_OF_BITS = BigInt(33)

function mul(a: bigint, b: bigint) {
  return (a * b) & INT64_MAX
}

function add(a: bigint, b: bigint) {
  return (a + b) & INT64_MAX
}

/**
 * Calculates murmurHash3's final x64 mix of that block and writes result back to the input value.
 * (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
 * only place where we need to right shift 64bit ints.)
 */
function fmix(h: bigint): bigint {
  h ^= h >> F_NUM_OF_BITS
  h = mul(h, F1)
  h ^= h >> F_NUM_OF_BITS
  h = mul(h, F2)
  h ^= h >> F_NUM_OF_BITS
  return h
}
/**
 * Returns a 128-bit hash of the given string (as a hex string)
 * using the x64 flavor of MurmurHash3, as an unsigned hex.
 * All internal functions mutates passed value to achieve minimal memory allocations and GC load
 *
 * Benchmark https://jsbench.me/p4lkpaoabi/1
 */
export function x64hash128(input: string, seed?: number): string {
  const data = getUTF8Bytes(input)
  const length = data.length
  const remainder = length % 16
  const bytes = length - remainder
  let h1 = BigInt(seed || 0)
  let h2 = BigInt(0)
  let k1: bigint
  let k2: bigint

  let i: number
  for (i = 0; i < bytes; i = i + 16) {
    k1 = getLittleEndianLong(data, i)
    k2 = getLittleEndianLong(data, i + 8)

    k1 = mul(k1, C1)
    k1 = rotl(k1, R1)
    k1 = mul(k1, C2)

    h1 ^= k1

    h1 = rotl(h1, R2)
    h1 = add(h1, h2)
    h1 = mul(h1, M) + N1

    k2 = mul(k2, C2)
    k2 = rotl(k2, R3)
    k2 = mul(k2, C1)
    h2 ^= k2
    h2 = rotl(h2, R1)
    h2 = add(h2, h1)
    h2 = mul(h2, M) + N2
  }

  k1 = UINT64_MIN
  k2 = UINT64_MIN

  switch (remainder) {
    case 15:
      k2 ^= shiftBytes(data, i, 14)
    // fallthrough
    case 14:
      k2 ^= shiftBytes(data, i, 13)
    // fallthrough
    case 13:
      k2 ^= shiftBytes(data, i, 12)
    // fallthrough
    case 12:
      k2 ^= shiftBytes(data, i, 11)
    // fallthrough
    case 11:
      k2 ^= shiftBytes(data, i, 10)
    // fallthrough
    case 10:
      k2 ^= shiftBytes(data, i, 9)
    // fallthrough
    case 9:
      k2 ^= shiftBytes(data, i, 8)

      k2 = mul(k2, C2)
      k2 = rotl(k2, R3)
      k2 = mul(k2, C1)
      h2 ^= k2
    // fallthrough
    case 8:
      k1 ^= shiftBytes(data, i, 7)
    // fallthrough
    case 7:
      k1 ^= shiftBytes(data, i, 6)
    // fallthrough
    case 6:
      k1 ^= shiftBytes(data, i, 5)
    // fallthrough
    case 5:
      k1 ^= shiftBytes(data, i, 4)
    // fallthrough
    case 4:
      k1 ^= shiftBytes(data, i, 3)
    // fallthrough
    case 3:
      k1 ^= shiftBytes(data, i, 2)
    // fallthrough
    case 2:
      k1 ^= shiftBytes(data, i, 1)
    // fallthrough
    case 1:
      k1 ^= shiftBytes(data, i, 0)
      k1 = mul(k1, C1)
      k1 = rotl(k1, R1)
      k1 = mul(k1, C2)

      h1 ^= k1
  }

  const lengthBigInt = BigInt(length)
  // finalization
  h1 ^= lengthBigInt
  h2 ^= lengthBigInt

  h1 = add(h1, h2)
  h2 = add(h2, h1)

  h1 = fmix(h1)
  h2 = fmix(h2)

  h1 = add(h1, h2)
  h2 = add(h2, h1)

  return ('0000000000000000' + h1.toString(16)).slice(-16) + ('0000000000000000' + h2.toString(16)).slice(-16)
}

function getLittleEndianLong(data: Uint8Array, index: number) {
  let number = BigInt(data[index])
  for (let i = 1; i < 8; i++) {
    number |= shiftBytes(data, index, i)
  }
  return number
}

function shiftBytes(data: Uint8Array, index: number, shift: number) {
  return BigInt(data[index + shift]) << BigInt((shift % 8) * 8)
}

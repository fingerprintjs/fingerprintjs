import { getUTF8Bytes } from './data'
import { hash } from '../../wasm-rust/pkg/rust_hash'

export function x64hash128(key: string, seed?: number): string {
  const inputBytes = getUTF8Bytes(key)
  const outputBytes = hash(inputBytes, seed || 0)

  return bytesToHex(outputBytes)
}

function bytesToHex(input: Uint8Array): string {
  const alpha = 'a'.charCodeAt(0) - 10
  const digit = '0'.charCodeAt(0)
  const chars = new Uint8Array(input.length * 2)

  let p = 0
  for (let i = 0; i < input.length; i++) {
    let nibble = input[i] >>> 4
    chars[p++] = nibble > 9 ? nibble + alpha : nibble + digit
    nibble = input[i] & 0xf
    chars[p++] = nibble > 9 ? nibble + alpha : nibble + digit
  }

  return String.fromCharCode.apply(null, chars as unknown as number[])
}

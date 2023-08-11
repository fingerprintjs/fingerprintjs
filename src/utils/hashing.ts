import { hash } from '../../wasm-rust/pkg/rust_hash'
const cachedTextEncoder = new TextEncoder()
export function x64hash128(key: string, seed?: number): string {
  const bytes = cachedTextEncoder.encode(key)
  return hash(bytes, seed || 0)
}

import { hash } from '../../wasm-rust/pkg/rust_hash'

export function x64hash128(key: string, seed?: number): string {
  return hash(key, seed || 0)
}

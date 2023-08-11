use wasm_bindgen::prelude::*;
use mur3;

#[wasm_bindgen]
pub fn hash(s: String, seed: u32) -> String {
    let (high, low) = mur3::murmurhash3_x64_128(s.as_bytes(), seed);
    format!("{:x}{:x}", high, low)
}

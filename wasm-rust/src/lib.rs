use wasm_bindgen::prelude::*;
use mur3;

#[wasm_bindgen]
pub fn hash(s: &[u8], seed: u32) -> Vec<u8> {
    let (high, low) = mur3::murmurhash3_x64_128(s, seed);

    [high.to_be_bytes().as_ref(), &low.to_be_bytes()].concat()
}

.PHONY: build
build:
	wasm-pack build --target web
	wasm-opt -Os -o pkg/rust_hash_bg.wasm pkg/rust_hash_bg.wasm

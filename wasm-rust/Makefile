.PHONY: build
build:
	wasm-pack build --target web
	wasm-opt -Oz -o pkg/rust_hash_bg.wasm pkg/rust_hash_bg.wasm

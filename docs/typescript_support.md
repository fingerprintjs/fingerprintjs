# TypeScript support

FingerprintJS has built-in TypeScript types.
In order to use them, just install the library and import it in a `.ts` file:

```bash
npm i @fingerprintjs/fingerprintjs
# or
yarn add @fingerprintjs/fingerprintjs
```

```ts
import FingerprintJS from '@fingerprintjs/fingerprintjs'
```

FingerprintJS officially supports TypeScript version 4.9,
but may work with newer and older versions of TypeScript.
If you face a TypeScript error that occurs in a `.d.ts` file provided by FingerprintJS
([example 1](https://github.com/fingerprintjs/fingerprintjs/issues/651), [example 2](https://github.com/fingerprintjs/fingerprintjs/issues/653)),
consider any of these solutions:

- Update the TypeScript package in your project to version 4.9 or newer
    ```bash
    npm i typescript@^4.9
    # or
    yarn add typescript@^4.9
    ```
- Prevent TypeScript from using the library types. To do it, replace
    ```ts
    import ... from '@fingerprintjs/fingerprintjs'
    ```
    with
    ```ts
    import ... from '@fingerprintjs/fingerprintjs/dist/fp.esm'
    ```
    in your `.ts` files, and add the following line to a `.d.ts` file (if there is no such file, create one anywhere with any name):
    ```
    declare module '@fingerprintjs/fingerprintjs/dist/fp.esm'
    ```

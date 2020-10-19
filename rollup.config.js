import * as path from 'path'
import jsonPlugin from '@rollup/plugin-json'
import { nodeResolve as nodeResolvePlugin } from '@rollup/plugin-node-resolve'
import typescriptPlugin from '@rollup/plugin-typescript'
import { terser as terserPlugin } from 'rollup-plugin-terser'
import dtsPlugin from 'rollup-plugin-dts'
import licensePlugin from 'rollup-plugin-license'
import { dependencies } from './package.json'
import terserOptions from './terser.config'

const outputDirectory = 'dist'

const commonBanner = licensePlugin({
  banner: {
    content: {
      file: path.join(__dirname, 'resources', 'license_banner.txt'),
    },
  },
})

const commonInput = {
  input: './src/index.ts',
  plugins: [
    nodeResolvePlugin(),
    jsonPlugin(),
    typescriptPlugin({
      declaration: false,
    }),
    commonBanner,
  ],
}

const commonOutput = {
  name: 'FingerprintJS',
  exports: 'named',
}

const commonTerser = terserPlugin(terserOptions)

export default [
  // Browser bundles. They have all the dependencies included for convenience.
  {
    ...commonInput,
    output: [
      // IIFE for users who use Require.js or Electron and want to just call `window.FingerprintJS.load()`
      {
        ...commonOutput,
        file: `${outputDirectory}/fp.js`,
        format: 'iife',
      },
      {
        ...commonOutput,
        file: `${outputDirectory}/fp.min.js`,
        format: 'iife',
        plugins: [commonTerser],
      },

      // UMD for users who use Require.js or Electron and want to leverage them
      {
        ...commonOutput,
        file: `${outputDirectory}/fp.umd.js`,
        format: 'umd',
      },
      {
        ...commonOutput,
        file: `${outputDirectory}/fp.umd.min.js`,
        format: 'umd',
        plugins: [commonTerser],
      },
    ],
  },

  // NPM bundles. They have all the dependencies excluded for end code size optimization.
  {
    ...commonInput,
    external: Object.keys(dependencies),
    output: [
      // CJS for usage with `require()`
      {
        ...commonOutput,
        file: `${outputDirectory}/fp.cjs.js`,
        format: 'cjs',
      },

      // ESM for usage with `import`
      {
        ...commonOutput,
        file: `${outputDirectory}/fp.esm.js`,
        format: 'es',
      },
    ],
  },

  // TypeScript definition
  {
    ...commonInput,
    plugins: [dtsPlugin(), commonBanner],
    output: {
      file: `${outputDirectory}/fp.d.ts`,
      format: 'es',
    },
  },
]

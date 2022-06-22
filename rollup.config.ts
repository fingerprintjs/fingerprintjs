import * as path from 'path'
import type { RollupOptions, OutputOptions } from 'rollup'
import jsonPlugin from '@rollup/plugin-json'
import nodeResolvePlugin from '@rollup/plugin-node-resolve'
import typescriptPlugin from '@rollup/plugin-typescript'
import replacePlugin from '@rollup/plugin-replace'
import { terser as terserPlugin } from 'rollup-plugin-terser'
import dtsPlugin from 'rollup-plugin-dts'
import licensePlugin from 'rollup-plugin-license'
import terserConfig from './terser.config'
import { dependencies } from './package.json'

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
  plugins: [nodeResolvePlugin(), jsonPlugin(), typescriptPlugin(), commonBanner],
}

const commonOutput: OutputOptions = {
  name: 'FingerprintJS',
  exports: 'named',
}

const commonTerser = terserPlugin(terserConfig)

const config: RollupOptions[] = [
  // Browser bundles. They have all the dependencies included for convenience.
  {
    ...commonInput,
    plugins: [
      ...commonInput.plugins,
      // The monitoring is disabled in the browser bundles temporarily because these bundles are served from jsDelivr,
      // and we don't want the script to send monitoring requests unexpectedly for the website owners.
      // todo: Remove this plugin when there are more downloads from our CDN than from jsDelivr, or after 2022-02-11
      replacePlugin({
        values: { 'window.__fpjs_d_m': 'true' },
        preventAssignment: true,
        exclude: '**/node_modules/**',
      }),
    ],
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

export default config

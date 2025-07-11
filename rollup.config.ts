import * as fs from 'fs'
import type { RollupOptions } from 'rollup'
import jsonPlugin from '@rollup/plugin-json'
import nodeResolvePlugin from '@rollup/plugin-node-resolve'
import typescriptPlugin from '@rollup/plugin-typescript'
import terserPlugin from '@rollup/plugin-terser'
import dtsPlugin from 'rollup-plugin-dts'
import licensePlugin from 'rollup-plugin-license'
import terserConfig from './terser.config'

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const dependencies = pkg.dependencies || {}

const outputDirectory = 'dist'

const commonInput = {
  input: 'src/index.ts',
  plugins: [nodeResolvePlugin(), jsonPlugin(), typescriptPlugin()],
}

const commonOutput = {
  name: 'FingerprintJS',
  exports: 'named' as const,
  plugins: [
    licensePlugin({
      banner: {
        content: {
          file: 'resources/license_banner.txt',
        },
        data: {
          license: fs.readFileSync('LICENSE', 'utf8').trim(),
        },
      },
    }),
  ],
}

const commonTerser = terserPlugin(terserConfig)

const config: RollupOptions[] = [
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
        plugins: [commonTerser, ...commonOutput.plugins],
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
        plugins: [commonTerser, ...commonOutput.plugins],
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
        format: 'esm',
      },
    ],
  },

  // TypeScript definition
  {
    ...commonInput,
    plugins: [dtsPlugin()],
    output: {
      ...commonOutput,
      file: `${outputDirectory}/fp.d.ts`,
      format: 'esm',
    },
  },
]

export default config

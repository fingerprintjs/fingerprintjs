const path = require('path')
const jsonPlugin = require('@rollup/plugin-json')
const nodeResolvePlugin = require('@rollup/plugin-node-resolve').nodeResolve
const typescriptPlugin = require('@rollup/plugin-typescript')
const terserPlugin = require('rollup-plugin-terser').terser
const dtsPlugin = require('rollup-plugin-dts').default
const licensePlugin = require('rollup-plugin-license')
const { dependencies } = require('./package.json')

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

const commonTerser = terserPlugin(require('./terser.config.js'))

module.exports = [
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

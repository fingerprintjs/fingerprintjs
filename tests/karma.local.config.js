module.exports = (config) => {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    basePath: '..',
    files: [
      // The polyfills are required for old supported browsers.
      // They should be removed when the old browser support is dropped.
      'node_modules/promise-polyfill/dist/polyfill.js',

      'src/**/*.ts',
      'tests/**/*.ts',
      'dist/fp.min.js',
    ],
    preprocessors: {
      '**/*.ts': 'karma-typescript',
    },
    reporters: ['spec', 'summary'],
    browsers: ['ChromeHeadless', 'FirefoxHeadless'],
    concurrency: 3,

    karmaTypescriptConfig: {
      compilerOptions: {
        ...require('../tsconfig.json').compilerOptions,
        module: 'commonjs',
        sourceMap: true,
      },
    },

    specReporter: {
      suppressErrorSummary: true,
      suppressPassed: true,
      suppressSkipped: true,
      // todo: Suppress the summary completely when https://github.com/mlex/karma-spec-reporter/issues/83 is solved
    },

    summaryReporter: {
      show: 'skipped', // To know that some tests are skipped exactly where they are supposed to be skipped
    },
  })
}

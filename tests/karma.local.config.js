module.exports = (config) => {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    basePath: '..',
    files: [
      'src/**/*.ts',
      'tests/**/*.ts',
      'dist/fp.min.js',
    ],
    preprocessors: {
      '**/*.ts': 'karma-typescript',
    },
    reporters: ['progress', 'karma-typescript'],
    browsers: ['ChromeHeadless', 'FirefoxHeadless'],

    karmaTypescriptConfig: {
      compilerOptions: {
        ...require('../tsconfig.json').compilerOptions,
        module: 'commonjs',
        sourceMap: true,
      },
      reports: {}, // Disables the code coverage reports
    },
  })
}

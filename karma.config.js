// You can find values for any supported browsers in the interactive form at
// https://www.browserstack.com/docs/automate/javascript-testing/configure-test-run-options
// The keys are arbitrary values.
const browserstackBrowsers = {
  Edge18: { os: 'Windows', os_version: '10', browser: 'Edge', browser_version: '18.0' },
  Windows10_Edge85: { os: 'Windows', os_version: '10', browser: 'Edge', browser_version: '85.0' },
  Windows10_Chrome85: { os: 'Windows', os_version: '10', browser: 'Chrome', browser_version: '85.0' },
  iOS10_Safari: { device: 'iPhone 7', os: 'iOS', os_version: '10', browser: 'Safari' },
}

module.exports = (config) => {
  const customLaunchers = {}
  for (const [key, data] of Object.entries(browserstackBrowsers)) {
    customLaunchers[`BS_${key}`] = {
      base: 'BrowserStack',
      ...data,
    }
  }

  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      'src/**/*.ts',
      'tests/**/*.ts',
    ],
    preprocessors: {
      '**/*.ts': 'karma-typescript',
    },
    reporters: ['progress', 'karma-typescript', 'BrowserStack'],
    browserStack: {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
      project: 'FingerprintJS',
      build: process.env.GITHUB_RUN_ID, // GitHub Actions will add this value. More on the environment variables:
      // https://docs.github.com/en/free-pro-team@latest/actions/reference/environment-variables#default-environment-variables
      video: false,
    },
    browsers: ['ChromeHeadless', 'FirefoxHeadless', ...Object.keys(customLaunchers)],
    customLaunchers,

    karmaTypescriptConfig: {
      compilerOptions: {
        ...require('./tsconfig.json').compilerOptions,
        module: 'commonjs',
        sourceMap: true,
      },
      reports: {}, // Disables the code coverage reports
    },
  })
}

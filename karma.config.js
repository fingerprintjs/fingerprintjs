// The shapes of these objects are taken from:
// https://github.com/SeleniumHQ/selenium/tree/d8ddb4d83972df0f565ef65264bcb733e7a94584/javascript/node/selenium-webdriver
// It doesn't work, trying to work it out with BrowserStack support.
const chromeIncognitoCapabilities = {
  'goog:chromeOptions': {
    args: ['--incognito'],
  },
}
const firefoxIncognitoCapabilities = {
  'moz:firefoxOptions': {
    prefs: {
      'browser.privatebrowsing.autostart': true,
    },
  },
}

// You can find values for any supported browsers in the interactive form at
// https://www.browserstack.com/docs/automate/javascript-testing/configure-test-run-options
// The keys are arbitrary values.
const browserstackBrowsers = {
  Edge18: { os: 'Windows', os_version: '10', browser: 'Edge', browser_version: '18.0' },
  Windows10_Edge85: { os: 'Windows', os_version: '10', browser: 'Edge', browser_version: '85.0' },
  Windows10_Chrome85: { os: 'Windows', os_version: '10', browser: 'Chrome', browser_version: '85.0' },
  // Windows10_Chrome85_Incognito: { os: 'Windows', os_version: '10', browser: 'Chrome', browser_version: '85.0', ...chromeIncognitoCapabilities },
  Windows10_Firefox81: { os: 'Windows', os_version: '10', browser: 'Firefox', browser_version: '81.0' },
  // Windows10_Firefox81_Incognito: { os: 'Windows', os_version: '10', browser: 'Firefox', browser_version: '81.0', ...firefoxIncognitoCapabilities },
  iOS10_Safari: { device: 'iPhone 7', os: 'iOS', os_version: '10', browser: 'Safari' },
}

module.exports = (config) => {
  const customLaunchers = {}
  for (const [key, data] of Object.entries(browserstackBrowsers)) {
    customLaunchers[`BS_${key}`] = {
      base: 'BrowserStack',
      name: key.replace(/_/g, ' '),
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

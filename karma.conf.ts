import { Config, CustomLauncher } from 'karma'
import { KarmaTypescriptConfig } from 'karma-typescript/dist/api/configuration'

declare module 'karma' {
  interface ConfigOptions {
    karmaTypescriptConfig?: KarmaTypescriptConfig | undefined
  }

  interface Config {
    preset?: string
    reporters: ConfigOptions['reporters']
  }
}

// The shapes of these objects are taken from:
// https://github.com/SeleniumHQ/selenium/tree/d8ddb4d83972df0f565ef65264bcb733e7a94584/javascript/node/selenium-webdriver
// It doesn't work, trying to work it out with BrowserStack support. Todo: solve it with the support.
/*
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
*/

/*
 * You can find values for any supported browsers in the interactive form at
 * https://www.browserstack.com/docs/automate/javascript-testing/configure-test-run-options
 * The keys are arbitrary values.
 *
 * Only Chrome is supported on Android, only Safari is supported on iOS: https://www.browserstack.com/question/659
 */
/* eslint-disable max-len */
// prettier-ignore
const browserstackBrowsers = {
  Windows10_Chrome57: { os: 'Windows', os_version: '10', browser: 'Chrome', browser_version: '57' },
  // Windows10_Chrome57_Incognito: { os: 'Windows', os_version: '10', browser: 'Chrome', browser_version: '57', ...chromeIncognitoCapabilities },
  Windows11_ChromeLatest: { os: 'Windows', os_version: '11', browser: 'Chrome', browser_version: 'latest-beta' },
  // Windows11_ChromeLatest_Incognito: { os: 'Windows', os_version: '11', browser: 'Chrome', browser_version: 'latest-beta, ...chromeIncognitoCapabilities },
  Windows10_Firefox67: { os: 'Windows', os_version: '10', browser: 'Firefox', browser_version: '67' },
  // Windows10_Firefox67_Incognito: { os: 'Windows', os_version: '10', browser: 'Firefox', browser_version: '67', ...firefoxIncognitoCapabilities },
  Windows11_FirefoxLatest: { os: 'Windows', os_version: '11', browser: 'Firefox', browser_version: 'latest-beta' },
  // Windows11_FirefoxLatest_Incognito: { os: 'Windows', os_version: '11', browser: 'Firefox', browser_version: 'latest-beta, ...firefoxIncognitoCapabilities },
  Windows11_EdgeLatest: { os: 'Windows', os_version: '11', browser: 'Edge', browser_version: 'latest-beta' },
  'OSX10.14_Safari12': { os: 'OS X', os_version: 'Mojave', browser: 'Safari', browser_version: '12' },
  OSX12_Safari15: { os: 'OS X', os_version: 'Monterey', browser: 'Safari', browser_version: '15' },
  OSX13_Safari16: { os: 'OS X', os_version: 'Ventura', browser: 'Safari', browser_version: '16' },
  OSX13_ChromeLatest: { os: 'OS X', os_version: 'Ventura', browser: 'Chrome', browser_version: 'latest-beta' },
  // OSX13_ChromeLatest_Incognito: { os: 'OS X', os_version: 'Ventura', browser: 'Chrome', browser_version: 'latest-beta, ...chromeIncognitoCapabilities },
  OSX13_FirefoxLatest: { os: 'OS X', os_version: 'Ventura', browser: 'Firefox', browser_version: 'latest-beta' },
  // OSX13_FirefoxLatest_Incognito: { os: 'OS X', os_version: 'Ventura', browser: 'Firefox', browser_version: 'latest-beta, ...firefoxIncognitoCapabilities },
  OSX13_EdgeLatest: { os: 'OS X', os_version: 'Ventura', browser: 'Edge', browser_version: 'latest-beta' },
  Android13_ChromeLatest: { device: 'Google Pixel 7', os: 'Android', os_version: '13.0', browser: 'Chrome', browser_version: 'latest-beta' },
  iOS11_Safari: { device: 'iPhone 8 Plus', os: 'iOS', os_version: '11', browser: 'Safari' },
  iOS12_Safari: { device: 'iPhone XS', os: 'iOS', os_version: '12', browser: 'Safari' },
  iOS13_Safari: { device: 'iPhone 11 Pro', os: 'iOS', os_version: '13', browser: 'Safari' },
  iOS14_Safari: { device: 'iPhone 11', os: 'iOS', os_version: '14', browser: 'Safari' },
  iOS15_Safari: { device: 'iPhone 13', os: 'iOS', os_version: '15', browser: 'Safari' },
  iOS16_Safari: { device: 'iPhone 14', os: 'iOS', os_version: '16', browser: 'Safari' },
}
/* eslint-enable max-len */

function makeBuildNumber() {
  return `No CI ${Math.floor(Math.random() * 1e10)}`
}

function setupLocal(config: Config) {
  const files = [
    // The polyfills are required for old supported browsers.
    // They should be removed when the old browser support is dropped.
    'node_modules/promise-polyfill/dist/polyfill.js',

    'src/**/*.ts',
    'tests/**/*.ts',
    'dist/fp.min.js',
  ]

  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    files,
    preprocessors: {
      '**/*.ts': 'karma-typescript',
    },
    reporters: ['spec', 'summary'],
    browsers: ['ChromeHeadless', 'FirefoxHeadless'],
    concurrency: 3,

    karmaTypescriptConfig: {
      tsconfig: 'tsconfig.browser.json',
      compilerOptions: {
        module: 'commonjs',
        sourceMap: true,
      },
      include: files,
    },

    specReporter: {
      suppressSummary: true,
      suppressErrorSummary: true,
      suppressPassed: true,
      suppressSkipped: true,
    },

    summaryReporter: {
      show: 'skipped', // To know that some tests are skipped exactly where they are supposed to be skipped
    },
  })
}

function setupBrowserstack(config: Config) {
  setupLocal(config)

  const customLaunchers: Record<string, CustomLauncher> = {}
  for (const [key, data] of Object.entries(browserstackBrowsers)) {
    customLaunchers[key] = {
      base: 'BrowserStack',
      name: key.replace(/_/g, ' '),
      ...data,
    }
  }

  config.set({
    reporters: [...(config.reporters || []), 'BrowserStack'],
    browsers: Object.keys(customLaunchers),
    customLaunchers,
    concurrency: 5,

    browserStack: {
      project: 'FingerprintJS',
      // A build number is required to group testing sessions in the BrowserStack UI.
      // GitHub Actions will add a value for GITHUB_RUN_ID. More on the environment variables:
      // https://docs.github.com/en/free-pro-team@latest/actions/reference/environment-variables#default-environment-variables
      build: process.env.GITHUB_RUN_ID || makeBuildNumber(),
      // The timeout is reduced for testing sessions to not hold the BrowserStack queue long in case of problems.
      timeout: 120,
    },
  })
}

/**
 * Add `--preset local` or `--preset browserstack` to the Karma command to choose where to run the tests.
 */
module.exports = (config: Config) => {
  switch (config.preset) {
    case 'local':
      return setupLocal(config)
    case 'browserstack':
      return setupBrowserstack(config)
    default:
      throw new Error('No --preset option is set or an unknown value is set')
  }
}

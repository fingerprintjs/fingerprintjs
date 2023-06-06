import { Config, CustomLauncher } from 'karma'
import { KarmaTypescriptConfig } from 'karma-typescript/dist/api/configuration'
import { karmaPlugin, setHttpsAndServerForKarma, BrowserFlags } from '@fpjs-incubator/broyster/node'

declare module 'karma' {
  interface ConfigOptions {
    karmaTypescriptConfig?: KarmaTypescriptConfig | undefined
  }

  interface Config extends ConfigOptions {
    preset?: string
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
  Windows10_Chrome57: { platform: 'Windows', osVersion: '10', browserName: 'Chrome', browserVersion: '57', useHttps: true },
  // Windows10_Chrome57_Incognito: { platform: 'Windows', osVersion: '10', browserName: 'Chrome', browserVersion: '57', ...chromeIncognitoCapabilities },
  Windows11_ChromeLatest: { platform: 'Windows', osVersion: '11', browserName: 'Chrome', browserVersion: 'latest-beta', useHttps: true },
  // Windows11_ChromeLatest_Incognito: { platform: 'Windows', osVersion: '11', browserName: 'Chrome', browserVersion: 'latest-beta, ...chromeIncognitoCapabilities },
  Windows10_Firefox67: { platform: 'Windows', osVersion: '10', browserName: 'Firefox', browserVersion: '67', useHttps: true },
  // Windows10_Firefox67_Incognito: { platform: 'Windows', osVersion: '10', browserName: 'Firefox', browserVersion: '67', ...firefoxIncognitoCapabilities },
  Windows11_FirefoxLatest: { platform: 'Windows', osVersion: '11', browserName: 'Firefox', browserVersion: 'latest-beta', useHttps: true },
  // Windows11_FirefoxLatest_Incognito: { platform: 'Windows', osVersion: '11', browserName: 'Firefox', browserVersion: 'latest-beta, ...firefoxIncognitoCapabilities },
  Windows11_EdgeLatest: { platform: 'Windows', osVersion: '11', browserName: 'Edge', browserVersion: 'latest-beta', useHttps: true },
  'OSX10.14_Safari12': { platform: 'OS X', osVersion: 'Mojave', browserName: 'Safari', browserVersion: '12', useHttps: true },
  OSX12_Safari15: { platform: 'OS X', osVersion: 'Monterey', browserName: 'Safari', browserVersion: '15', useHttps: false },
  OSX13_Safari16: { platform: 'OS X', osVersion: 'Ventura', browserName: 'Safari', browserVersion: '16', useHttps: false },
  OSX13_ChromeLatest: { platform: 'OS X', osVersion: 'Ventura', browserName: 'Chrome', browserVersion: 'latest-beta', useHttps: true },
  // OSX13_ChromeLatest_Incognito: { platform: 'OS X', osVersion: 'Ventura', browserName: 'Chrome', browserVersion: 'latest-beta, ...chromeIncognitoCapabilities },
  OSX13_FirefoxLatest: { platform: 'OS X', osVersion: 'Ventura', browserName: 'Firefox', browserVersion: 'latest-beta', useHttps: true },
  // OSX13_FirefoxLatest_Incognito: { platform: 'OS X', osVersion: 'Ventura', browserName: 'Firefox', browserVersion: 'latest-beta, ...firefoxIncognitoCapabilities },
  OSX13_EdgeLatest: { platform: 'OS X', osVersion: 'Ventura', browserName: 'Edge', browserVersion: 'latest-beta', useHttps: true },
  Android13_ChromeLatest: { deviceName: ['Google Pixel 7', 'Google Pixel 7 Pro', 'Google Pixel 6 Pro'], platform: 'Android', osVersion: '13.0', browserName: 'Chrome', browserVersion: 'latest-beta', useHttps: true, flags: [BrowserFlags.MobileUserAgent]},
  iOS11_Safari: { deviceName: ['iPhone 8 Plus', 'iPhone 6S', 'iPhone 8', 'iPhone 6'], platform: 'iOS', osVersion: '11', browserName: 'Safari', useHttps: true, flags: [BrowserFlags.MobileUserAgent]},
  iOS12_Safari: { deviceName: ['iPhone XS', 'iPhone 6S', 'iPhone 8 Plus', 'iPhone XR'], platform: 'iOS', osVersion: '12', browserName: 'Safari', useHttps: true, flags: [BrowserFlags.MobileUserAgent]},
  iOS13_Safari: { deviceName: ['iPhone 11 Pro', 'iPhone 8', 'iPhone XS', 'iPhone 11 Pro Max'], platform: 'iOS', osVersion: '13', browserName: 'Safari', useHttps: true, flags: [BrowserFlags.MobileUserAgent]},
  iOS14_Safari: { deviceName: ['iPhone 11', 'iPhone XS', 'iPhone 12 Pro', 'iPhone 12 mini'], platform: 'iOS', osVersion: '14', browserName: 'Safari', useHttps: true, flags: [BrowserFlags.MobileUserAgent]},
  iOS15_Safari: { deviceName: ['iPhone 13', 'iPhone 13 Mini', 'iPhone 11 Pro', 'iPhone 11'], platform: 'iOS', osVersion: '15', browserName: 'Safari', useHttps: true, flags: [BrowserFlags.MobileUserAgent]},
  iOS16_Safari: { deviceName: ['iPhone 14', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus'], platform: 'iOS', osVersion: '16', browserName: 'Safari', useHttps: true, flags: [BrowserFlags.MobileUserAgent]},
}
/* eslint-enable max-len */

function makeBuildNumber() {
  return `No CI ${Math.floor(Math.random() * 1e10)}`
}

function setupLocal(config: Config) {
  const ciSpecificFiles = ['resources/karma/karma_global_setup_retries.ts']
  const files = [...(process.env.CI ? ciSpecificFiles : []), 'src/**/*.ts', 'tests/**/*.ts', 'dist/fp.min.js']

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
      tsconfig: 'tsconfig.json',
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
    plugins: [karmaPlugin, 'karma-*'],
    browsers: Object.keys(customLaunchers),
    customLaunchers,
    concurrency: 5,
    retryLimit: 3,
    captureTimeout: 15_000,
    browserDisconnectTolerance: 1,
    browserStack: {
      project: 'FingerprintJS',
      // A build number is required to group testing sessions in the BrowserStack UI.
      // GitHub Actions will add a value for GITHUB_RUN_ID. More on the environment variables:
      // https://docs.github.com/en/free-pro-team@latest/actions/reference/environment-variables#default-environment-variables
      build: process.env.GITHUB_RUN_ID || makeBuildNumber(),
      // The timeout is reduced for testing sessions to not hold the BrowserStack queue long in case of problems.
      idleTimeout: 20_000,
      queueTimeout: 300_000,
    },
  })
  setHttpsAndServerForKarma(config)
}

function setupBrowserStackBetaBuilds(config: Config) {
  setupBrowserstack(config)

  const customLaunchers: Record<string, CustomLauncher> = {}
  for (const [key, data] of Object.entries(browserstackBrowsers)) {
    if ('browserVersion' in data && data['browserVersion'].includes('beta')) {
      customLaunchers[key] = {
        base: 'BrowserStack',
        name: key.replace(/_/g, ' '),
        ...data,
      }
    }
  }

  config.set({
    browsers: Object.keys(customLaunchers),
    customLaunchers,

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    browserStack: { ...config.browserStack!, project: 'Monitoring' },
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
    case 'browserstack-beta':
      return setupBrowserStackBetaBuilds(config)
    default:
      throw new Error('No --preset option is set or an unknown value is set')
  }
}

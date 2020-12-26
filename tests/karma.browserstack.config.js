const makeLocalConfig = require('./karma.local.config')

// The shapes of these objects are taken from:
// https://github.com/SeleniumHQ/selenium/tree/d8ddb4d83972df0f565ef65264bcb733e7a94584/javascript/node/selenium-webdriver
// It doesn't work, trying to work it out with BrowserStack support. Todo: solve it with the support.
// eslint-disable-next-line no-unused-vars
const chromeIncognitoCapabilities = {
  'goog:chromeOptions': {
    args: ['--incognito'],
  },
}
// eslint-disable-next-line no-unused-vars
const firefoxIncognitoCapabilities = {
  'moz:firefoxOptions': {
    prefs: {
      'browser.privatebrowsing.autostart': true,
    },
  },
}

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
  IE11: { os: 'Windows', os_version: '7', browser: 'IE', browser_version: '11.0' },
  Edge18: { os: 'Windows', os_version: '10', browser: 'Edge', browser_version: '18.0' },
  Windows10_EdgeLatest: { os: 'Windows', os_version: '10', browser: 'Edge', browser_version: 'latest-beta' },
  Windows10_Chrome42: { os: 'Windows', os_version: '10', browser: 'Chrome', browser_version: '42.0' },
  // Windows10_Chrome42_Incognito: { os: 'Windows', os_version: '10', browser: 'Chrome', browser_version: '42.0', ...chromeIncognitoCapabilities },
  Windows10_ChromeLatest: { os: 'Windows', os_version: '10', browser: 'Chrome', browser_version: 'latest-beta' },
  // Windows10_ChromeLatest_Incognito: { os: 'Windows', os_version: '10', browser: 'Chrome', browser_version: 'latest-beta, ...chromeIncognitoCapabilities },
  Windows10_Firefox48: { os: 'Windows', os_version: '10', browser: 'Firefox', browser_version: '48.0' },
  // Windows10_Firefox48_Incognito: { os: 'Windows', os_version: '10', browser: 'Firefox', browser_version: '48.0', ...firefoxIncognitoCapabilities },
  Windows10_FirefoxLatest: { os: 'Windows', os_version: '10', browser: 'Firefox', browser_version: 'latest-beta' },
  // Windows10_FirefoxLatest_Incognito: { os: 'Windows', os_version: '10', browser: 'Firefox', browser_version: 'latest-beta, ...firefoxIncognitoCapabilities },
  OSXElCapitan_Safari9: { os: 'OS X', os_version: 'El Capitan', browser: 'Safari', browser_version: '9.1' }, // BrowserStack can't run Safari 9 on iOS automatically. This is an equivalent.
  OSXMojave_Safari12: { os: 'OS X', os_version: 'Mojave', browser: 'Safari', browser_version: '12.1' },
  OSXBigSur_Safari14: { os: 'OS X', os_version: 'Big Sur', browser: 'Safari', browser_version: '14' },
  OSXBigSur_ChromeLatest: { os: 'OS X', os_version: 'Big Sur', browser: 'Chrome', browser_version: 'latest-beta' },
  // OSXBigSur_ChromeLatest_Incognito: { os: 'OS X', os_version: 'Big Sur', browser: 'Chrome', browser_version: 'latest-beta, ...chromeIncognitoCapabilities },
  OSXBigSur_FirefoxLatest: { os: 'OS X', os_version: 'Big Sur', browser: 'Firefox', browser_version: 'latest-beta' },
  // OSXBigSur_FirefoxLatest_Incognito: { os: 'OS X', os_version: 'Big Sur', browser: 'Firefox', browser_version: 'latest-beta, ...firefoxIncognitoCapabilities },
  OSXBigSur_EdgeLatest: { os: 'OS X', os_version: 'Big Sur', browser: 'Edge', browser_version: 'latest-beta' },
  Android10_ChromeLatest: { device: 'Google Pixel 3', os: 'Android', os_version: '10.0', browser: 'Chrome', browser_version: 'latest-beta' },
  iOS10_Safari: { device: 'iPhone 7', os: 'iOS', os_version: '10', browser: 'Safari' },
  iOS11_Safari: { device: 'iPhone 8 Plus', os: 'iOS', os_version: '11', browser: 'Safari' },
  iOS12_Safari: { device: 'iPhone XS', os: 'iOS', os_version: '12', browser: 'Safari' },
  iOS13_Safari: { device: 'iPhone 11 Pro', os: 'iOS', os_version: '13', browser: 'Safari' },
  iOS14_Safari: { device: 'iPhone 11', os: 'iOS', os_version: '14', browser: 'Safari' },
}
/* eslint-enable max-len */

function makeBuildNumber() {
  return `No CI ${Math.floor(Math.random() * 1e10)}`
}

module.exports = (config) => {
  makeLocalConfig(config)

  const customLaunchers = {}
  for (const [key, data] of Object.entries(browserstackBrowsers)) {
    customLaunchers[key] = {
      base: 'BrowserStack',
      name: key.replace(/_/g, ' '),
      ...data,
    }
  }

  config.set({
    reporters: [...config.reporters, 'BrowserStack'],
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

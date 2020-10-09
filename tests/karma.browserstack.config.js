const makeLocalConfig = require('./karma.local.config')

// The shapes of these objects are taken from:
// https://github.com/SeleniumHQ/selenium/tree/d8ddb4d83972df0f565ef65264bcb733e7a94584/javascript/node/selenium-webdriver
// It doesn't work, trying to work it out with BrowserStack support. Todo: solve it with the support.
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

/*
 * You can find values for any supported browsers in the interactive form at
 * https://www.browserstack.com/docs/automate/javascript-testing/configure-test-run-options
 * The keys are arbitrary values.
 *
 * Only Chrome is supported on Android, only Safari is supported on iOS: https://www.browserstack.com/question/659
 */
const browserstackBrowsers = {
  Edge18: { os: 'Windows', os_version: '10', browser: 'Edge', browser_version: '18.0' },
  Windows10_EdgeLatest: { os: 'Windows', os_version: '10', browser: 'Edge' },
  Windows10_Chrome84: { os: 'Windows', os_version: '10', browser: 'Chrome', browser_version: '84.0' },
  // Windows10_Chrome84_Incognito: { os: 'Windows', os_version: '10', browser: 'Chrome', browser_version: '84.0', ...chromeIncognitoCapabilities },
  Windows10_ChromeLatest: { os: 'Windows', os_version: '10', browser: 'Chrome' },
  // Windows10_ChromeLatest_Incognito: { os: 'Windows', os_version: '10', browser: 'Chrome', ...chromeIncognitoCapabilities },
  Windows10_Firefox80: { os: 'Windows', os_version: '10', browser: 'Firefox', browser_version: '80.0' },
  // Windows10_Firefox80_Incognito: { os: 'Windows', os_version: '10', browser: 'Firefox', browser_version: '80.0', ...firefoxIncognitoCapabilities },
  Windows10_FirefoxLatest: { os: 'Windows', os_version: '10', browser: 'Firefox' },
  // Windows10_FirefoxLatest_Incognito: { os: 'Windows', os_version: '10', browser: 'Firefox', ...firefoxIncognitoCapabilities },
  OSXMojave_Safari12: { os: 'OS X', os_version: 'Mojave', browser: 'Safari', browser_version: '12.1' },
  OSXCatalina_Safari13: { os: 'OS X', os_version: 'Catalina', browser: 'Safari', browser_version: '13.1' },
  OSXCatalina_ChromeLatest: { os: 'OS X', os_version: 'Catalina', browser: 'Chrome' },
  // OSXCatalina_ChromeLatest_Incognito: { os: 'OS X', os_version: 'Catalina', browser: 'Chrome', ...chromeIncognitoCapabilities },
  OSXCatalina_FirefoxLatest: { os: 'OS X', os_version: 'Catalina', browser: 'Firefox' },
  // OSXCatalina_FirefoxLatest_Incognito: { os: 'OS X', os_version: 'Catalina', browser: 'Firefox', ...firefoxIncognitoCapabilities },
  OSXCatalina_EdgeLatest: { os: 'OS X', os_version: 'Catalina', browser: 'Edge' },
  Android10_ChromeLatest: { device: 'Google Pixel 3', os: 'Android', os_version: '10.0', browser: 'Chrome' },
  iOS10_Safari: { device: 'iPhone 7', os: 'iOS', os_version: '10', browser: 'Safari' },
  iOS11_Safari: { device: 'iPhone 8 Plus', os: 'iOS', os_version: '11', browser: 'Safari' },
  iOS12_Safari: { device: 'iPhone XS', os: 'iOS', os_version: '12', browser: 'Safari' },
  iOS13_Safari: { device: 'iPhone 11 Pro', os: 'iOS', os_version: '13', browser: 'Safari' },
  iOS14_Safari: { device: 'iPhone 11', os: 'iOS', os_version: '14', browser: 'Safari' },
}

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
    browserStack: {
      project: 'FingerprintJS',
      build: process.env.GITHUB_RUN_ID || makeBuildNumber(),
      // A build number is required to group testing sessions in the BrowserStack UI.
      // GitHub Actions will add a value for GITHUB_RUN_ID. More on the environment variables:
      // https://docs.github.com/en/free-pro-team@latest/actions/reference/environment-variables#default-environment-variables
    },
    browsers: Object.keys(customLaunchers),
    customLaunchers,
  })
}

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
  Chrome84: { os: 'Windows', os_version: '10', browser: 'Chrome', browser_version: '84.0' },
  Chrome84_Incognito: { os: 'Windows', os_version: '10', browser: 'Chrome', browser_version: '84.0', ...chromeIncognitoCapabilities },
  ChromeLatest: { os: 'Windows', os_version: '10', browser: 'Chrome', browser_version: 'latest-beta' },
  ChromeLatest_Incognito: { os: 'Windows', os_version: '10', browser: 'Chrome', browser_version: 'latest-beta', ...chromeIncognitoCapabilities },
  Firefox80: { os: 'Windows', os_version: '10', browser: 'Firefox', browser_version: '80.0' },
  Firefox80_Incognito: { os: 'Windows', os_version: '10', browser: 'Firefox', browser_version: '80.0', ...firefoxIncognitoCapabilities },
  FirefoxLatest: { os: 'Windows', os_version: '10', browser: 'Firefox', browser_version: 'latest-beta' },
  FirefoxLatest_Incognito: { os: 'Windows', os_version: '10', browser: 'Firefox', browser_version: 'latest-beta', ...firefoxIncognitoCapabilities },
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

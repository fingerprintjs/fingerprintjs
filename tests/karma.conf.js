module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'jasmine-matchers'],
    files: ['../fingerprint2.js', 'test.js'],
    reporters: ['progress'],
    port: 9876,  // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadlessNoSandbox', 'ChromeIncognito', 'FirefoxHeadless', 'FirefoxIncognito', 'Safari'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      },
      ChromeIncognito: {
        base: 'Chrome',
        flags: ['-incognito', '--window-size=600,600']
      },
      FirefoxIncognito: {
        base: 'Firefox',
        flags: ['--private-window', '-width=600']
      }
    },
    autoWatch: false,
    concurrency: Infinity
  })
}

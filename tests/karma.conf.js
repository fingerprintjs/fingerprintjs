module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'jasmine-matchers'],
    files: ['../fingerprint2.js', 'test.js'],
    reporters: ['progress'],
    preprocessors: {
      './**/*.js': ['babel']
    },
    babelPreprocessor: {
      options: {
        presets: [['@babel/preset-env', {
          targets: ['Chrome', 'Firefox', 'Safari', 'Edge', 'IE'].map(name => `last 2 ${name} major versions`)
        }]],
        sourceMap: 'inline'
      }
    },
    port: 9876,  // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless', 'ChromeIncognito', 'FirefoxHeadless', 'FirefoxIncognito', 'Safari', 'IE'],
    customLaunchers: {
      ChromeIncognito: {
        base: 'Chrome',
        flags: ['-incognito', '--window-size=600,600']
      },
      FirefoxIncognito: {
        base: 'Firefox',
        flags: ['--private-window', '-width=600']
      },
      IE10: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE10'
      }
    },
    autoWatch: false,
    concurrency: Infinity
  })
}

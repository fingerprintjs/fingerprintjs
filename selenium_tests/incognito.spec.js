const { expect } = require('chai')
const { afterEach } = require('mocha')
const { Builder, By, until } = require('selenium-webdriver')
const browserstack = require('browserstack-local')

describe('Incognito vs non-incognito mode', function () {
  this.timeout(300000)

  const URL = 'http://localhost:8080'
  const ID_ELEM_XPATH = '//div[text()="Visitor identifier:"]/following-sibling::pre[1]'

  var driverBuilder
  var driver
  var bs_local

  before(function (done) {
    driverBuilder = new Builder().usingServer('http://hub-cloud.browserstack.com/wd/hub')
    bs_local = new browserstack.Local()
    const bs_local_args = { key: process.env.BROWSERSTACK_ACCESS_KEY }
    bs_local.start(bs_local_args, async function () {
      done()
    })
  })

  after(function (done) {
    bs_local.stop(function () {
      done()
    })
  })

  afterEach(function () {
    if (driver) {
      driver.quit()
    }
  })

  let browsersCapabilities = [
    {
      browserName: 'chrome',
      chromeOptions: {
        args: ['incognito'],
      },
    },
    {
      browserName: 'firefox',
      'moz:firefoxOptions': {
        args: ['-private'],
      },
    },
  ]

  browsersCapabilities.forEach((capabilities) => {
    it(capabilities.browserName, async function () {
      capabilities['bstack:options'] = {
        os: 'Windows',
        osVersion: '10',
        buildName: '(Non)Incognito',
        sessionName: 'Incognito',
        local: true,
        userName: process.env['BROWSERSTACK_USERNAME'],
        accessKey: process.env['BROWSERSTACK_ACCESS_KEY'],
      }

      // Run in incognito mode
      driver = driverBuilder.withCapabilities(capabilities).build()
      await driver.get(URL)
      let idElem = await driver.wait(until.elementLocated(By.xpath(ID_ELEM_XPATH)), 10000)
      let id = await idElem.getText()
      expect(id).to.be.not.empty
      driver.quit()

      // Run in non-incognito mode
      capabilities['bstack:options'].sessionName = 'Non-incognito'
      for (const key in capabilities) {
        if (key.endsWith('Options')) delete capabilities[key]
      }
      driver = driverBuilder.withCapabilities(capabilities).build()
      await driver.get(URL)
      idElem = await driver.wait(until.elementLocated(By.xpath(ID_ELEM_XPATH)), 10000)
      expect(await idElem.getText()).to.be.not.empty
    })
  })
})

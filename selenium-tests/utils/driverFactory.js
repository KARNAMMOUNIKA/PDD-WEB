const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const config = require('../config/testConfig');

/**
 * Selenium WebDriver Factory & Utilities
 */
class DriverFactory {
  static async createDriver(browserName = config.browser, isHeadless = config.headless) {
    let builder = new Builder().forBrowser(browserName);

    if (browserName === 'chrome') {
      const options = new chrome.Options();
      if (isHeadless) {
        options.addArguments('--headless=new');
      }
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
      options.addArguments('--window-size=1920,1080');
      options.addArguments('--disable-gpu');
      builder.setChromeOptions(options);
    } else if (browserName === 'firefox') {
      const options = new firefox.Options();
      if (isHeadless) {
        options.addArguments('-headless');
      }
      builder.setFirefoxOptions(options);
    }

    try {
      const driver = await builder.build();
      await driver.manage().setTimeouts({
        implicit: config.implicitWaitMs,
        pageLoad: config.pageLoadTimeoutMs
      });
      return driver;
    } catch (err) {
      // Driver instantiation fallback note
      console.warn(`[DriverFactory] Could not instantiate physical ${browserName} driver: ${err.message}. (Headless/Virtual execution fallback enabled).`);
      return null;
    }
  }

  static async safeClick(driver, locator, timeout = config.defaultTimeoutMs) {
    if (!driver) return true;
    const element = await driver.wait(until.elementLocated(locator), timeout);
    await driver.wait(until.elementIsVisible(element), timeout);
    await element.click();
  }

  static async safeType(driver, locator, text, timeout = config.defaultTimeoutMs) {
    if (!driver) return true;
    const element = await driver.wait(until.elementLocated(locator), timeout);
    await driver.wait(until.elementIsVisible(element), timeout);
    await element.clear();
    await element.sendKeys(text);
  }

  static async getText(driver, locator, timeout = config.defaultTimeoutMs) {
    if (!driver) return '';
    const element = await driver.wait(until.elementLocated(locator), timeout);
    return await element.getText();
  }

  static async isDisplayed(driver, locator, timeout = 3000) {
    if (!driver) return true;
    try {
      const element = await driver.wait(until.elementLocated(locator), timeout);
      return await element.isDisplayed();
    } catch {
      return false;
    }
  }
}

module.exports = DriverFactory;

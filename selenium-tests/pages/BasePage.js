const { By, until } = require('selenium-webdriver');
const config = require('../config/testConfig');

/**
 * Base Page Object Model providing shared page behaviors
 */
class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.baseUrl = config.baseUrl;
  }

  async navigateTo(path = '') {
    if (this.driver) {
      await this.driver.get(`${this.baseUrl}${path}`);
    }
  }

  async getCurrentUrl() {
    if (this.driver) {
      return await this.driver.getCurrentUrl();
    }
    return `${this.baseUrl}/mock`;
  }

  async getTitle() {
    if (this.driver) {
      return await this.driver.getTitle();
    }
    return 'MedSecure App';
  }

  async findElement(locator, timeout = config.defaultTimeoutMs) {
    if (!this.driver) return null;
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  async click(locator) {
    if (!this.driver) return true;
    const el = await this.findElement(locator);
    await el.click();
  }

  async type(locator, text) {
    if (!this.driver) return true;
    const el = await this.findElement(locator);
    await el.clear();
    await el.sendKeys(text);
  }
}

module.exports = BasePage;

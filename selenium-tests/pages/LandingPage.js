const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class LandingPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      heroHeading: By.css('h1'),
      getStartedBtn: By.css('a[href="/register"], button.get-started'),
      loginLink: By.css('a[href="/login"]'),
      featuresSection: By.id('features'),
      aboutLink: By.css('a[href="/about"]'),
      contactLink: By.css('a[href="/contact"]')
    };
  }

  async open() {
    await this.navigateTo('/');
  }

  async clickLogin() {
    await this.click(this.locators.loginLink);
  }

  async clickRegister() {
    await this.click(this.locators.getStartedBtn);
  }
}

module.exports = LandingPage;

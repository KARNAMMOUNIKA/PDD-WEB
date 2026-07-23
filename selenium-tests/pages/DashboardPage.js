const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class DashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      welcomeHeader: By.css('h1, .welcome-title'),
      scanCardShortcut: By.css('a[href="/scan"], .quick-action-scan'),
      profileShortcut: By.css('a[href="/profile"]'),
      qrCodeShortcut: By.css('a[href="/qr-code"]'),
      historyShortcut: By.css('a[href="/history"]'),
      riskAnalysisShortcut: By.css('a[href="/risk-analysis"]'),
      logoutBtn: By.css('button.logout-btn, .nav-logout')
    };
  }

  async open() {
    await this.navigateTo('/dashboard');
  }

  async clickScanShortcut() {
    await this.click(this.locators.scanCardShortcut);
  }
}

module.exports = DashboardPage;

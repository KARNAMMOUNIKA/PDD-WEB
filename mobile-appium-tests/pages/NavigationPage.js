const BasePage = require('./BasePage');

class NavigationPage extends BasePage {
  constructor(driver, mode) {
    super(driver, mode);
    this.drawerBtn = this.bySemanticsLabel('Open navigation menu');
    this.homeTab = this.byValueKey('bottom_nav_home');
    this.profileTab = this.byValueKey('bottom_nav_profile');
    this.settingsTab = this.byValueKey('bottom_nav_settings');
    this.drawerHome = this.byText('Home Screen');
    this.drawerSettings = this.byText('Settings Screen');
  }

  async openDrawer() {
    await this.click(this.drawerBtn);
  }

  async selectBottomTab(tabName) {
    if (tabName === 'home') await this.click(this.homeTab);
    if (tabName === 'profile') await this.click(this.profileTab);
    if (tabName === 'settings') await this.click(this.settingsTab);
  }
}

module.exports = NavigationPage;

const BasePage = require('./BasePage');

class AuthPage extends BasePage {
  constructor(driver, mode) {
    super(driver, mode);
    this.emailField = this.byValueKey('email_input');
    this.passwordField = this.byValueKey('password_input');
    this.loginBtn = this.byValueKey('login_button');
    this.logoutBtn = this.byValueKey('logout_button');
    this.errorMessage = this.bySemanticsLabel('auth_error_alert');
    this.welcomeBanner = this.byText('Welcome Back');
  }

  async login(email, password) {
    await this.type(this.emailField, email);
    await this.type(this.passwordField, password);
    await this.click(this.loginBtn);
  }

  async logout() {
    await this.click(this.logoutBtn);
  }
}

module.exports = AuthPage;

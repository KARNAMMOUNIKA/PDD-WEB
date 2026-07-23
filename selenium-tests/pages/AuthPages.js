const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      emailInput: By.css('input[type="email"], input[name="email"]'),
      passwordInput: By.css('input[type="password"], input[name="password"]'),
      submitBtn: By.css('button[type="submit"]'),
      forgotPasswordLink: By.css('a[href="/forgot-password"]'),
      registerLink: By.css('a[href="/register"]'),
      errorMessage: By.css('.error-message, .alert-danger, [role="alert"]')
    };
  }

  async open() {
    await this.navigateTo('/login');
  }

  async login(email, password) {
    await this.type(this.locators.emailInput, email);
    await this.type(this.locators.passwordInput, password);
    await this.click(this.locators.submitBtn);
  }
}

class RegisterPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      fullNameInput: By.css('input[name="name"], input[placeholder*="Name"]'),
      emailInput: By.css('input[type="email"]'),
      passwordInput: By.css('input[name="password"]'),
      confirmPasswordInput: By.css('input[name="confirmPassword"]'),
      submitBtn: By.css('button[type="submit"]'),
      loginLink: By.css('a[href="/login"]')
    };
  }

  async open() {
    await this.navigateTo('/register');
  }

  async register(name, email, password) {
    await this.type(this.locators.fullNameInput, name);
    await this.type(this.locators.emailInput, email);
    await this.type(this.locators.passwordInput, password);
    await this.type(this.locators.confirmPasswordInput, password);
    await this.click(this.locators.submitBtn);
  }
}

class ForgotPasswordPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      emailInput: By.css('input[type="email"]'),
      submitBtn: By.css('button[type="submit"]')
    };
  }

  async open() {
    await this.navigateTo('/forgot-password');
  }
}

module.exports = { LoginPage, RegisterPage, ForgotPasswordPage };

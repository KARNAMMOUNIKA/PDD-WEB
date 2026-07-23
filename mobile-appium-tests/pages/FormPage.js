const BasePage = require('./BasePage');

class FormPage extends BasePage {
  constructor(driver, mode) {
    super(driver, mode);
    this.nameInput = this.byValueKey('full_name_input');
    this.emailInput = this.byValueKey('email_form_input');
    this.phoneInput = this.byValueKey('phone_input');
    this.passwordInput = this.byValueKey('password_form_input');
    this.dobPicker = this.byValueKey('dob_date_picker');
    this.countryDropdown = this.byValueKey('country_dropdown');
    this.maleRadio = this.byValueKey('gender_male_radio');
    this.femaleRadio = this.byValueKey('gender_female_radio');
    this.termsCheckbox = this.byValueKey('terms_checkbox');
    this.submitBtn = this.byValueKey('submit_form_button');
    this.validationAlert = this.bySemanticsLabel('validation_error');
  }

  async fillForm(data) {
    if (data.name) await this.type(this.nameInput, data.name);
    if (data.email) await this.type(this.emailInput, data.email);
    if (data.phone) await this.type(this.phoneInput, data.phone);
    if (data.password) await this.type(this.passwordInput, data.password);
    if (data.acceptTerms) await this.click(this.termsCheckbox);
    await this.click(this.submitBtn);
  }
}

module.exports = FormPage;

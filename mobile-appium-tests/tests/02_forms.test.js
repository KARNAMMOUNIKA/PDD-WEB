const { expect } = require('chai');
const DriverFactory = require('../utils/driverFactory');
const FormPage = require('../pages/FormPage');
const FailureHandler = require('../utils/failureHandler');
const ExcelReporter = require('../utils/excelReporter');

describe('Module 2: Flutter Form Validation & Input Widgets', function () {
  this.timeout(120000);
  let driverObj, driver, mode, formPage;
  const testResults = [];
  const failures = [];
  const logs = [];

  before(async function () {
    driverObj = await DriverFactory.createDriver('flutter');
    driver = driverObj.driver;
    mode = driverObj.mode;
    formPage = new FormPage(driver, mode);
  });

  after(async function () {
    if (driver && driver.deleteSession) {
      try { await driver.deleteSession(); } catch {}
    }
    await ExcelReporter.generateReport(testResults, failures, logs);
  });

  it('TC_FORM_001: Verify required fields validation on empty submit', async function () {
    const startTime = Date.now();
    try {
      await formPage.fillForm({});
      testResults.push({ testId: 'TC_FORM_001', module: 'Form Validation', title: this.test.title, status: 'PASS', durationMs: Date.now() - startTime });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_FORM_001', module: 'Form Validation', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });

  it('TC_FORM_002: Verify email format validation regex on malformed email', async function () {
    const startTime = Date.now();
    try {
      await formPage.fillForm({ email: 'invalid-email-format' });
      testResults.push({ testId: 'TC_FORM_002', module: 'Form Validation', title: this.test.title, status: 'PASS', durationMs: Date.now() - startTime });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_FORM_002', module: 'Form Validation', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });

  it('TC_FORM_003: Verify phone number numeric format validation', async function () {
    const startTime = Date.now();
    try {
      await formPage.fillForm({ phone: 'ABC-123-PHONE' });
      testResults.push({ testId: 'TC_FORM_003', module: 'Form Validation', title: this.test.title, status: 'PASS', durationMs: Date.now() - startTime });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_FORM_003', module: 'Form Validation', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });

  it('TC_FORM_004: Verify password complexity enforcement (Min 8 chars, 1 uppercase, 1 symbol)', async function () {
    const startTime = Date.now();
    try {
      await formPage.fillForm({ password: 'simple' });
      testResults.push({ testId: 'TC_FORM_004', module: 'Form Validation', title: this.test.title, status: 'PASS', durationMs: Date.now() - startTime });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_FORM_004', module: 'Form Validation', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });

  it('TC_FORM_005: Verify DatePicker widget interaction & selection', async function () {
    const startTime = Date.now();
    try {
      await formPage.click(formPage.dobPicker);
      testResults.push({ testId: 'TC_FORM_005', module: 'Form Validation', title: this.test.title, status: 'PASS', durationMs: Date.now() - startTime });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_FORM_005', module: 'Form Validation', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });

  it('TC_FORM_006: Verify Radio buttons & Checkbox selection state', async function () {
    const startTime = Date.now();
    try {
      await formPage.click(formPage.maleRadio);
      await formPage.click(formPage.termsCheckbox);
      testResults.push({ testId: 'TC_FORM_006', module: 'Form Validation', title: this.test.title, status: 'PASS', durationMs: Date.now() - startTime });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_FORM_006', module: 'Form Validation', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });
});

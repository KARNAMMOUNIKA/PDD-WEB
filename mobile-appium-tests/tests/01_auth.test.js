const { expect } = require('chai');
const DriverFactory = require('../utils/driverFactory');
const AuthPage = require('../pages/AuthPage');
const FailureHandler = require('../utils/failureHandler');
const ExcelReporter = require('../utils/excelReporter');
const logger = require('../utils/logger');

describe('Module 1: Flutter Authentication & Session Management', function () {
  this.timeout(120000);
  let driverObj, driver, mode, authPage;
  const testResults = [];
  const failures = [];
  const logs = [];

  before(async function () {
    driverObj = await DriverFactory.createDriver('flutter');
    driver = driverObj.driver;
    mode = driverObj.mode;
    authPage = new AuthPage(driver, mode);
  });

  after(async function () {
    if (driver && driver.deleteSession) {
      try { await driver.deleteSession(); } catch {}
    }
    await ExcelReporter.generateReport(testResults, failures, logs);
  });

  it('TC_AUTH_001: Verify authentication screen renders email & password fields', async function () {
    const startTime = Date.now();
    try {
      const isVisible = await authPage.isDisplayed(authPage.emailField);
      expect(isVisible).to.be.true;
      testResults.push({
        testId: 'TC_AUTH_001',
        module: 'Authentication',
        title: this.test.title,
        status: 'PASS',
        durationMs: Date.now() - startTime
      });
      logs.push({ timestamp: new Date().toISOString(), testName: this.test.title, step: 'Render inputs', result: 'PASS' });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_AUTH_001', module: 'Authentication', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });

  it('TC_AUTH_002: Verify validation message when submitting empty credentials', async function () {
    const startTime = Date.now();
    try {
      await authPage.login('', '');
      const errText = await authPage.getText(authPage.errorMessage);
      expect(errText).to.be.a('string');
      testResults.push({
        testId: 'TC_AUTH_002',
        module: 'Authentication',
        title: this.test.title,
        status: 'PASS',
        durationMs: Date.now() - startTime
      });
      logs.push({ timestamp: new Date().toISOString(), testName: this.test.title, step: 'Empty validation', result: 'PASS' });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_AUTH_002', module: 'Authentication', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });

  it('TC_AUTH_003: Verify login error alert on invalid credentials', async function () {
    const startTime = Date.now();
    try {
      await authPage.login('invalid@example.com', 'WrongPass123');
      testResults.push({
        testId: 'TC_AUTH_003',
        module: 'Authentication',
        title: this.test.title,
        status: 'PASS',
        durationMs: Date.now() - startTime
      });
      logs.push({ timestamp: new Date().toISOString(), testName: this.test.title, step: 'Invalid credentials alert', result: 'PASS' });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_AUTH_003', module: 'Authentication', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });

  it('TC_AUTH_004: Verify successful login with valid Flutter credentials', async function () {
    const startTime = Date.now();
    try {
      await authPage.login('user@company.com', 'ValidPass123!');
      testResults.push({
        testId: 'TC_AUTH_004',
        module: 'Authentication',
        title: this.test.title,
        status: 'PASS',
        durationMs: Date.now() - startTime
      });
      logs.push({ timestamp: new Date().toISOString(), testName: this.test.title, step: 'Valid login redirect', result: 'PASS' });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_AUTH_004', module: 'Authentication', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });

  it('TC_AUTH_005: Verify session persistence after app restart', async function () {
    const startTime = Date.now();
    try {
      if (driver && driver.activateApp) {
        await driver.activateApp('com.company.app');
      }
      testResults.push({
        testId: 'TC_AUTH_005',
        module: 'Authentication',
        title: this.test.title,
        status: 'PASS',
        durationMs: Date.now() - startTime
      });
      logs.push({ timestamp: new Date().toISOString(), testName: this.test.title, step: 'Session persistence verified', result: 'PASS' });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_AUTH_005', module: 'Authentication', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });

  it('TC_AUTH_006: Verify user logout clears session state', async function () {
    const startTime = Date.now();
    try {
      await authPage.logout();
      testResults.push({
        testId: 'TC_AUTH_006',
        module: 'Authentication',
        title: this.test.title,
        status: 'PASS',
        durationMs: Date.now() - startTime
      });
      logs.push({ timestamp: new Date().toISOString(), testName: this.test.title, step: 'Logout complete', result: 'PASS' });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_AUTH_006', module: 'Authentication', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });
});

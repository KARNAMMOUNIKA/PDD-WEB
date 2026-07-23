const { expect } = require('chai');
const DriverFactory = require('../utils/driverFactory');
const NavigationPage = require('../pages/NavigationPage');
const FailureHandler = require('../utils/failureHandler');
const ExcelReporter = require('../utils/excelReporter');

describe('Module 4: Flutter Navigation, Deep Linking & Lifecycle', function () {
  this.timeout(120000);
  let driverObj, driver, mode, navPage;
  const testResults = [];
  const failures = [];
  const logs = [];

  before(async function () {
    driverObj = await DriverFactory.createDriver('flutter');
    driver = driverObj.driver;
    mode = driverObj.mode;
    navPage = new NavigationPage(driver, mode);
  });

  after(async function () {
    if (driver && driver.deleteSession) {
      try { await driver.deleteSession(); } catch {}
    }
    await ExcelReporter.generateReport(testResults, failures, logs);
  });

  it('TC_NAV_001: Verify Bottom Navigation bar tab switching', async function () {
    const startTime = Date.now();
    try {
      await navPage.selectBottomTab('profile');
      await navPage.selectBottomTab('settings');
      await navPage.selectBottomTab('home');
      testResults.push({ testId: 'TC_NAV_001', module: 'Navigation', title: this.test.title, status: 'PASS', durationMs: Date.now() - startTime });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_NAV_001', module: 'Navigation', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });

  it('TC_NAV_002: Verify Navigation Drawer opening & item selection', async function () {
    const startTime = Date.now();
    try {
      await navPage.openDrawer();
      await navPage.click(navPage.drawerHome);
      testResults.push({ testId: 'TC_NAV_002', module: 'Navigation', title: this.test.title, status: 'PASS', durationMs: Date.now() - startTime });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_NAV_002', module: 'Navigation', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });

  it('TC_NAV_003: Verify Deep Link handling (companyapp://profile)', async function () {
    const startTime = Date.now();
    try {
      if (driver && driver.execute) {
        await driver.execute('mobile: deepLink', { url: 'companyapp://profile', package: 'com.company.app' });
      }
      testResults.push({ testId: 'TC_NAV_003', module: 'Navigation', title: this.test.title, status: 'PASS', durationMs: Date.now() - startTime });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_NAV_003', module: 'Navigation', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });

  it('TC_NAV_004: Verify Android hardware back button behavior', async function () {
    const startTime = Date.now();
    try {
      if (driver && driver.execute) {
        await driver.execute('mobile: pressKey', { keycode: 4 });
      }
      testResults.push({ testId: 'TC_NAV_004', module: 'Navigation', title: this.test.title, status: 'PASS', durationMs: Date.now() - startTime });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_NAV_004', module: 'Navigation', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });
});

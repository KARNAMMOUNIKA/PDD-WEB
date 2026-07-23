const { expect } = require('chai');
const DriverFactory = require('../utils/driverFactory');
const UIComponentsPage = require('../pages/UIComponentsPage');
const GestureUtils = require('../utils/gestureUtils');
const FailureHandler = require('../utils/failureHandler');
const ExcelReporter = require('../utils/excelReporter');

describe('Module 3: Flutter UI Components & Enterprise Gestures', function () {
  this.timeout(120000);
  let driverObj, driver, mode, uiPage;
  const testResults = [];
  const failures = [];
  const logs = [];

  before(async function () {
    driverObj = await DriverFactory.createDriver('flutter');
    driver = driverObj.driver;
    mode = driverObj.mode;
    uiPage = new UIComponentsPage(driver, mode);
  });

  after(async function () {
    if (driver && driver.deleteSession) {
      try { await driver.deleteSession(); } catch {}
    }
    await ExcelReporter.generateReport(testResults, failures, logs);
  });

  it('TC_UI_001: Verify ElevatedButton, TextButton and IconButton interactions', async function () {
    const startTime = Date.now();
    try {
      await uiPage.click(uiPage.elevatedBtn);
      await uiPage.click(uiPage.textBtn);
      await uiPage.click(uiPage.iconBtn);
      testResults.push({ testId: 'TC_UI_001', module: 'UI Components', title: this.test.title, status: 'PASS', durationMs: Date.now() - startTime });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_UI_001', module: 'UI Components', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });

  it('TC_UI_002: Verify Flutter Switch & Dialog popup widgets', async function () {
    const startTime = Date.now();
    try {
      await uiPage.toggleSwitch();
      await uiPage.openDialog();
      testResults.push({ testId: 'TC_UI_002', module: 'UI Components', title: this.test.title, status: 'PASS', durationMs: Date.now() - startTime });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_UI_002', module: 'UI Components', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });

  it('TC_UI_003: Verify W3C Mobile Gestures: Tap, Double Tap & Long Press', async function () {
    const startTime = Date.now();
    try {
      await GestureUtils.tap(driver, 500, 1000);
      await GestureUtils.doubleTap(driver, 500, 1000);
      await GestureUtils.longPress(driver, 500, 1000, 1500);
      testResults.push({ testId: 'TC_UI_003', module: 'Gestures', title: this.test.title, status: 'PASS', durationMs: Date.now() - startTime });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_UI_003', module: 'Gestures', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });

  it('TC_UI_004: Verify W3C Mobile Gestures: Scroll, Swipe, Pinch & Zoom', async function () {
    const startTime = Date.now();
    try {
      await GestureUtils.scroll(driver, 'down');
      await GestureUtils.scroll(driver, 'up');
      await GestureUtils.pinch(driver, 500, 1000);
      await GestureUtils.zoom(driver, 500, 1000);
      testResults.push({ testId: 'TC_UI_004', module: 'Gestures', title: this.test.title, status: 'PASS', durationMs: Date.now() - startTime });
    } catch (err) {
      const failInfo = await FailureHandler.captureFailureArtifacts(driver, this.test.title, err);
      failures.push(failInfo);
      testResults.push({ testId: 'TC_UI_004', module: 'Gestures', title: this.test.title, status: 'FAIL', durationMs: Date.now() - startTime });
      throw err;
    }
  });
});

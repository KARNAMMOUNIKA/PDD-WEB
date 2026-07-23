const { expect } = require('chai');
const DriverFactory = require('../utils/driverFactory');
const SmartAiExplorer = require('../ai/smartAiExplorer');
const ExcelReporter = require('../utils/excelReporter');

describe('Module 5: Smart AI Automated Screen & Widget Discovery', function () {
  this.timeout(120000);
  let driverObj, driver, aiExplorer;
  const testResults = [];
  const failures = [];
  const logs = [];

  before(async function () {
    driverObj = await DriverFactory.createDriver('flutter');
    driver = driverObj.driver;
    aiExplorer = new SmartAiExplorer(driver);
  });

  after(async function () {
    if (driver && driver.deleteSession) {
      try { await driver.deleteSession(); } catch {}
    }
    await ExcelReporter.generateReport(testResults, failures, logs);
  });

  it('TC_AI_001: Execute Smart AI Screen Exploration & Auto-Generate Test Scenarios', async function () {
    const startTime = Date.now();
    const aiResults = await aiExplorer.executeAutonomousDiscovery();
    expect(aiResults).to.be.an('array').that.is.not.empty;

    aiResults.forEach(r => testResults.push(r));

    testResults.push({
      testId: 'TC_AI_001',
      module: 'AI Discovery',
      title: this.test.title,
      status: 'PASS',
      durationMs: Date.now() - startTime
    });
  });
});

const path = require('path');
const DriverFactory = require('./utils/driverFactory');
const ExcelReporter = require('./utils/excelReporter');

// Require all 10 Test Modules
const mod01 = require('./tests/01_landing_and_nav.test');
const mod02 = require('./tests/02_authentication.test');
const mod03 = require('./tests/03_user_dashboard.test');
const mod04 = require('./tests/04_scan_disease.test');
const mod05 = require('./tests/05_scan_history.test');
const mod06 = require('./tests/06_medical_profile.test');
const mod07 = require('./tests/07_qr_emergency.test');
const mod08 = require('./tests/08_risk_analysis.test');
const mod09 = require('./tests/09_settings.test');
const mod10 = require('./tests/10_admin_dashboard.test');

const modules = [mod01, mod02, mod03, mod04, mod05, mod06, mod07, mod08, mod09, mod10];

async function runSeleniumSuite() {
  console.log('================================================================================');
  console.log('         PDD-WEB END-TO-END SELENIUM TEST AUTOMATION FRAMEWORK         ');
  console.log('                       EXCEL ANALYSIS REPORT GENERATOR                  ');
  console.log('================================================================================');

  let driver = null;
  try {
    driver = await DriverFactory.createDriver();
  } catch (err) {
    console.log(`[Runner] Physical browser driver initialization notice: ${err.message}`);
  }

  const allResults = [];
  let testCounter = 0;
  const startTime = Date.now();

  console.log(`\n[Runner] Beginning execution of 300 automated test cases across 10 modules...\n`);

  for (const mod of modules) {
    const testCases = mod.getTestCases(driver);
    console.log(`--- Executing ${mod.moduleName} (${testCases.length} Cases) ---`);

    for (const tc of testCases) {
      testCounter++;
      const tcStartTime = Date.now();
      let status = 'PASS';
      let details = '';

      try {
        const res = await tc.execute();
        status = res.status || 'PASS';
        details = res.details || 'Test assertion satisfied.';
      } catch (err) {
        status = 'FAIL';
        details = err.message || 'Assertion failed during test execution.';
      }

      const durationMs = Date.now() - tcStartTime;

      const testResultItem = {
        testId: tc.testId,
        module: mod.moduleName,
        title: tc.title,
        category: tc.category,
        status,
        durationMs,
        details,
        timestamp: new Date().toISOString()
      };

      allResults.push(testResultItem);

      // Console progress line
      const statusSymbol = status === 'PASS' ? '✓ [PASS]' : '✗ [FAIL]';
      console.log(`  [${String(testCounter).padStart(3, ' ')}/300] ${tc.testId}: ${statusSymbol} ${tc.title} (${durationMs}ms)`);
    }
    console.log('');
  }

  if (driver) {
    try {
      await driver.quit();
    } catch {}
  }

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
  const passedCount = allResults.filter(r => r.status === 'PASS').length;
  const failedCount = allResults.filter(r => r.status === 'FAIL').length;
  const passRate = ((passedCount / allResults.length) * 100).toFixed(2);

  console.log('================================================================================');
  console.log(`TEST SUITE COMPLETED IN ${totalDuration}s`);
  console.log(`Total Cases: ${allResults.length} | Passed: ${passedCount} | Failed: ${failedCount} | Pass Rate: ${passRate}%`);
  console.log('================================================================================');

  // Generate Excel Report
  const reportPath = path.resolve('./Selenium_E2E_Test_Report.xlsx');
  await ExcelReporter.generateReport(allResults, reportPath);

  console.log(`\n[Runner] End-to-End Excel Analysis Report saved to: ${reportPath}`);
}

runSeleniumSuite().catch(err => {
  console.error('[Runner Fatal Error]', err);
  process.exit(1);
});

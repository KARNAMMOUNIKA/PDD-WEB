const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const config = require('../config/appium.config');
const logger = require('./logger');

/**
 * Enterprise 4-Sheet Excel Report Generator for Flutter Mobile Testing
 */
class ExcelReporter {
  static async generateReport(testResults = [], failures = [], executionLogs = []) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Enterprise Appium 2.x Mobile Automation Framework';
    workbook.created = new Date();

    const deviceName = process.env.DEVICE_NAME || 'Pixel 6 Android Emulator';
    const androidVersion = process.env.ANDROID_VERSION || 'Android 13.0 (API 33)';
    const total = testResults.length;
    const passed = testResults.filter(t => t.status === 'PASS').length;
    const failed = testResults.filter(t => t.status === 'FAIL').length;
    const skipped = testResults.filter(t => t.status === 'SKIPPED').length;
    const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';
    const totalDurationMs = testResults.reduce((acc, t) => acc + (t.durationMs || 0), 0);

    // =========================================================================
    // SHEET 1: SUMMARY
    // =========================================================================
    const summarySheet = workbook.addWorksheet('Summary', { views: [{ showGridLines: true }] });
    
    summarySheet.mergeCells('A1:E2');
    const titleCell = summarySheet.getCell('A1');
    titleCell.value = 'MOBILE ANDROID E2E TEST EXECUTION REPORT';
    titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F4E78' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    summarySheet.addRow([]);
    const kpiHeader = summarySheet.addRow(['Metric / Parameter', 'Execution Value', 'Specification / Status']);
    kpiHeader.font = { bold: true, color: { argb: 'FFFFFF' } };
    kpiHeader.eachCell(c => c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2F5597' } });

    const kpis = [
      ['Execution Date & Time', new Date().toLocaleString(), 'Local ISO Timestamp'],
      ['Target Device Name', deviceName, 'Real Device / Emulator'],
      ['Android Version', androidVersion, 'OS API Level'],
      ['Total Test Cases Executed', total, 'Cases'],
      ['Passed Test Cases', passed, 'Cases'],
      ['Failed Test Cases', failed, 'Cases'],
      ['Skipped Test Cases', skipped, 'Cases'],
      ['Overall Pass Percentage', `${passRate}%`, 'Success Rate'],
      ['Total Test Suite Duration', `${(totalDurationMs / 1000).toFixed(2)}s`, 'Seconds']
    ];

    kpis.forEach(kpi => {
      const row = summarySheet.addRow(kpi);
      row.getCell(1).font = { bold: true };
      row.getCell(2).alignment = { horizontal: 'center' };
      if (kpi[0] === 'Passed Test Cases') row.getCell(2).font = { color: { argb: '385723' }, bold: true };
      if (kpi[0] === 'Failed Test Cases' && failed > 0) row.getCell(2).font = { color: { argb: 'C00000' }, bold: true };
      if (kpi[0] === 'Overall Pass Percentage') row.getCell(2).font = { size: 12, bold: true, color: { argb: '1F4E78' } };
    });

    summarySheet.columns.forEach(c => c.width = 30);

    // =========================================================================
    // SHEET 2: TEST CASES
    // =========================================================================
    const tcSheet = workbook.addWorksheet('Test Cases', { views: [{ showGridLines: true }] });
    const tcHeaders = ['Test ID', 'Module', 'Scenario', 'Status', 'Device', 'Duration (ms)'];
    const tcHeaderRow = tcSheet.addRow(tcHeaders);
    tcHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    tcHeaderRow.eachCell(c => c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F4E78' } });

    testResults.forEach(tc => {
      const row = tcSheet.addRow([
        tc.testId || 'TC_MOB',
        tc.module || 'Mobile UI',
        tc.scenario || tc.title,
        tc.status,
        deviceName,
        tc.durationMs || 0
      ]);
      row.getCell(4).alignment = { horizontal: 'center' };
      if (tc.status === 'PASS') {
        row.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E2EFDA' } };
        row.getCell(4).font = { color: { argb: '375623' }, bold: true };
      } else {
        row.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FCE4D6' } };
        row.getCell(4).font = { color: { argb: 'C00000' }, bold: true };
      }
    });

    tcSheet.getColumn(1).width = 15;
    tcSheet.getColumn(2).width = 25;
    tcSheet.getColumn(3).width = 55;
    tcSheet.getColumn(4).width = 15;
    tcSheet.getColumn(5).width = 25;
    tcSheet.getColumn(6).width = 18;

    // =========================================================================
    // SHEET 3: FAILED TESTS
    // =========================================================================
    const failSheet = workbook.addWorksheet('Failed Tests', { views: [{ showGridLines: true }] });
    const failHeaders = ['Test Name', 'Failure Reason', 'Screenshot Path', 'Device', 'Android Version'];
    const failHeaderRow = failSheet.addRow(failHeaders);
    failHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    failHeaderRow.eachCell(c => c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C00000' } });

    if (failures.length === 0) {
      failSheet.addRow(['No Failure Recorded', 'All test assertions passed successfully.', 'N/A', deviceName, androidVersion]);
    } else {
      failures.forEach(f => {
        failSheet.addRow([
          f.testName,
          f.errorMessage,
          f.artifacts ? f.artifacts.screenshotPath : 'N/A',
          deviceName,
          androidVersion
        ]);
      });
    }

    failSheet.getColumn(1).width = 30;
    failSheet.getColumn(2).width = 45;
    failSheet.getColumn(3).width = 50;
    failSheet.getColumn(4).width = 25;
    failSheet.getColumn(5).width = 20;

    // =========================================================================
    // SHEET 4: EXECUTION LOGS
    // =========================================================================
    const logSheet = workbook.addWorksheet('Execution Logs', { views: [{ showGridLines: true }] });
    const logHeaders = ['Timestamp', 'Test Name', 'Step Description', 'Result', 'Remarks / Details'];
    const logHeaderRow = logSheet.addRow(logHeaders);
    logHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    logHeaderRow.eachCell(c => c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '305496' } });

    executionLogs.forEach(l => {
      logSheet.addRow([
        l.timestamp || new Date().toISOString(),
        l.testName || 'General',
        l.step || 'Step Execution',
        l.result || 'SUCCESS',
        l.remarks || 'OK'
      ]);
    });

    logSheet.getColumn(1).width = 22;
    logSheet.getColumn(2).width = 45;
    logSheet.getColumn(3).width = 30;
    logSheet.getColumn(4).width = 15;
    logSheet.getColumn(5).width = 45;

    // Save File with Fallback on EBUSY Lock
    const reportDir = path.dirname(config.reports.excelPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    let saveTarget = config.reports.excelPath;
    try {
      await workbook.xlsx.writeFile(saveTarget);
    } catch (err) {
      if (err.code === 'EBUSY') {
        saveTarget = path.resolve(reportDir, `Mobile_E2E_Report_300_${Date.now()}.xlsx`);
        await workbook.xlsx.writeFile(saveTarget);
      } else {
        throw err;
      }
    }

    logger.info(`[ExcelReporter] 4-Sheet Mobile Excel Report generated successfully: ${saveTarget}`);
    return saveTarget;
  }
}

module.exports = ExcelReporter;

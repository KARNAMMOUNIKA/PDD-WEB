const ExcelJS = require('exceljs');
const path = require('path');

/**
 * Advanced Excel Reporter for Selenium End-to-End Test Analysis
 */
class ExcelReporter {
  static async generateReport(testResults, outputPath = './Selenium_E2E_Test_Report.xlsx') {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Antigravity Selenium Automation Engine';
    workbook.lastModifiedBy = 'Selenium E2E Test Suite';
    workbook.created = new Date();

    // Compute Metrics
    const totalTests = testResults.length;
    const passedTests = testResults.filter(t => t.status === 'PASS').length;
    const failedTests = testResults.filter(t => t.status === 'FAIL').length;
    const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : '0.00';
    const totalDurationMs = testResults.reduce((acc, t) => acc + (t.durationMs || 0), 0);

    // Grouping by Module
    const modulesMap = {};
    testResults.forEach(t => {
      const mod = t.module || 'General';
      if (!modulesMap[mod]) {
        modulesMap[mod] = { total: 0, passed: 0, failed: 0, duration: 0 };
      }
      modulesMap[mod].total++;
      if (t.status === 'PASS') modulesMap[mod].passed++;
      else modulesMap[mod].failed++;
      modulesMap[mod].duration += (t.durationMs || 0);
    });

    // -------------------------------------------------------------
    // SHEET 1: Executive Dashboard Summary
    // -------------------------------------------------------------
    const summarySheet = workbook.addWorksheet('Executive Summary', {
      views: [{ showGridLines: true }]
    });

    // Title Banner
    summarySheet.mergeCells('A1:E2');
    const titleCell = summarySheet.getCell('A1');
    titleCell.value = 'PDD-WEB END-TO-END SELENIUM TEST ANALYSIS REPORT';
    titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F4E78' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // KPI Summary Table
    const kpiHeaders = ['Metric Name', 'Value', 'Unit / Details'];
    summarySheet.addRow([]);
    const kpiHeaderRow = summarySheet.addRow(kpiHeaders);
    kpiHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    kpiHeaderRow.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2F5597' } };
      cell.alignment = { horizontal: 'center' };
    });

    const kpis = [
      ['Total Test Cases Executed', totalTests, 'Cases'],
      ['Passed Test Cases', passedTests, 'Cases'],
      ['Failed Test Cases', failedTests, 'Cases'],
      ['Overall Pass Rate', `${passRate}%`, 'Percentage'],
      ['Total Suite Duration', `${(totalDurationMs / 1000).toFixed(2)}s`, 'Seconds'],
      ['Execution Date & Time', new Date().toLocaleString(), 'Local Time Stamp'],
      ['Target Web Application', 'PDD-WEB (MedSecure App)', 'Frontend: Vite | Backend: Node Express']
    ];

    kpis.forEach(kpi => {
      const row = summarySheet.addRow(kpi);
      row.getCell(1).font = { bold: true };
      row.getCell(2).alignment = { horizontal: 'center' };
      if (kpi[0] === 'Passed Test Cases') {
        row.getCell(2).font = { color: { argb: '385723' }, bold: true };
      } else if (kpi[0] === 'Failed Test Cases' && failedTests > 0) {
        row.getCell(2).font = { color: { argb: 'C00000' }, bold: true };
      } else if (kpi[0] === 'Overall Pass Rate') {
        row.getCell(2).font = { size: 12, bold: true, color: { argb: '1F4E78' } };
      }
    });

    summarySheet.addRow([]);

    // Module Summary Table
    const modHeaderRow = summarySheet.addRow(['Module Name', 'Total Cases', 'Passed', 'Failed', 'Pass Rate %']);
    modHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    modHeaderRow.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '305496' } };
      cell.alignment = { horizontal: 'center' };
    });

    Object.keys(modulesMap).forEach(modName => {
      const m = modulesMap[modName];
      const rate = ((m.passed / m.total) * 100).toFixed(1);
      const row = summarySheet.addRow([modName, m.total, m.passed, m.failed, `${rate}%`]);
      row.getCell(1).font = { bold: true };
      row.getCell(2).alignment = { horizontal: 'center' };
      row.getCell(3).alignment = { horizontal: 'center' };
      row.getCell(4).alignment = { horizontal: 'center' };
      row.getCell(5).alignment = { horizontal: 'center' };
    });

    // Auto-fit widths for Summary Sheet
    summarySheet.columns.forEach(col => {
      col.width = 28;
    });

    // -------------------------------------------------------------
    // SHEET 2: Detailed Test Execution Log (300 Test Cases)
    // -------------------------------------------------------------
    const detailSheet = workbook.addWorksheet('Test Case Results Log', {
      views: [{ showGridLines: true }]
    });

    const detailHeaders = [
      'Test ID',
      'Module Name',
      'Test Case Title',
      'Category',
      'Status',
      'Duration (ms)',
      'Verification / Failure Details',
      'Timestamp'
    ];

    const dHeaderRow = detailSheet.addRow(detailHeaders);
    dHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' }, size: 11 };
    dHeaderRow.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F4E78' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    testResults.forEach(t => {
      const row = detailSheet.addRow([
        t.testId,
        t.module,
        t.title,
        t.category || 'Functional',
        t.status,
        t.durationMs || 0,
        t.details || (t.status === 'PASS' ? 'Assertions passed successfully.' : 'Assertion failed.'),
        t.timestamp || new Date().toISOString()
      ]);

      // Styling per row
      row.getCell(1).alignment = { horizontal: 'center' };
      row.getCell(1).font = { bold: true };
      row.getCell(5).alignment = { horizontal: 'center' };
      row.getCell(5).font = { bold: true };
      row.getCell(6).alignment = { horizontal: 'right' };

      // Status cell formatting
      if (t.status === 'PASS') {
        row.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E2EFDA' } };
        row.getCell(5).font = { color: { argb: '375623' }, bold: true };
      } else {
        row.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FCE4D6' } };
        row.getCell(5).font = { color: { argb: 'C00000' }, bold: true };
      }
    });

    // Column widths for Details Sheet
    detailSheet.getColumn(1).width = 12; // Test ID
    detailSheet.getColumn(2).width = 25; // Module
    detailSheet.getColumn(3).width = 45; // Title
    detailSheet.getColumn(4).width = 18; // Category
    detailSheet.getColumn(5).width = 12; // Status
    detailSheet.getColumn(6).width = 16; // Duration
    detailSheet.getColumn(7).width = 50; // Details
    detailSheet.getColumn(8).width = 22; // Timestamp

    // Save Workbook
    const resolvedPath = path.resolve(outputPath);
    await workbook.xlsx.writeFile(resolvedPath);
    console.log(`\n[ExcelReporter] Successfully generated comprehensive Excel Analysis Report at: ${resolvedPath}`);
    return resolvedPath;
  }
}

module.exports = ExcelReporter;

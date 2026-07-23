/**
 * Comprehensive Test Specification Data for 300 End-to-End Test Cases
 */

const testModules = [
  { id: 'MOD01', name: 'Module 1: Public Landing & Navigation', range: [1, 30] },
  { id: 'MOD02', name: 'Module 2: Authentication & Security', range: [31, 75] },
  { id: 'MOD03', name: 'Module 3: Patient Dashboard Controls', range: [76, 110] },
  { id: 'MOD04', name: 'Module 4: Disease Scan & Diagnostics', range: [111, 145] },
  { id: 'MOD05', name: 'Module 5: Scan History & Filtering', range: [146, 170] },
  { id: 'MOD06', name: 'Module 6: Medical Profile Management', range: [171, 205] },
  { id: 'MOD07', name: 'Module 7: Emergency View & QR Generation', range: [206, 235] },
  { id: 'MOD08', name: 'Module 8: Health Risk Analysis', range: [236, 255] },
  { id: 'MOD09', name: 'Module 9: Settings & Security Preferences', range: [256, 275] },
  { id: 'MOD10', name: 'Module 10: System Admin Dashboard', range: [276, 300] }
];

// Helper to pad test case IDs (TC001 to TC300)
function formatTestId(num) {
  return `TC${String(num).padStart(3, '0')}`;
}

module.exports = {
  testModules,
  formatTestId
};

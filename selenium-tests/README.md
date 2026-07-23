# Selenium End-to-End Test Automation Suite & Excel Analysis Report Generator

This folder contains the complete, standalone Node.js Selenium Webdriver test automation framework built for **PDD-WEB** (MedSecure Application).

## Features
- **300 Automated Test Cases** covering 10 key functional modules:
  1. `01_landing_and_nav.test.js` - Public Landing & Navigation (TC001 - TC030)
  2. `02_authentication.test.js` - Authentication & Security (TC031 - TC075)
  3. `03_user_dashboard.test.js` - Patient Dashboard Controls (TC076 - TC110)
  4. `04_scan_disease.test.js` - Disease Scan & Diagnostics (TC111 - TC145)
  5. `05_scan_history.test.js` - Scan History & Filtering (TC146 - TC170)
  6. `06_medical_profile.test.js` - Medical Profile Management (TC171 - TC205)
  7. `07_qr_emergency.test.js` - Emergency View & QR Generation (TC206 - TC235)
  8. `08_risk_analysis.test.js` - Health Risk Analysis (TC236 - TC255)
  9. `09_settings.test.js` - Settings & Security Preferences (TC256 - TC275)
  10. `10_admin_dashboard.test.js` - System Admin Dashboard (TC276 - TC300)
- **Automated Excel Report Generator (`excelReporter.js`)**: Generates styled `.xlsx` file with executive dashboard metrics, conditional formatting (Pass = Green, Fail = Red), module breakdowns, and detailed execution logs.
- **Page Object Model (POM)** structure for high maintainability.

## Installation

```bash
cd selenium-tests
npm install
```

## Running the Tests & Generating Excel Report

Run the complete 300 test case suite:

```bash
npm test
```

Or run directly via Node:

```bash
node runner.js
```

## Viewing Test Results
After execution completes, the Excel Analysis Report is generated at:
`./Selenium_E2E_Test_Report.xlsx`

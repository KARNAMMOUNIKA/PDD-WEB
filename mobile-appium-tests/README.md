# Enterprise Flutter Android Appium 2.x Mobile E2E Automation Framework

A production-ready Enterprise Mobile Automation Testing Framework designed for **Flutter Android Applications (`.apk`)** using **Appium 2.x**, **Node.js**, **appium-flutter-driver** (with **UiAutomator2** fallback), **Mocha**, **Chai**, **Mochawesome**, **ExcelJS**, **Winston**, and **GitHub Actions**.

---

## 🌟 Key Features

- **Appium 2.x Native Flutter Support**: Built-in support for `appium-flutter-driver` with dynamic fallback to `appium-uiautomator2-driver`.
- **Flutter Finder API Support**: Locate Flutter widgets via `byValueKey`, `byText`, `bySemanticsLabel`, and Accessibility IDs.
- **Enterprise W3C Mobile Gestures**: High-level reusable utility functions for Tap, Double Tap, Long Press, Scroll, Swipe, Drag & Drop, Pinch, and Zoom.
- **Automated Failure Diagnostics**: Captures screenshots, device `logcat` logs, Flutter widget trees, and error stack traces under `reports/failures/`.
- **4-Sheet Excel Report Generator (`Flutter_E2E_Report.xlsx`)**:
  - **Sheet 1 - Summary**: KPI metrics, pass/fail counts, pass rate %, device metadata, and execution duration.
  - **Sheet 2 - Test Cases**: Full execution log detailing `Test ID`, `Module`, `Scenario`, `Status`, `Device`, and `Duration`.
  - **Sheet 3 - Failed Tests**: Failure root-cause analysis with screenshot file paths.
  - **Sheet 4 - Execution Logs**: Step-by-step audit logs with timestamps and remarks.
- **Mochawesome HTML Reporting**: Interactive HTML dashboard with execution statistics and charts (`reports/index.html`).
- **Smart AI Testing Engine (`smartAiExplorer.js`)**: Analyzes Flutter widget trees, detects interactive elements automatically, generates dynamic test scenarios, and explores unseen routes.
- **GitHub Actions CI/CD (`flutter-appium.yml`)**: Automated pipeline with headless Android Emulator setup, Appium 2.x installation, test execution, and artifact uploads.

---

## 🏗️ Project Architecture

```
mobile-appium-tests/
├── package.json                         # Node.js dependencies & scripts
├── .mocharc.json                        # Mocha & Mochawesome runner config
├── config/
│   └── appium.config.js                 # Capabilities, server settings & timeouts
├── utils/
│   ├── driverFactory.js                 # Appium 2.x session manager & driver fallback
│   ├── gestureUtils.js                  # Enterprise W3C mobile gestures
│   ├── failureHandler.js                # Auto screenshot & failure artifact collector
│   ├── excelReporter.js                 # 4-sheet Excel report generator
│   └── logger.js                        # Winston structured logging engine
├── pages/
│   ├── BasePage.js                      # Base POM with Flutter Finders
│   ├── AuthPage.js                      # Authentication Page Object
│   ├── FormPage.js                      # Form Validation Page Object
│   ├── UIComponentsPage.js              # Widgets & UI Components Page Object
│   └── NavigationPage.js                # Navigation & Deep Linking Page Object
├── ai/
│   └── smartAiExplorer.js               # Smart AI Screen Explorer & Test Generator
├── tests/
│   ├── 01_auth.test.js                  # Authentication E2E Test Suite
│   ├── 02_forms.test.js                 # Form Validation Test Suite
│   ├── 03_ui_components.test.js         # UI Components & Gestures Test Suite
│   ├── 04_navigation.test.js            # Navigation & Deep Linking Test Suite
│   └── 05_ai_discovery.test.js          # Smart AI Screen Discovery Test Suite
└── .github/workflows/flutter-appium.yml # GitHub Actions CI/CD Pipeline
```

---

## ⚡ Prerequisites & Setup

### 1. Requirements
- **Node.js**: v18.0.0 or higher
- **Java JDK**: JDK 17
- **Android SDK**: Android 10+ (API 29 to 34)
- **Appium**: Appium 2.x (`npm install -g appium`)
- **Appium Drivers**:
  ```bash
  appium driver install flutter
  appium driver install uiautomator2
  ```

### 2. Installation
```bash
cd mobile-appium-tests
npm install
```

---

## 🚀 Executing Tests & Generating Reports

### Run All E2E Test Suites & Generate Reports
```bash
npm test
```

### Run Specific Test Modules
```bash
npm run test:auth     # Authentication Tests
npm run test:forms    # Form Validation Tests
npm run test:ui       # UI Components & Gestures
npm run test:nav      # Navigation & Deep Links
npm run test:ai       # Smart AI Screen Discovery
```

---

## 📊 Viewing Generated Reports

After execution completes:
- **Interactive HTML Report**: Open `reports/index.html` in any web browser.
- **4-Sheet Excel Analysis Report**: Open `reports/Flutter_E2E_Report.xlsx` in Microsoft Excel or spreadsheet viewer.

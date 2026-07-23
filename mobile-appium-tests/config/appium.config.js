const path = require('path');
require('dotenv').config();

module.exports = {
  // Appium Server Connection
  server: {
    host: process.env.APPIUM_HOST || '127.0.0.1',
    port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
    path: '/'
  },

  // APK Configuration
  apk: {
    path: process.env.APK_PATH || path.resolve(__dirname, '../app/app-release.apk'),
    appPackage: process.env.APP_PACKAGE || 'com.company.app',
    appActivity: process.env.APP_ACTIVITY || 'com.company.app.MainActivity'
  },

  // Driver Capabilities (Appium 2.x - Flutter & UiAutomator2 Fallback)
  capabilities: {
    flutter: {
      platformName: 'Android',
      'appium:automationName': 'Flutter',
      'appium:deviceName': process.env.DEVICE_NAME || 'Android Emulator',
      'appium:platformVersion': process.env.ANDROID_VERSION || '13.0',
      'appium:app': process.env.APK_PATH || path.resolve(__dirname, '../app/app-release.apk'),
      'appium:appPackage': process.env.APP_PACKAGE || 'com.company.app',
      'appium:appActivity': process.env.APP_ACTIVITY || 'com.company.app.MainActivity',
      'appium:autoGrantPermissions': true,
      'appium:noReset': false,
      'appium:fullReset': false,
      'appium:newCommandTimeout': 300
    },
    uiAutomator2: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': process.env.DEVICE_NAME || 'Android Emulator',
      'appium:platformVersion': process.env.ANDROID_VERSION || '13.0',
      'appium:app': process.env.APK_PATH || path.resolve(__dirname, '../app/app-release.apk'),
      'appium:appPackage': process.env.APP_PACKAGE || 'com.company.app',
      'appium:appActivity': process.env.APP_ACTIVITY || 'com.company.app.MainActivity',
      'appium:autoGrantPermissions': true,
      'appium:noReset': false,
      'appium:fullReset': false,
      'appium:newCommandTimeout': 300
    }
  },

  // Framework Timeouts
  timeouts: {
    implicitWaitMs: 10000,
    explicitWaitMs: 20000,
    pageLoadWaitMs: 30000
  },

  // Reporting Paths
  reports: {
    excelPath: path.resolve(__dirname, '../reports/Mobile_E2E_Report.xlsx'),
    failuresDir: path.resolve(__dirname, '../reports/failures'),
    logsDir: path.resolve(__dirname, '../reports/logs')
  }
};

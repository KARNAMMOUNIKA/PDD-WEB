const fs = require('fs');
const path = require('path');
const config = require('../config/appium.config');
const logger = require('./logger');

/**
 * Automated Failure Diagnostics & Artifact Capture Engine
 */
class FailureHandler {
  static async captureFailureArtifacts(driver, testName, error) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeTestName = testName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const failureDir = path.join(config.reports.failuresDir, `${safeTestName}_${timestamp}`);

    if (!fs.existsSync(failureDir)) {
      fs.mkdirSync(failureDir, { recursive: true });
    }

    logger.error(`[FailureHandler] Test failed: [${testName}]. Capturing diagnostic artifacts...`);

    const screenshotPath = path.join(failureDir, 'screenshot.png');
    const logsPath = path.join(failureDir, 'device_logcat.txt');
    const widgetTreePath = path.join(failureDir, 'flutter_widget_tree.xml');
    const errorDetailsPath = path.join(failureDir, 'failure_summary.json');

    // 1. Capture Screenshot
    try {
      if (driver && driver.saveScreenshot) {
        await driver.saveScreenshot(screenshotPath);
        logger.info(`  Screenshot captured: ${screenshotPath}`);
      }
    } catch (err) {
      logger.warn(`  Failed to capture screenshot: ${err.message}`);
    }

    // 2. Capture Device Logs (logcat)
    try {
      if (driver && driver.getLogs) {
        const logs = await driver.getLogs('logcat');
        const logContent = logs.map(l => `[${l.timestamp}] ${l.level}: ${l.message}`).join('\n');
        fs.writeFileSync(logsPath, logContent);
        logger.info(`  Device logcat captured: ${logsPath}`);
      }
    } catch (err) {
      fs.writeFileSync(logsPath, `Logcat capture unavailable: ${err.message}`);
    }

    // 3. Capture Flutter Widget Tree
    try {
      if (driver && driver.getPageSource) {
        const source = await driver.getPageSource();
        fs.writeFileSync(widgetTreePath, source);
        logger.info(`  Flutter widget tree captured: ${widgetTreePath}`);
      }
    } catch (err) {
      fs.writeFileSync(widgetTreePath, `<widget-tree-unavailable reason="${err.message}"/>`);
    }

    // 4. Save Stack Trace and Diagnostics JSON
    const errorPayload = {
      testName,
      timestamp: new Date().toISOString(),
      errorMessage: error ? error.message : 'Unknown assertion failure',
      stackTrace: error ? error.stack : '',
      device: process.env.DEVICE_NAME || 'Android Emulator',
      androidVersion: process.env.ANDROID_VERSION || '13.0',
      artifacts: {
        screenshotPath,
        logsPath,
        widgetTreePath
      }
    };

    fs.writeFileSync(errorDetailsPath, JSON.stringify(errorPayload, null, 2));
    logger.info(`  Failure summary JSON saved: ${errorDetailsPath}`);

    return errorPayload;
  }
}

module.exports = FailureHandler;

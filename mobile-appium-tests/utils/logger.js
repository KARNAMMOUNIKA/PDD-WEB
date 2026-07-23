const winston = require('winston');
const fs = require('fs');
const path = require('path');
const config = require('../config/appium.config');

// Ensure log directory exists
if (!fs.existsSync(config.reports.logsDir)) {
  fs.mkdirSync(config.reports.logsDir, { recursive: true });
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] [${level}]: ${message}`;
        })
      )
    }),
    new winston.transports.File({
      filename: path.join(config.reports.logsDir, 'appium_execution.log')
    })
  ]
});

module.exports = logger;

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class ScanPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      fileInput: By.css('input[type="file"]'),
      dropzone: By.css('.file-dropzone, .upload-area'),
      analyzeBtn: By.css('button.analyze-btn, button[type="submit"]'),
      resultCard: By.css('.scan-result-card, .prediction-results')
    };
  }
  async open() { await this.navigateTo('/scan'); }
}

class ScanHistoryPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      searchFilter: By.css('input[placeholder*="Search"]'),
      historyTable: By.css('table.history-table, .scans-list'),
      rows: By.css('tbody tr')
    };
  }
  async open() { await this.navigateTo('/history'); }
}

class MedicalProfilePage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      bloodTypeSelect: By.css('select[name="bloodType"]'),
      allergiesInput: By.css('input[name="allergies"], textarea[name="allergies"]'),
      saveBtn: By.css('button.save-profile-btn')
    };
  }
  async open() { await this.navigateTo('/profile'); }
}

class QRCodePage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      qrCanvas: By.css('canvas, svg.qr-code-svg'),
      downloadBtn: By.css('button.download-qr-btn')
    };
  }
  async open() { await this.navigateTo('/qr-code'); }
}

class EmergencyPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      emergencyBanner: By.css('.emergency-banner'),
      callContactBtn: By.css('a[href^="tel:"]')
    };
  }
  async open(qrToken = 'demo-token-123') { await this.navigateTo(`/emergency/${qrToken}`); }
}

class RiskAnalysisPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      riskGauge: By.css('.risk-gauge-container'),
      metricsChart: By.css('canvas, .recharts-responsive-container')
    };
  }
  async open() { await this.navigateTo('/risk-analysis'); }
}

class SettingsPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      themeToggle: By.css('input[name="darkTheme"]'),
      saveSettingsBtn: By.css('button.save-settings-btn')
    };
  }
  async open() { await this.navigateTo('/settings'); }
}

class AdminPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = {
      userTable: By.css('table.users-table'),
      systemLogs: By.css('.system-logs-container')
    };
  }
  async open() { await this.navigateTo('/admin'); }
}

module.exports = {
  ScanPage,
  ScanHistoryPage,
  MedicalProfilePage,
  QRCodePage,
  EmergencyPage,
  RiskAnalysisPage,
  SettingsPage,
  AdminPage
};

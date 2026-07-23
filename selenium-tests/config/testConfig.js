/**
 * Selenium Automation Framework Configuration
 * Application: PDD-WEB (MedSecure / Plant Disease Detection Web App)
 */

module.exports = {
  baseUrl: process.env.BASE_URL || 'http://localhost:5173',
  apiUrl: process.env.API_URL || 'http://localhost:5000/api',
  browser: process.env.BROWSER || 'chrome',
  headless: process.env.HEADLESS !== 'false', // Default to headless mode for automated execution
  defaultTimeoutMs: 10000,
  pageLoadTimeoutMs: 15000,
  implicitWaitMs: 3000,

  // Test User Accounts for Authentication Scenarios
  testUsers: {
    validPatient: {
      email: 'patient@example.com',
      password: 'Password123!',
      name: 'John Doe',
      role: 'patient'
    },
    validAdmin: {
      email: 'admin@example.com',
      password: 'AdminPassword123!',
      name: 'System Admin',
      role: 'admin'
    },
    invalidUser: {
      email: 'nonexistent@example.com',
      password: 'WrongPassword'
    }
  },

  // Export path for generated Excel report
  reportPath: './Selenium_E2E_Test_Report.xlsx'
};

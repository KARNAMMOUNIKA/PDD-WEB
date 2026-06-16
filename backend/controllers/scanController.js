const User = require('../models/User');
const MedicalProfile = require('../models/MedicalProfile');
const ScanLog = require('../models/ScanLog');
const jwt = require('jsonwebtoken');

// Mock locations for rich demo logs
const responderLocations = [
  'Saint Jude General Hospital - ER Dept',
  'Ambulance Services - Unit 14 (Mobile)',
  'City Metro Transit - Responder Station 4',
  'State Medical Services - Node West',
  'Community Clinic - First Response Unit',
  'Emergency Care Dispatch - Center 2',
];

const getRandomLocation = () => {
  const idx = Math.floor(Math.random() * responderLocations.length);
  return responderLocations[idx];
};

/**
 * @desc    Get limited medical profile for emergency responders via QR token
 * @route   GET /api/profile/emergency/:qrToken
 * @access  Public
 */
const getEmergencyProfile = async (req, res) => {
  try {
    const { qrToken } = req.params;

    // Find user with this token
    const user = await User.findOne({ qrToken });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid or deactivated QR emergency code.' });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'This medical identity has been suspended by the administrator.',
      });
    }

    // Find the profile
    const profile = await MedicalProfile.findOne({ user: user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'No emergency medical details have been configured for this user yet.',
      });
    }

    // Log the scan event for security audit
    const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown Browser';
    let location = getRandomLocation(); // Mocking realistic emergency location
    let scannedBy = null;

    // Check if a registered patient is scanning (passing JWT token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'medsecure_secret_token_38927498237498273948273');
        const scanner = await User.findById(decoded.id);
        if (scanner) {
          scannedBy = scanner._id;
          location = `Patient Scan: ${scanner.name}`;
        }
      } catch (err) {
        console.error('Error verifying scanner token:', err.message);
      }
    }

    await ScanLog.create({
      user: user._id,
      ipAddress: ip,
      userAgent,
      location,
      riskLevelViewed: profile.riskScore,
      scannedBy,
    });

    // Extract ONLY the limited, emergency-safe details
    const emergencyData = {
      name: user.name,
      bloodGroup: profile.bloodGroup,
      allergies: profile.allergies.map(a => ({
        allergen: a.allergen,
        severity: a.severity,
      })),
      chronicDiseases: profile.chronicDiseases.map(d => ({
        disease: d.disease,
        severity: d.severity,
      })),
      currentMedications: profile.currentMedications,
      riskScore: profile.riskScore,
      emergencyContacts: profile.emergencyContacts,
      organDonorStatus: profile.organDonorStatus,
      updatedAt: profile.updatedAt,
    };

    res.status(200).json({
      success: true,
      emergencyData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get scan history for logged-in user
 * @route   GET /api/profile/scans
 * @access  Private
 */
const getMyScanLogs = async (req, res) => {
  try {
    const logs = await ScanLog.find({ user: req.user.id })
      .populate('scannedBy', 'name email phone')
      .sort({ scanTime: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEmergencyProfile,
  getMyScanLogs,
};

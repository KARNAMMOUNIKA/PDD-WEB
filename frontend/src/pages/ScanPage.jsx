import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Camera, Upload, Link2, ShieldAlert, Sparkles, Check, RefreshCw } from 'lucide-react';

const ScanPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('camera'); // 'camera', 'file', 'manual'
  const [scanResult, setScanResult] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Camera scanning states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const qrScannerRef = useRef(null);
  const scannerContainerId = "reader-element-canvas";

  // Manual input state
  const [manualToken, setManualToken] = useState('');

  // Handle scanned QR content
  const processQrResult = (decodedText) => {
    setSuccessMsg('QR Code decoded successfully!');
    setScanResult(decodedText);
    setErrorMsg('');

    // Stop scanner if active
    stopCamera();

    // Parse token from decodedText
    // Standard format: http://localhost:5173/emergency/token or just token
    let token = decodedText.trim();
    if (token.includes('/emergency/')) {
      const parts = token.split('/emergency/');
      token = parts[parts.length - 1];
    }

    setTimeout(() => {
      navigate(`/emergency/${token}`);
    }, 1200);
  };

  // Stop camera stream
  const stopCamera = async () => {
    if (qrScannerRef.current && qrScannerRef.current.isScanning) {
      try {
        await qrScannerRef.current.stop();
        setIsCameraActive(false);
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
  };

  // Start camera stream
  const startCamera = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setCameraLoading(true);

    try {
      // Create scanner instance if not already existing
      if (!qrScannerRef.current) {
        qrScannerRef.current = new Html5Qrcode(scannerContainerId);
      }

      await qrScannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: (width, height) => {
            const size = Math.min(width, height) * 0.7;
            return { width: size, height: size };
          }
        },
        (decodedText) => {
          processQrResult(decodedText);
        },
        (errorMessage) => {
          // Silent callback, avoids flooding log during normal search frames
        }
      );

      setIsCameraActive(true);
    } catch (err) {
      console.error(err);
      setErrorMsg('Camera access denied or device does not have camera capabilities.');
      setIsCameraActive(false);
    } finally {
      setCameraLoading(false);
    }
  };

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        stopCamera();
      }
    };
  }, []);

  // Handle Tab Switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
    setSuccessMsg('');
    setScanResult('');
    stopCamera();
  };

  // Handle File Upload Decode
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      const localScanner = new Html5Qrcode(scannerContainerId);
      const decodedText = await localScanner.scanFile(file, true);
      processQrResult(decodedText);
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not decode QR code from the selected image. Please make sure it is a clear QR image.');
    }
  };

  // Handle Manual Submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualToken.trim()) {
      setErrorMsg('Please input a valid emergency link or token.');
      return;
    }
    processQrResult(manualToken);
  };

  return (
    <div style={styles.page}>
      <Navbar />
      
      <div className="container" style={styles.container}>
        <div style={styles.header}>
          <div style={styles.badgeRow}>
            <span className="badge badge-normal" style={styles.badge}>
              <Sparkles size={12} style={{ marginRight: '4px' }} /> SECURE DECRYPTION PORTAL
            </span>
          </div>
          <h1 className="title-gradient" style={{ fontSize: '2.25rem', fontWeight: '800' }}>Scan Patient Identity</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Scan another patient's QR code to view their critical health details instantly. Your identity will be logged for security audit tracing.
          </p>
        </div>

        <div style={styles.contentGrid}>
          {/* Main Scanner Card */}
          <div className="glass-card" style={styles.scanCard}>
            {/* Custom Premium Tabs */}
            <div style={styles.tabContainer}>
              <button 
                onClick={() => handleTabChange('camera')} 
                style={activeTab === 'camera' ? styles.activeTabBtn : styles.tabBtn}
              >
                <Camera size={16} /> Scan via Camera
              </button>
              <button 
                onClick={() => handleTabChange('file')} 
                style={activeTab === 'file' ? styles.activeTabBtn : styles.tabBtn}
              >
                <Upload size={16} /> Upload Image
              </button>
              <button 
                onClick={() => handleTabChange('manual')} 
                style={activeTab === 'manual' ? styles.activeTabBtn : styles.tabBtn}
              >
                <Link2 size={16} /> Scan Simulator
              </button>
            </div>

            {/* Error/Success Feedbacks */}
            {errorMsg && (
              <div style={styles.errorAlert}>
                <ShieldAlert size={18} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div style={styles.successAlert}>
                <Check size={18} style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Render Tab Contents */}
            <div style={styles.tabContentArea}>
              
              {/* CAMERA TAB */}
              {activeTab === 'camera' && (
                <div style={styles.cameraPane}>
                  <div 
                    id={scannerContainerId} 
                    style={{
                      ...styles.readerElement,
                      border: isCameraActive ? '2px solid #0ea5e9' : '1px dashed rgba(255,255,255,0.1)'
                    }}
                  >
                    {!isCameraActive && !cameraLoading && (
                      <div style={styles.cameraPlaceholder}>
                        <Camera size={48} color="rgba(255,255,255,0.2)" style={{ marginBottom: '1rem' }} />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          Camera is currently offline
                        </span>
                      </div>
                    )}
                    {cameraLoading && (
                      <div style={styles.cameraPlaceholder}>
                        <RefreshCw size={40} className="animate-spin" color="#0ea5e9" style={{ marginBottom: '1rem' }} />
                        <span style={{ color: '#0ea5e9', fontWeight: '600' }}>
                          Initializing Camera Feed...
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={styles.cameraControls}>
                    {isCameraActive ? (
                      <button onClick={stopCamera} className="btn btn-secondary" style={styles.ctrlBtn}>
                        Stop Camera Stream
                      </button>
                    ) : (
                      <button onClick={startCamera} className="btn btn-primary" style={styles.ctrlBtn} disabled={cameraLoading}>
                        Initialize Camera Scanner
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* FILE UPLOAD TAB */}
              {activeTab === 'file' && (
                <div style={styles.filePane}>
                  <div style={styles.dropZone}>
                    <Upload size={40} color="#0ea5e9" style={{ marginBottom: '1rem' }} />
                    <h4 style={{ color: '#fff', marginBottom: '0.25rem' }}>Select QR Image</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1.5rem', textAlign: 'center', padding: '0 1.5rem' }}>
                      Upload a PNG or JPG screenshot containing the patient's MedSecure QR code.
                    </p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      style={styles.fileInput} 
                      id="qr-image-uploader"
                    />
                    <label htmlFor="qr-image-uploader" className="btn btn-secondary" style={{ padding: '0.55rem 1.5rem', cursor: 'pointer' }}>
                      Choose File
                    </label>
                  </div>
                </div>
              )}

              {/* MANUAL SIMULATOR TAB */}
              {activeTab === 'manual' && (
                <form onSubmit={handleManualSubmit} style={styles.manualPane}>
                  <div style={styles.formGroup}>
                    <label style={styles.inputLabel}>Emergency QR URL or Token</label>
                    <input 
                      type="text" 
                      value={manualToken}
                      onChange={(e) => setManualToken(e.target.value)}
                      placeholder="e.g. 5e9b882ac3f381c810c9c27b or http://localhost:5173/emergency/..."
                      style={styles.textInput}
                    />
                    <span style={styles.inputHelp}>
                      You can copy the Token or Emergency link from the user's dashboard and paste it here for fast verification.
                    </span>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                    Simulate Secure Scan Decryption
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Hidden element needed for file reading instantiation */}
      <div id="hidden-reader" style={{ display: 'none' }}></div>

      <Footer />
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '#0a0f1d',
  },
  container: {
    padding: '3rem 2rem',
    maxWidth: '800px',
  },
  header: {
    marginBottom: '2.5rem',
  },
  badgeRow: {
    marginBottom: '0.75rem',
  },
  badge: {
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '0.35rem 0.85rem',
    background: 'rgba(14, 165, 233, 0.1)',
    color: '#0ea5e9',
    borderRadius: '9999px',
    border: '1px solid rgba(14, 165, 233, 0.2)',
  },
  contentGrid: {
    display: 'flex',
    justifyContent: 'center',
  },
  scanCard: {
    width: '100%',
    padding: '2.5rem 2rem',
    background: 'linear-gradient(135deg, #111827 0%, #0c111c 100%)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
    borderRadius: '16px',
  },
  tabContainer: {
    display: 'flex',
    background: 'rgba(0, 0, 0, 0.25)',
    padding: '0.25rem',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.05)',
    marginBottom: '1.5rem',
    gap: '0.25rem',
  },
  tabBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    padding: '0.75rem 0.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'var(--transition-smooth)',
  },
  activeTabBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: '#0ea5e9',
    border: 'none',
    color: '#fff',
    padding: '0.75rem 0.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
    transition: 'var(--transition-smooth)',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    color: '#ef4444',
    padding: '0.85rem 1.25rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
  },
  successAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    color: '#10b981',
    padding: '0.85rem 1.25rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
  },
  tabContentArea: {
    minHeight: '260px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cameraPane: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },
  readerElement: {
    width: '100%',
    maxWidth: '320px',
    height: '240px',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  cameraControls: {
    width: '100%',
    maxWidth: '320px',
  },
  ctrlBtn: {
    width: '100%',
    padding: '0.8rem',
  },
  filePane: {
    display: 'flex',
    justifyContent: 'center',
  },
  dropZone: {
    width: '100%',
    border: '2px dashed rgba(14, 165, 233, 0.3)',
    borderRadius: '12px',
    padding: '2.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.2)',
    transition: 'var(--transition-smooth)',
  },
  fileInput: {
    display: 'none',
  },
  manualPane: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  inputLabel: {
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  textInput: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '0.85rem 1rem',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'var(--transition-smooth)',
  },
  inputHelp: {
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    lineHeight: '1.4',
  },
};

// Injected dynamic style logic for animation spin support
if (!document.getElementById('spin-anim-style')) {
  const spinStyle = document.createElement('style');
  spinStyle.id = 'spin-anim-style';
  spinStyle.innerHTML = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `;
  document.head.appendChild(spinStyle);
}

export default ScanPage;

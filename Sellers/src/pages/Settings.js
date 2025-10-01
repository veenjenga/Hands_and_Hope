import React, { useState } from 'react';
import styles from './Settings.module.css';

function Settings({ highContrastMode, fontSize, setFontSize, isVoiceNavigationEnabled, setIsVoiceNavigationEnabled, voiceFeedback, setVoiceFeedback }) {
  const [navigationMode, setNavigationMode] = useState('Screen'); // Default to Screen mode
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    businessName: 'JD Electronics',
    email: 'john.doe@example.com',
    phoneNumber: '+1 (555) 123-4567',
  });

  const increaseFontSize = () => {
    if (fontSize < 24) setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 14) setFontSize(fontSize - 2);
  };

  const toggleHighContrast = () => {
    // This should be handled in App.js, but kept here for reference
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const saveSettings = () => {
    // Simulate saving profile settings (e.g., to local storage or backend)
    localStorage.setItem('profileSettings', JSON.stringify(profile));
    if (voiceFeedback) {
      const utterance = new SpeechSynthesisUtterance('Settings saved successfully');
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <main className={`${styles.main} ${highContrastMode ? styles.highContrast : ''}`}>
      <div className={styles.container}>
        <h1 className={styles.title}>Settings</h1>

        {/* Profile Settings */}
        <section className={`${styles.section} ${highContrastMode ? styles.sectionHighContrast : ''}`}>
          <h2 className={styles.sectionTitle}>Profile Settings</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleProfileChange}
              className={`${styles.input} ${highContrastMode ? styles.inputHighContrast : ''}`}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Business Name</label>
            <input
              type="text"
              name="businessName"
              value={profile.businessName}
              onChange={handleProfileChange}
              className={`${styles.input} ${highContrastMode ? styles.inputHighContrast : ''}`}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              className={`${styles.input} ${highContrastMode ? styles.inputHighContrast : ''}`}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleProfileChange}
              className={`${styles.input} ${highContrastMode ? styles.inputHighContrast : ''}`}
            />
          </div>
        </section>

        {/* Accessibility Settings */}
        <section className={`${styles.section} ${highContrastMode ? styles.sectionHighContrast : ''}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Accessibility Preferences</h2>
            <div className={`${styles.badge} ${highContrastMode ? styles.badgeHighContrast : ''}`}>
              Personalized
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Navigation Mode</label>
            <div className={styles.buttonGroup}>
              <button
                className={`${styles.navButton} ${navigationMode === 'Screen' ? (highContrastMode ? styles.navButtonActiveHighContrast : styles.navButtonActive) : ''}`}
                onClick={() => {
                  setNavigationMode('Screen');
                  setIsVoiceNavigationEnabled(false);
                }}
              >
                <i className="fa fa-mouse-pointer mr-2"></i>Screen
              </button>
              <button
                className={`${styles.navButton} ${navigationMode === 'Voice' ? (highContrastMode ? styles.navButtonActiveHighContrast : styles.navButtonActive) : ''}`}
                onClick={() => {
                  setNavigationMode('Voice');
                  setIsVoiceNavigationEnabled(true);
                }}
              >
                <i className="fa fa-microphone mr-2"></i>Voice
              </button>
              <button
                className={`${styles.navButton} ${navigationMode === 'Hybrid' ? (highContrastMode ? styles.navButtonActiveHighContrast : styles.navButtonActive) : ''}`}
                onClick={() => {
                  setNavigationMode('Hybrid');
                  setIsVoiceNavigationEnabled(true);
                }}
              >
                <i className="fa fa-random mr-2"></i>Hybrid
              </button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Font Size</label>
            <div className={styles.fontSizeControl}>
              <button onClick={decreaseFontSize} className={styles.controlButton}>
                <i className="fa fa-minus"></i>
              </button>
              <span className={styles.fontSizeValue}>{fontSize}px</span>
              <button onClick={increaseFontSize} className={styles.controlButton}>
                <i className="fa fa-plus"></i>
              </button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Display Mode</label>
            <button
              onClick={toggleHighContrast}
              className={`${styles.modeButton} ${highContrastMode ? styles.modeButtonHighContrast : ''}`}
            >
              <i className="fa fa-adjust mr-2"></i>
              {highContrastMode ? 'High Contrast Mode' : 'Normal Mode'}
            </button>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Voice Feedback</label>
            <label className={styles.toggleContainer}>
              <input
                type="checkbox"
                id="voiceFeedbackToggle"
                className={styles.toggleInput}
                checked={voiceFeedback}
                onChange={(e) => {
                  setVoiceFeedback(e.target.checked);
                  if (e.target.checked) {
                    const utterance = new SpeechSynthesisUtterance('Voice feedback enabled');
                    window.speechSynthesis.speak(utterance);
                  }
                }}
              />
              <span className={styles.toggleSlider}></span>
              <span className={styles.toggleLabel}>Enable voice feedback</span>
            </label>
          </div>
        </section>

        {/* Notification Settings */}
        <section className={`${styles.section} ${highContrastMode ? styles.sectionHighContrast : ''}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Notification Settings</h2>
            <div className={`${styles.badge} ${highContrastMode ? styles.badgeHighContrast : ''} ${styles.badgeActive}`}>
              Active
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.notificationItem}>
              <div>
                <h3 className={styles.notificationTitle}>Email Notifications</h3>
                <p className={`${styles.notificationDescription} ${highContrastMode ? styles.notificationDescriptionHighContrast : ''}`}>
                  Receive updates about your account via email
                </p>
              </div>
              <label className={styles.toggleContainer}>
                <input type="checkbox" className={styles.toggleInput} defaultChecked />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
            <div className={styles.notificationItem}>
              <div>
                <h3 className={styles.notificationTitle}>Audio Alerts</h3>
                <p className={`${styles.notificationDescription} ${highContrastMode ? styles.notificationDescriptionHighContrast : ''}`}>
                  Play sound when receiving new messages
                </p>
              </div>
              <label className={styles.toggleContainer}>
                <input type="checkbox" className={styles.toggleInput} />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          </div>
        </section>

        {/* Account Settings */}
        <section className={`${styles.section} ${highContrastMode ? styles.sectionHighContrast : ''}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Account Settings</h2>
            <div className={`${styles.badge} ${highContrastMode ? styles.badgeHighContrast : ''} ${styles.badgeCaution}`}>
              Caution
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={`${styles.warningCard} ${highContrastMode ? styles.warningCardHighContrast : ''}`}>
              <div className={styles.warningContent}>
                <i className={`fa fa-exclamation-triangle ${highContrastMode ? 'text-yellow-400' : 'text-yellow-600'} mt-1`}></i>
                <div className={styles.warningText}>
                  <h3 className={`${styles.warningTitle} ${highContrastMode ? styles.warningTitleHighContrast : ''}`}>
                    Account Deactivation
                  </h3>
                  <p className={`${styles.warningDescription} ${highContrastMode ? styles.warningDescriptionHighContrast : ''}`}>
                    Temporarily disable your account. You can reactivate it anytime.
                  </p>
                </div>
              </div>
              <button className={`${styles.warningButton} ${highContrastMode ? styles.warningButtonHighContrast : ''}`}>
                Deactivate Account
              </button>
            </div>
            <div className={`${styles.dangerCard} ${highContrastMode ? styles.dangerCardHighContrast : ''}`}>
              <div className={styles.warningContent}>
                <i className={`fa fa-trash-alt ${highContrastMode ? 'text-red-400' : 'text-red-600'} mt-1`}></i>
                <div className={styles.warningText}>
                  <h3 className={`${styles.warningTitle} ${highContrastMode ? styles.warningTitleHighContrast : ''}`}>
                    Delete Account
                  </h3>
                  <p className={`${styles.warningDescription} ${highContrastMode ? styles.warningDescriptionHighContrast : ''}`}>
                    Permanently remove your account and all data. This action cannot be undone.
                  </p>
                </div>
              </div>
              <button className={`${styles.dangerButton} ${highContrastMode ? styles.dangerButtonHighContrast : ''}`}>
                Delete Account
              </button>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className={styles.saveButtonContainer}>
          <button onClick={saveSettings} className={styles.saveButton}>
            <i className="fa fa-save mr-2"></i>Save Changes
          </button>
        </div>
      </div>
    </main>
  );
}

export default Settings;
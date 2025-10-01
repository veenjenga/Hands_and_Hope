import React from 'react';
import styles from './Settings.module.css';

function Settings({
  highContrastMode,
  fontSize,
  setFontSize,
  isVoiceNavigationEnabled,
  setIsVoiceNavigationEnabled,
  voiceFeedback,
  setVoiceFeedback,
}) {
  return (
    <main
      className={`${styles.main} ${highContrastMode ? styles.highContrast : ''}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      <div className={styles.container}>
        <h1 className={styles.title}>Settings</h1>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Accessibility Preferences</h2>
          <div className={styles.option}>
            <label className={styles.label}>
              Font Size: {fontSize.toFixed(0)}px
            </label>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
          <div className={styles.option}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={isVoiceNavigationEnabled}
                onChange={() => setIsVoiceNavigationEnabled(!isVoiceNavigationEnabled)}
              />
              Enable Voice Navigation
            </label>
          </div>
          <div className={styles.option}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={voiceFeedback}
                onChange={() => setVoiceFeedback(!voiceFeedback)}
              />
              Voice Feedback on Actions
            </label>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Settings;
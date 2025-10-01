import React from 'react';
import styles from './AccessibilityPanel.module.css';

function AccessibilityPanel({
  highContrastMode,
  toggleHighContrastMode,
  fontSize,
  increaseFontSize,
  decreaseFontSize,
  isVoiceNavigationEnabled,
  toggleVoiceNavigation,
  resetAccessibilitySettings,
  isOpen,
  setIsOpen
}) {
  return (
    <div
      className={`${styles.accessibilityPanel} ${
        highContrastMode ? styles.highContrast : ''
      } ${isOpen ? styles.open : ''}`}
    >
      <div className={styles.panelHeader}>
        <h2>Accessibility Settings</h2>
        <button
          onClick={() => setIsOpen(false)}
          className={styles.closeButton}
          aria-label="Close accessibility panel"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className={styles.panelContent}>
        <div className={styles.option}>
          <label htmlFor="highContrast">High Contrast Mode</label>
          <input
            id="highContrast"
            type="checkbox"
            checked={highContrastMode}
            onChange={toggleHighContrastMode}
          />
        </div>
        <div className={styles.option}>
          <label>Font Size: {fontSize}px</label>
          <div className={styles.fontSizeControls}>
            <button
              onClick={decreaseFontSize}
              disabled={fontSize <= 14}
              aria-label="Decrease font size"
            >
              <i className="fas fa-minus"></i>
            </button>
            <button
              onClick={increaseFontSize}
              disabled={fontSize >= 24}
              aria-label="Increase font size"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
        <div className={styles.option}>
          <label htmlFor="voiceNavigation">Voice Navigation</label>
          <input
            id="voiceNavigation"
            type="checkbox"
            checked={isVoiceNavigationEnabled}
            onChange={toggleVoiceNavigation}
          />
        </div>
        <button
          onClick={resetAccessibilitySettings}
          className={styles.resetButton}
        >
          Reset Settings
        </button>
      </div>
    </div>
  );
}

export default AccessibilityPanel;
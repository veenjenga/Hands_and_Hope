// src/components/AccessibilityPanel.js
import React from 'react';
import styles from '../App.module.css';

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
    <div className={`${styles.accessibilityPanel} ${highContrastMode ? styles.accessibilityPanelHighContrast : ''}`}>
      {/* Wheelchair Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.wheelchairButton}
        aria-label="Toggle accessibility panel"
      >
        <i className="fa fa-wheelchair"></i>
      </button>

      {/* Accessibility Options Panel */}
      {isOpen && (
        <div className={styles.accessibilityOptions}>
          {/* High Contrast Toggle */}
          <div className={styles.optionRow}>
            <span className={styles.optionLabel}>High Contrast</span>
            <button
              onClick={toggleHighContrastMode}
              className={`${styles.toggleSwitch} ${highContrastMode ? styles.toggleSwitchActive : ''}`}
              aria-label="Toggle high contrast mode"
            >
              <span className={styles.toggleKnob}></span>
            </button>
          </div>

          {/* Font Size Controls */}
          <div className={styles.optionRow}>
            <span className={styles.optionLabel}>Font Size</span>
            <div className={styles.fontSizeControls}>
              <button
                onClick={decreaseFontSize}
                className={styles.optionButton}
                aria-label="Decrease font size"
                disabled={fontSize <= 0.8}
              >
                <i className="fa fa-minus"></i>
              </button>
              <span className={styles.fontSizeValue}>{(fontSize * 16).toFixed(0)}px</span>
              <button
                onClick={increaseFontSize}
                className={styles.optionButton}
                aria-label="Increase font size"
                disabled={fontSize >= 1.5}
              >
                <i className="fa fa-plus"></i>
              </button>
            </div>
          </div>

          {/* Voice Navigation Toggle */}
          <div className={styles.optionRow}>
            <span className={styles.optionLabel}>Voice Navigation</span>
            <button
              onClick={toggleVoiceNavigation}
              className={`${styles.toggleSwitch} ${isVoiceNavigationEnabled ? styles.toggleSwitchActive : ''}`}
              aria-label="Toggle voice navigation"
            >
              <span className={styles.toggleKnob}></span>
            </button>
          </div>

          {/* Reset Button */}
          <div className={styles.optionRow}>
            <button
              onClick={resetAccessibilitySettings}
              className={styles.resetButton}
              aria-label="Reset accessibility settings"
            >
              <i className="fa fa-undo"></i>
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccessibilityPanel;
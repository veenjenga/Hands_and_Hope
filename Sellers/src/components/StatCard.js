// src/components/StatCard.js
import React from 'react';
import styles from './StatCard.module.css';

function StatCard({ title, value, icon, color, highContrastMode }) {
  const headerColorClass =
    color === 'blue'
      ? styles.statHeaderBlue
      : color === 'yellow'
      ? styles.statHeaderYellow
      : styles.statHeaderGreen;

  const iconColorClass =
    color === 'blue'
      ? styles.statIconBlue
      : color === 'yellow'
      ? styles.statIconYellow
      : styles.statIconGreen;

  return (
    <div
      className={`${styles.statCard} ${
        highContrastMode ? styles.statCardHighContrast : ''
      }`}
    >
      <div
        className={`${styles.statHeader} ${headerColorClass} ${
          highContrastMode ? styles.statHeaderHighContrast : ''
        }`}
      >
        <h3 className={styles.statTitle}>{title}</h3>
      </div>
      <div className={styles.statContent}>
        <span className={styles.statValue}>{value}</span>
        <i
          className={`fa fa-${icon} ${styles.statIcon} ${
            highContrastMode ? styles.statIconHighContrast : iconColorClass
          }`}
        ></i>
      </div>
    </div>
  );
}

export default StatCard;
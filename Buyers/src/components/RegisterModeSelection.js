import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterModeSelection.module.css';

function RegisterModeSelection({ onModeSelect }) {
  const navigate = useNavigate();

  const handleModeSelect = (mode) => {
    onModeSelect(mode);
    navigate('/register-form');
  };

  return (
    <div className={styles.modeSelectionContainer}>
      <h2 className={styles.title}>Choose Your Communication Mode</h2>
      <p className={styles.description}>
        Select how you'd like to interact with the registration form.
      </p>
      <div className={styles.options}>
        <button
          className={styles.modeButton}
          onClick={() => handleModeSelect('voice')}
        >
          <i className="fas fa-microphone mr-2"></i>
          Voice Navigation
        </button>
        <button
          className={styles.modeButton}
          onClick={() => handleModeSelect('text')}
        >
          <i className="fas fa-text-height mr-2"></i>
          Text Enhancements
        </button>
        <button
          className={styles.modeButton}
          onClick={() => handleModeSelect('hybrid')}
        >
          <i className="fas fa-assistive-listening-systems mr-2"></i>
          Hybrid Mode
        </button>
      </div>
    </div>
  );
}

export default RegisterModeSelection;
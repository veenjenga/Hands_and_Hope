import React, { useState } from 'react';
import styles from './Register.module.css';

function Register({ onRegister, selectedMode }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    phoneNumber: ''
  });
  const [fontSize, setFontSize] = useState(16);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');

  // Determine if voice or text features should be active based on mode
  const isVoiceEnabled = selectedMode === 'voice' || selectedMode === 'hybrid';
  const isTextEnhanced = selectedMode === 'text' || selectedMode === 'hybrid';

  // Voice recognition setup
  React.useEffect(() => {
    if (!isVoiceEnabled) return;

    const handleVoiceInput = (command) => {
      if (command.includes('email')) {
        const email = command.split('email ')[1] || '';
        setFormData((prev) => ({ ...prev, email }));
      } else if (command.includes('password')) {
        const password = command.split('password ')[1] || '';
        setFormData((prev) => ({ ...prev, password }));
      } else if (command.includes('business name')) {
        const businessName = command.split('business name ')[1] || '';
        setFormData((prev) => ({ ...prev, businessName }));
      } else if (command.includes('phone number')) {
        const phoneNumber = command.split('phone number ')[1] || '';
        setFormData((prev) => ({ ...prev, phoneNumber }));
      } else if (command.includes('submit')) {
        handleSubmit();
      }
    };

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      setVoiceCommand(command);
      handleVoiceInput(command);
    };

    recognition.onend = () => {
      if (isVoiceActive) {
        recognition.start();
      }
    };

    if (isVoiceActive) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVoiceActive, isVoiceEnabled]);



  const toggleVoice = () => {
    setIsVoiceActive(!isVoiceActive);
  };

  const increaseFontSize = () => {
    if (fontSize < 24) setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 14) setFontSize(fontSize - 2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onRegister(formData);
  };

  return (
    <div className={styles.registerContainer}>
      <h2 className={styles.title}>Register as Seller</h2>
      {isVoiceEnabled && (
        <div className={styles.voiceControl}>
          <button
            onClick={toggleVoice}
            className={`${styles.voiceButton} ${isVoiceActive ? styles.voiceActive : ''}`}
          >
            <i className="fas fa-microphone mr-2"></i>
            {isVoiceActive ? 'Disable Voice' : 'Enable Voice'}
          </button>
          {voiceCommand && (
            <p className={styles.voiceFeedback}>Heard: "{voiceCommand}"</p>
          )}
        </div>
      )}
      {isTextEnhanced && (
        <div className={styles.textControls}>
          <button onClick={increaseFontSize} className={styles.controlButton}>
            <i className="fas fa-plus mr-2"></i>Increase Text Size
          </button>
          <button onClick={decreaseFontSize} className={styles.controlButton}>
            <i className="fas fa-minus mr-2"></i>Decrease Text Size
          </button>
          <p>Current Font Size: {fontSize}px</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form} style={{ fontSize: `${fontSize}px` }}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="businessName">Business Name</label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
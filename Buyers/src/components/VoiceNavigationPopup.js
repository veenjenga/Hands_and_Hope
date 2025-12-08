import React, { useEffect, useState } from 'react';
import styles from './VoiceNavigationPopup.module.css';

function VoiceNavigationPopup({ onClose, onEnableVoice, onDisableVoice, userType }) {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); // Prevent multiple processing

  useEffect(() => {
    // Check if speech recognition is supported
    const isSpeechRecognitionSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    if (!isSpeechRecognitionSupported) {
      console.warn('Speech recognition is not supported in this browser.');
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      // Prevent processing if already processing
      if (isProcessing) return;
      
      setIsProcessing(true);
      
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      setRecognizedText(transcript);
      
      // Check for affirmative responses
      if (transcript.toLowerCase().includes('yes') || transcript.toLowerCase().includes('yeah') || transcript.toLowerCase().includes('okay')) {
        handleEnableVoice();
      } 
      // Check for negative responses
      else if (transcript.toLowerCase().includes('no') || transcript.toLowerCase().includes('nope')) {
        handleDisableVoice();
      }
      
      // Reset processing flag after a delay
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      setIsProcessing(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsProcessing(false);
    };

    // Start listening when popup opens
    const timer = setTimeout(() => {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      recognition.stop();
    };
  }, [onEnableVoice, onDisableVoice, isProcessing]);

  const handleEnableVoice = () => {
    onEnableVoice();
    onClose();
  };

  const handleDisableVoice = () => {
    onDisableVoice();
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2 className={styles.title}>
          {userType === 'new' ? 'Welcome to Hands and Hope!' : 'Voice Navigation'}
        </h2>
        
        <p className={styles.message}>
          {userType === 'new' 
            ? 'Would you like to enable voice navigation to help you navigate the platform?' 
            : 'Would you like to continue with voice navigation enabled?'}
        </p>
        
        {isListening && (
          <div className={styles.listeningIndicator}>
            <div className={styles.pulse}></div>
            <p className={styles.listeningText}>
              Listening... 
              {recognizedText && (
                <span className={styles.recognizedText}> "{recognizedText}"</span>
              )}
            </p>
          </div>
        )}
        
        <div className={styles.buttonGroup}>
          <button 
            className={`${styles.button} ${styles.yesButton}`}
            onClick={handleEnableVoice}
          >
            Yes
          </button>
          <button 
            className={`${styles.button} ${styles.noButton}`}
            onClick={handleDisableVoice}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoiceNavigationPopup;
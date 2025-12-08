import React, { useState, useEffect, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Signup.module.css';

function Signup({ onAutoLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [isVoiceAssistantActive, setIsVoiceAssistantActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [isSystemSpeaking, setIsSystemSpeaking] = useState(false);
  const [shouldProceed, setShouldProceed] = useState(false);
  const recognitionRef = useRef(null);
  const history = useHistory();

  // Field navigation order
  const fieldOrder = ['name', 'email', 'businessName', 'phone', 'password', 'confirmPassword'];
  const fieldLabels = {
    name: "What's your beautiful name?",
    email: "What's your email address?",
    businessName: "What's the name of your business?",
    phone: "What's your phone number?",
    password: "Please set a password for your account",
    confirmPassword: "Please confirm your password"
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      
      if (response.data.token) {
        // Auto-login after successful signup
        onAutoLogin(response.data.token, response.data.user);
        
        // Show welcome message and start voice navigation tour
        setShowWelcomeMessage(true);
        
        // Start the voice navigation tour after a short delay
        setTimeout(() => {
          // Dispatch event to start the welcome tour
          window.dispatchEvent(new CustomEvent('startWelcomeTour'));
        }, 2000);
        
        // Redirect to dashboard after welcome message
        setTimeout(() => {
          history.push('/');
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ general: error.response.data.error || 'Registration failed' });
      } else {
        setErrors({ general: 'Network error. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to handle welcome message announcement
  useEffect(() => {
    if (showWelcomeMessage) {
      announceWithElevenLabs('Registration successful! Welcome to Hand and Hope.');
    }
  }, [showWelcomeMessage]);

  // Function to announce with Eleven Labs
  const announceWithElevenLabs = async (message) => {
    setIsSystemSpeaking(true);
    
    try {
      // Use Eleven Labs API for high-quality speech synthesis
      const apiKey = process.env.REACT_APP_ELEVEN_LABS_API_KEY || 'sk_20734ae2903209818628e37d95e46a5c6f59a503a17d1eb3';
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: message,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        // Play the Eleven Labs audio
        audio.play();
        
        // Reset the speaking flag when audio finishes
        audio.onended = () => {
          setIsSystemSpeaking(false);
          
          // If we're asking for final confirmation, listen for response
          if (message.includes("good") && message.includes("signing")) {
            setShouldProceed(true);
          }
        };
      } else {
        console.error('Eleven Labs API error:', response.status);
        setIsSystemSpeaking(false);
      }
    } catch (error) {
      console.error('Eleven Labs API error:', error);
      setIsSystemSpeaking(false);
    }
  };

  // Voice assistant functionality
  const startVoiceAssistant = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false; // Only final results
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
      setIsVoiceAssistantActive(true);
      setCurrentField('name');
      
      // Announce the first question with Eleven Labs
      setTimeout(() => {
        announceWithElevenLabs(fieldLabels.name);
      }, 500);
    };
    
    recognition.onresult = (event) => {
      // Skip processing if system is speaking
      if (isSystemSpeaking) return;
      
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      setVoiceTranscript(transcript);
      
      // If we're waiting for confirmation to proceed, handle it
      if (shouldProceed) {
        handleFinalConfirmation(transcript);
      } else {
        processVoiceResponse(transcript);
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      setIsVoiceAssistantActive(false);
      setIsSystemSpeaking(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
      // Restart if still active and not speaking
      if (isVoiceAssistantActive && !isSystemSpeaking) {
        try {
          recognition.start();
        } catch (error) {
          console.warn('Could not restart recognition:', error);
        }
      }
    };
    
    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  const stopVoiceAssistant = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setIsVoiceAssistantActive(false);
      setVoiceTranscript('');
      setCurrentField('');
      setIsSystemSpeaking(false);
      setShouldProceed(false);
    }
  };

  const processVoiceResponse = (transcript) => {
    if (!transcript.trim() || isSystemSpeaking) return;
    
    // Update form data based on current field
    const newData = { ...formData };
    
    switch (currentField) {
      case 'name':
        newData.name = transcript.trim();
        break;
      case 'email':
        // Extract email from transcript
        const emailMatch = transcript.match(/([\w.-]+@[\w.-]+\.\w+)/);
        if (emailMatch) {
          newData.email = emailMatch[1];
        } else {
          newData.email = transcript.trim();
        }
        break;
      case 'businessName':
        newData.businessName = transcript.trim();
        break;
      case 'phone':
        // Extract numbers only
        const phoneNumbers = transcript.replace(/\D/g, '');
        if (phoneNumbers.length >= 10) {
          newData.phone = phoneNumbers;
        } else {
          newData.phone = transcript.trim();
        }
        break;
      case 'password':
        newData.password = transcript.trim();
        break;
      case 'confirmPassword':
        newData.confirmPassword = transcript.trim();
        break;
      default:
        break;
    }
    
    setFormData(newData);
    
    // Move to next field or stop
    const currentIndex = fieldOrder.indexOf(currentField);
    if (currentIndex < fieldOrder.length - 1) {
      const nextField = fieldOrder[currentIndex + 1];
      setCurrentField(nextField);
      
      // Focus the next input field
      setTimeout(() => {
        const nextInput = document.getElementById(nextField);
        if (nextInput) {
          nextInput.focus();
        }
      }, 500);
      
      // Announce next question after a short delay
      setTimeout(() => {
        announceWithElevenLabs(fieldLabels[nextField]);
      }, 1500);
    } else {
      // All fields filled, ask for final confirmation
      setTimeout(() => {
        announceWithElevenLabs("I've filled in all your information. Is this good? Should we proceed to signing you up?");
      }, 1000);
    }
  };

  const handleFinalConfirmation = (transcript) => {
    const lowerTranscript = transcript.toLowerCase();
    
    if (lowerTranscript.includes('yes') || lowerTranscript.includes('proceed') || 
        lowerTranscript.includes('sign') || lowerTranscript.includes('good')) {
      // Submit the form automatically
      setTimeout(() => {
        announceWithElevenLabs("Great! Signing you up now.");
        // Create a synthetic submit event
        const form = document.querySelector('form');
        if (form) {
          const event = new Event('submit', { cancelable: true, bubbles: true });
          form.dispatchEvent(event);
        }
      }, 1000);
    } else if (lowerTranscript.includes('no') || lowerTranscript.includes('cancel') || 
               lowerTranscript.includes('stop')) {
      stopVoiceAssistant();
      announceWithElevenLabs("Okay, I've stopped the voice assistant. You can review your information and submit manually.");
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupForm}>
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Join Hand and Hope to start selling your products</p>
        
        {errors.general && <div className={styles.errorMessage}>{errors.general}</div>}
        
        {showWelcomeMessage ? (
          <div className={styles.welcomeMessage}>
            <h3>Welcome to Hand and Hope!</h3>
            <p>Registration successful. Starting your voice-guided tour...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                required
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                required
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="businessName">Business Name</label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className={`${styles.input} ${errors.businessName ? styles.inputError : ''}`}
                required
              />
              {errors.businessName && <span className={styles.errorText}>{errors.businessName}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                placeholder="e.g., 1234567890"
                required
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                required
              />
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                required
              />
              {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
            </div>
            
            {/* Voice Assistant Section */}
            <div className={styles.voiceAssistantSection}>
              <button
                type="button"
                className={styles.voiceButton}
                onClick={isVoiceAssistantActive ? stopVoiceAssistant : startVoiceAssistant}
              >
                {isVoiceAssistantActive ? '⏹️ Stop Hands-Free Signup' : '🎤 Hands-Free Signup'}
              </button>
              
              {isListening && (
                <div className={styles.listeningIndicator}>
                  <div className={styles.pulse}></div>
                  <p>{fieldLabels[currentField] || "Listening..."}</p>
                </div>
              )}
              
              {voiceTranscript && (
                <div className={styles.transcript}>
                  <p><strong>You said:</strong> "{voiceTranscript}"</p>
                </div>
              )}
              
              {isVoiceAssistantActive && (
                <p className={styles.voiceHint}>
                  Please answer the question above. I'll automatically move to the next field after you respond.
                </p>
              )}
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        )}
        
        <p className={styles.loginLink}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import VoiceNavigationPopup from '../components/VoiceNavigationPopup';
import { API_ENDPOINTS } from '../config/api'; // Import API configuration
import styles from './Login.module.css';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showVoicePopup, setShowVoicePopup] = useState(false);
  const [userVoicePreference, setUserVoicePreference] = useState(null);
  const [isPlayingFeedback, setIsPlayingFeedback] = useState(false); // Prevent overlapping feedback
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if redirected from signup
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
      setSuccess('Registration successful! Please log in with your credentials.');
      // Remove the query parameter from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Check user's last voice navigation preference
    const storedVoicePref = localStorage.getItem('voiceNavigationPreference');
    if (storedVoicePref) {
      setUserVoicePreference(storedVoicePref === 'enabled');
    }
  }, [history]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (res.ok && data.token) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        // Show success message
        setSuccess("Login successful! Redirecting to dashboard...");
        // Call the login function passed from App.js
        onLogin(data.token, data.user);
        
        // Check if we need to show voice navigation popup
        const storedVoicePref = localStorage.getItem('voiceNavigationPreference');
        if (storedVoicePref === 'enabled') {
          // Notify user that voice navigation is on
          setTimeout(() => {
            playVoiceNotification("Voice navigation is enabled. You can say 'turn off voice navigation' to disable it.");
          }, 1000);
          // Add a small delay before redirecting
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } else if (storedVoicePref === 'disabled') {
          // Add a small delay before redirecting
          setTimeout(() => {
            navigate("/");
          }, 1500);
        } else {
          // No preference set, show popup
          setTimeout(() => {
            setShowVoicePopup(true);
          }, 1500);
        }
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch (err) {
      setError("Failed to connect to server");
    }
  };

  const playVoiceNotification = async (message) => {
    // Prevent overlapping feedback
    if (isPlayingFeedback) return;
    
    setIsPlayingFeedback(true);
    
    try {
      // Use Eleven Labs API for high-quality speech synthesis
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': 'sk_20734ae2903209818628e37d95e46a5c6f59a503a17d1eb3',
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
        
        // Reset the playing flag when audio finishes
        audio.onended = () => {
          setIsPlayingFeedback(false);
        };
      } else {
        // Fallback to browser speech synthesis if Eleven Labs fails
        fallbackToBrowserSpeech(message);
      }
    } catch (error) {
      console.error('Eleven Labs API error:', error);
      // Fallback to browser speech synthesis if Eleven Labs fails
      fallbackToBrowserSpeech(message);
    }
  };

  const fallbackToBrowserSpeech = (text) => {
    // Cancel any ongoing speech synthesis to prevent overlap
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Reset the playing flag when speech ends
      utterance.onend = () => {
        setIsPlayingFeedback(false);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      // Reset the playing flag if no speech synthesis available
      setIsPlayingFeedback(false);
    }
  };

  const handleEnableVoice = () => {
    // Save preference to localStorage
    localStorage.setItem('voiceNavigationPreference', 'enabled');
    // This would typically update app state to enable voice navigation
    console.log('Voice navigation enabled');
    
    // Start the welcome tour for first-time users
    setTimeout(() => {
      // Dispatch event to start the welcome tour
      window.dispatchEvent(new CustomEvent('startWelcomeTour'));
    }, 1000);
  };

  const handleDisableVoice = () => {
    // Save preference to localStorage
    localStorage.setItem('voiceNavigationPreference', 'disabled');
    // This would typically update app state to disable voice navigation
    console.log('Voice navigation disabled');
  };

  const handleClosePopup = () => {
    setShowVoicePopup(false);
    // Redirect to dashboard after closing popup
    navigate("/");
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2 className={styles.title}>Seller Login</h2>
        {success && <div className={styles.successMessage}>{success}</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input 
              name="email" 
              type="email" 
              placeholder="Email Address" 
              onChange={handleChange} 
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              onChange={handleChange} 
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>
        <p className={styles.signupLink}>
          Don't have an account?{" "}
          <Link to="/signup">Sign up here</Link>
        </p>
      </div>
      
      {showVoicePopup && (
        <VoiceNavigationPopup
          onClose={handleClosePopup}
          onEnableVoice={handleEnableVoice}
          onDisableVoice={handleDisableVoice}
          userType="existing"
        />
      )}
    </div>
  );
}

export default Login;
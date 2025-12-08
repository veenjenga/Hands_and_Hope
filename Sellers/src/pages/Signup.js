import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import VoiceNavigationPopup from '../components/VoiceNavigationPopup';
import styles from './Signup.module.css';

function Signup({ onAutoLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", businessName: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVoicePopup, setShowVoicePopup] = useState(false);
  const [isPlayingFeedback, setIsPlayingFeedback] = useState(false); // Prevent overlapping feedback
  const history = useHistory();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Auto-login the user with token and user data
        onAutoLogin(data.token, data.user);
        // Play audio feedback
        setTimeout(() => {
          playSuccessSound();
        }, 1000);
        // Show voice navigation popup after welcome sound
        setTimeout(() => {
          setShowVoicePopup(true);
        }, 4000);
      } else {
        setError(data.message || "Signup failed. Try again.");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const playSuccessSound = async () => {
    // Prevent overlapping feedback
    if (isPlayingFeedback) return;
    
    setIsPlayingFeedback(true);
    
    const text = "Congratulations! Welcome to Hands and Hope. We can't wait to see what you build for trade.";
    
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
          text: text,
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
        fallbackToBrowserSpeech(text);
      }
    } catch (error) {
      console.error('Eleven Labs API error:', error);
      // Fallback to browser speech synthesis if Eleven Labs fails
      fallbackToBrowserSpeech(text);
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

  // Clean up audio and speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const handleEnableVoice = () => {
    // This would typically update app state to enable voice navigation
    console.log('Voice navigation enabled');
  };

  const handleDisableVoice = () => {
    // This would typically update app state to disable voice navigation
    console.log('Voice navigation disabled');
  };

  const handleClosePopup = () => {
    setShowVoicePopup(false);
    // Redirect to dashboard after closing popup
    history.push("/");
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupForm}>
        <h2 className={styles.title}>Seller Sign Up</h2>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input 
              name="name" 
              placeholder="Full Name" 
              onChange={handleChange} 
              className={styles.input}
              required
            />
          </div>
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
          <div className={styles.formGroup}>
            <input 
              name="businessName" 
              placeholder="Business Name" 
              onChange={handleChange} 
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input 
              name="phone" 
              placeholder="Phone Number" 
              onChange={handleChange} 
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <p className={styles.loginLink}>
          Already have an account?{" "}
          <Link to="/login">Login here</Link>
        </p>
      </div>
      
      {showVoicePopup && (
        <VoiceNavigationPopup
          onClose={handleClosePopup}
          onEnableVoice={handleEnableVoice}
          onDisableVoice={handleDisableVoice}
          userType="new"
        />
      )}
    </div>
  );
}

export default Signup;
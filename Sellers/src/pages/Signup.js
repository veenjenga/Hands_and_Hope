import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from './Signup.module.css';

function Signup({ onAutoLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", businessName: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
        console.log('Signup successful, proceeding with auto-login');
        // Auto-login the user
        await autoLoginUser(form.email, form.password);
        console.log('Auto-login completed, playing success sound');
        // Play audio feedback
        playSuccessSound();
        console.log('Success sound played, redirecting to dashboard');
        // Add a small delay before redirecting
        setTimeout(() => {
          history.push("/");
        }, 3000);
      } else {
        setError(data.message || "Signup failed. Try again.");
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const autoLoginUser = async (email, password) => {
    console.log('Attempting auto-login with email:', email);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      console.log('Login response:', data);
      
      if (res.ok && data.token) {
        console.log('Login successful, setting new user flag');
        // Set flag to indicate this is a new user
        localStorage.setItem('isNewUser', 'true');
        // Call the auto-login function passed from App.js
        onAutoLogin(data.token);
      } else {
        console.log('Login failed:', data.error);
      }
    } catch (err) {
      console.error("Auto-login failed:", err);
    }
  };

  const playSuccessSound = async () => {
    const text = "Congratulations! Welcome to Hands and Hope. We can't wait to see what you build for trade.";
    console.log('Playing success sound with Eleven Labs');
    
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
      
      console.log('Eleven Labs response status:', response.status);
      
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        console.log('Playing Eleven Labs audio');
        audio.play();
      } else {
        console.log('Eleven Labs failed, using fallback');
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
    console.log('Using fallback browser speech synthesis');
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      speechSynthesis.speak(utterance);
    } else {
      console.log('Browser speech synthesis not available');
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
    </div>
  );
}

export default Signup;

import React, { useState, useEffect } from "react";
import styles from "./Settings.module.css";

function Settings({
  highContrastMode,
  fontSize,
  setFontSize,
  isVoiceNavigationEnabled,
  setIsVoiceNavigationEnabled,
  voiceFeedback,
  setVoiceFeedback,
}) {
  const [navigationMode, setNavigationMode] = useState(isVoiceNavigationEnabled ? "Voice" : "Screen");
  const [profile, setProfile] = useState({
    fullName: "",
    businessName: "",
    email: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [isPlayingFeedback, setIsPlayingFeedback] = useState(false); // Prevent overlapping feedback

  // Fetch user data from backend on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          setLoading(false);
          return;
        }

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setProfile({
            fullName: userData.name || "",
            businessName: userData.businessName || "",
            email: userData.email || "",
            phoneNumber: userData.phone || "",
          });
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Update navigation mode when isVoiceNavigationEnabled changes
  useEffect(() => {
    setNavigationMode(isVoiceNavigationEnabled ? "Voice" : "Screen");
  }, [isVoiceNavigationEnabled]);

  const increaseFontSize = () => {
    if (fontSize < 24) setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 14) setFontSize(fontSize - 2);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile to backend
  const saveSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication required. Please log in again.");
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.fullName,
          businessName: profile.businessName,
          email: profile.email,
          phone: profile.phoneNumber,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        if (voiceFeedback) {
          playVoiceFeedback("Settings saved successfully");
        }
        alert("Profile updated successfully");
      } else {
        alert(data.error || "Error updating profile");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  const playVoiceFeedback = async (message) => {
    // Prevent overlapping feedback
    if (isPlayingFeedback) return;
    
    setIsPlayingFeedback(true);
    
    try {
      // Use Eleven Labs API for high-quality speech synthesis
      const apiKey = process.env.REACT_APP_ELEVEN_LABS_API_KEY;
      
      // If no API key is available, fall back to browser speech
      if (!apiKey) {
        console.warn('Eleven Labs API key not found, falling back to browser speech');
        fallbackToBrowserSpeech(message);
        setIsPlayingFeedback(false);
        return;
      }
      
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

  // Toggle voice navigation
  const toggleVoiceNavigation = () => {
    const newState = !isVoiceNavigationEnabled;
    setIsVoiceNavigationEnabled(newState);
    setNavigationMode(newState ? "Voice" : "Screen");
    // Save preference to localStorage
    localStorage.setItem('voiceNavigationPreference', newState ? 'enabled' : 'disabled');
    
    // Provide voice feedback (only if not already playing)
    if (!isPlayingFeedback) {
      if (newState) {
        playVoiceFeedback("Voice navigation is now enabled");
      } else {
        playVoiceFeedback("Voice navigation is now disabled");
      }
    }
  };

  // Toggle voice feedback
  const toggleVoiceFeedback = () => {
    const newState = !voiceFeedback;
    setVoiceFeedback(newState);
    
    // Provide voice feedback (only if not already playing)
    if (!isPlayingFeedback) {
      playVoiceFeedback(newState ? "Voice feedback is now enabled" : "Voice feedback is now disabled");
    }
  };

  // Deactivate account
  const deactivateAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication required. Please log in again.");
        return;
      }

      await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/deactivate`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      alert("Account deactivated");
    } catch (err) {
      console.error(err);
      alert("Error deactivating account");
    }
  };

  // Delete account
  const deleteAccount = async () => {
    if (window.confirm("Are you sure? This cannot be undone!")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Authentication required. Please log in again.");
          return;
        }

        await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/sellers/delete`, {
          method: "DELETE",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } catch (err) {
        console.error(err);
        alert("Error deleting account");
      }
    }
  };

  if (loading) {
    return (
      <main
        className={`${styles.main} ${highContrastMode ? styles.highContrast : ""}`}
      >
        <div className={styles.container}>
          <h1 className={styles.title}>Settings</h1>
          <p>Loading user data...</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`${styles.main} ${highContrastMode ? styles.highContrast : ""}`}
    >
      <div className={styles.container}>
        <h1 className={styles.title}>Settings</h1>

        {/* Profile Settings */}
        <section
          className={`${styles.section} ${
            highContrastMode ? styles.sectionHighContrast : ""
          }`}
        >
          <h2 className={styles.sectionTitle}>Profile Settings</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleProfileChange}
              className={`${styles.input} ${
                highContrastMode ? styles.inputHighContrast : ""
              }`}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Business Name</label>
            <input
              type="text"
              name="businessName"
              value={profile.businessName}
              onChange={handleProfileChange}
              className={`${styles.input} ${
                highContrastMode ? styles.inputHighContrast : ""
              }`}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              className={`${styles.input} ${
                highContrastMode ? styles.inputHighContrast : ""
              }`}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleProfileChange}
              className={`${styles.input} ${
                highContrastMode ? styles.inputHighContrast : ""
              }`}
            />
          </div>
          <button
            onClick={saveSettings}
            className={`${styles.saveButton} ${
              highContrastMode ? styles.saveButtonHighContrast : ""
            }`}
          >
            Save Changes
          </button>
        </section>

        {/* Accessibility Settings */}
        <section
          className={`${styles.section} ${
            highContrastMode ? styles.sectionHighContrast : ""
          }`}
        >
          <h2 className={styles.sectionTitle}>Accessibility Settings</h2>
          
          {/* Font Size Controls */}
          <div className={styles.settingRow}>
            <span className={styles.settingLabel}>Font Size</span>
            <div className={styles.fontSizeControls}>
              <button
                onClick={decreaseFontSize}
                disabled={fontSize <= 14}
                className={`${styles.fontSizeButton} ${
                  highContrastMode ? styles.fontSizeButtonHighContrast : ""
                }`}
                aria-label="Decrease font size"
              >
                -
              </button>
              <span
                className={`${styles.fontSizeValue} ${
                  highContrastMode ? styles.fontSizeValueHighContrast : ""
                }`}
              >
                {fontSize}px
              </span>
              <button
                onClick={increaseFontSize}
                disabled={fontSize >= 24}
                className={`${styles.fontSizeButton} ${
                  highContrastMode ? styles.fontSizeButtonHighContrast : ""
                }`}
                aria-label="Increase font size"
              >
                +
              </button>
            </div>
          </div>

          {/* Navigation Mode */}
          <div className={styles.settingRow}>
            <span className={styles.settingLabel}>Navigation Mode</span>
            <div className={styles.toggleContainer}>
              <button
                onClick={() => {
                  setNavigationMode("Screen");
                  setIsVoiceNavigationEnabled(false);
                  localStorage.setItem('voiceNavigationPreference', 'disabled');
                  if (!isPlayingFeedback) {
                    playVoiceFeedback("Screen navigation mode selected");
                  }
                }}
                className={`${styles.toggleButton} ${
                  navigationMode === "Screen"
                    ? styles.activeToggleButton
                    : ""
                } ${highContrastMode ? styles.toggleButtonHighContrast : ""}`}
              >
                Screen
              </button>
              <button
                onClick={toggleVoiceNavigation}
                className={`${styles.toggleButton} ${
                  navigationMode === "Voice"
                    ? styles.activeToggleButton
                    : ""
                } ${highContrastMode ? styles.toggleButtonHighContrast : ""}`}
              >
                Voice
              </button>
            </div>
          </div>

          {/* Voice Feedback */}
          <div className={styles.settingRow}>
            <span className={styles.settingLabel}>Voice Feedback</span>
            <div className={styles.toggleContainer}>
              <button
                onClick={() => {
                  setVoiceFeedback(false);
                  if (!isPlayingFeedback) {
                    playVoiceFeedback("Voice feedback disabled");
                  }
                }}
                className={`${styles.toggleButton} ${
                  !voiceFeedback
                    ? styles.activeToggleButton
                    : ""
                } ${highContrastMode ? styles.toggleButtonHighContrast : ""}`}
              >
                Off
              </button>
              <button
                onClick={toggleVoiceFeedback}
                className={`${styles.toggleButton} ${
                  voiceFeedback
                    ? styles.activeToggleButton
                    : ""
                } ${highContrastMode ? styles.toggleButtonHighContrast : ""}`}
              >
                On
              </button>
            </div>
          </div>
        </section>

        {/* Account Management */}
        <section
          className={`${styles.section} ${
            highContrastMode ? styles.sectionHighContrast : ""
          }`}
        >
          <h2 className={styles.sectionTitle}>Account Management</h2>
          <div className={styles.accountActions}>
            <button
              onClick={deactivateAccount}
              className={`${styles.actionButton} ${
                highContrastMode ? styles.actionButtonHighContrast : ""
              }`}
            >
              Deactivate Account
            </button>
            <button
              onClick={deleteAccount}
              className={`${styles.deleteButton} ${
                highContrastMode ? styles.deleteButtonHighContrast : ""
              }`}
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Settings;
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Profile.module.css';

function Profile() {
  const history = useHistory();
  const [user, setUser] = useState({
    name: '',
    email: '',
    businessName: '',
    phone: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Load user data from localStorage/API on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          history.push('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser({
            name: userData.name || '',
            email: userData.email || '',
            businessName: userData.businessName || '',
            phone: userData.phone || '',
            profilePicture: userData.profilePicture || ''
          });
        } else {
          // Fallback to localStorage if API fails
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser({
              name: userData.name || '',
              email: userData.email || '',
              businessName: userData.businessName || '',
              phone: userData.phone || '',
              profilePicture: userData.profilePicture || ''
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to localStorage if API fails
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser({
            name: userData.name || '',
            email: userData.email || '',
            businessName: userData.businessName || '',
            phone: userData.phone || '',
            profilePicture: userData.profilePicture || ''
          });
        }
      }
    };

    fetchUserProfile();
  }, [history]);

  // Handle scroll events to show/hide scroll buttons
  useEffect(() => {
    const handleScroll = () => {
      const profileForm = document.querySelector(`.${styles.profileForm}`);
      if (profileForm) {
        const { scrollTop, scrollHeight, clientHeight } = profileForm;
        setShowScrollTop(scrollTop > 0);
        setShowScrollBottom(scrollTop + clientHeight < scrollHeight);
      }
    };

    const profileForm = document.querySelector(`.${styles.profileForm}`);
    if (profileForm) {
      profileForm.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      return () => profileForm.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to play audio feedback using Eleven Labs
  const playAudioFeedback = async (message) => {
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
        audio.play();
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

  // Fallback to browser speech synthesis
  const fallbackToBrowserSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      // Send data to backend
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(user)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setMessage('Profile updated successfully!');
        
        // Play audio feedback
        playAudioFeedback("Your profile has been successfully updated.");
        
        // Update localStorage as well for immediate UI updates
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Dispatch storage event to notify other components
        window.dispatchEvent(new Event('storage'));
        
        // Show success message for 3 seconds then clear it
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || 'Failed to update profile'}`);
        
        // Play error audio feedback
        playAudioFeedback("Sorry, there was an error updating your profile. Please try again.");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile. Please try again.');
      
      // Play error audio feedback
      playAudioFeedback("Sorry, there was an error updating your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    history.goBack();
  };

  const scrollToTop = () => {
    const profileForm = document.querySelector(`.${styles.profileForm}`);
    if (profileForm) {
      profileForm.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    const profileForm = document.querySelector(`.${styles.profileForm}`);
    if (profileForm) {
      profileForm.scrollTo({ top: profileForm.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>Profile Settings</h1>
        <button 
          onClick={handleBack} 
          className={styles.backButton}
        >
          ← Back to Dashboard
        </button>
      </div>

      {message && (
        <div className={styles.message}>
          {message}
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className={`${styles.scrollButton} ${styles.scrollTop}`}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}

      <form onSubmit={handleSave} className={styles.profileForm}>
        <div className={styles.formGroup}>
          <label htmlFor="profilePicture">Profile Picture</label>
          <input
            type="text"
            id="profilePicture"
            name="profilePicture"
            value={user.profilePicture}
            onChange={handleChange}
            placeholder="Enter image URL"
            className={styles.input}
          />
          {user.profilePicture && (
            <img 
              src={user.profilePicture} 
              alt="Preview" 
              className={styles.profilePreview}
            />
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="businessName">Business Name</label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={user.businessName}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={styles.saveButton}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Scroll to Bottom Button */}
      {showScrollBottom && (
        <button 
          onClick={scrollToBottom}
          className={`${styles.scrollButton} ${styles.scrollBottom}`}
          aria-label="Scroll to bottom"
        >
          ↓
        </button>
      )}
    </div>
  );
}

export default Profile;
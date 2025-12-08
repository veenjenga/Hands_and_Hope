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
  const [isPlayingFeedback, setIsPlayingFeedback] = useState(false); // Prevent overlapping feedback

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

  // Fallback to browser speech synthesis
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
      setMessage('Network error. Please try again.');
      
      // Play error audio feedback
      playAudioFeedback("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
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
      profileForm.scrollTo({ 
        top: profileForm.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Profile Settings</h1>
        
        {message && (
          <div className={`${styles.message} ${
            message.includes('Error') || message.includes('error') 
              ? styles.errorMessage 
              : styles.successMessage
          }`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSave} className={styles.profileForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={user.name}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="businessName" className={styles.label}>
              Business Name
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={user.businessName}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="profilePicture" className={styles.label}>
              Profile Picture URL
            </label>
            <input
              type="url"
              id="profilePicture"
              name="profilePicture"
              value={user.profilePicture}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter image URL"
            />
            {user.profilePicture && (
              <div className={styles.imagePreview}>
                <img 
                  src={user.profilePicture} 
                  alt="Profile Preview" 
                  className={styles.previewImage}
                />
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className={styles.saveButton}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
        
        {/* Scroll buttons */}
        {showScrollTop && (
          <button 
            className={`${styles.scrollButton} ${styles.scrollTop}`}
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            ↑
          </button>
        )}
        
        {showScrollBottom && (
          <button 
            className={`${styles.scrollButton} ${styles.scrollBottom}`}
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
          >
            ↓
          </button>
        )}
      </div>
    </main>
  );
}

export default Profile;
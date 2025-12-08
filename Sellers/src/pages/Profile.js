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

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          name: userData.name || '',
          email: userData.email || '',
          businessName: userData.businessName || '',
          phone: userData.phone || '',
          profilePicture: userData.profilePicture || ''
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

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

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // In a real application, you would send this data to your backend
      // For now, we'll just update localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUser = {
          ...userData,
          name: user.name,
          email: user.email,
          businessName: user.businessName,
          phone: user.phone,
          profilePicture: user.profilePicture
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setMessage('Profile updated successfully!');
        
        // Also update in App state by triggering a storage event
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile. Please try again.');
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
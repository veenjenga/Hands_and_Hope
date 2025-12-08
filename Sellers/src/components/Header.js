// src/components/Header.js
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Header.module.css';

function Header({ highContrastMode, currentUser }) {
  const history = useHistory();
  const [user, setUser] = useState(currentUser);

  // Update local user state when currentUser prop changes
  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  // Listen for storage changes and fetch user data from API
  useEffect(() => {
    const handleStorageChange = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Fallback to localStorage if API fails
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fallback to localStorage if API fails
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } else {
        // Clear user data if no token
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also fetch user data on component mount
    handleStorageChange();
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAddProduct = () => {
    history.push('/add-product');
  };

  const handleLogout = () => {
    // Clear auth token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    history.push('/login');
  };

  return (
    <header
      className={`${styles.header} ${
        highContrastMode ? styles.headerHighContrast : ''
      }`}
      role="banner"
    >
      <div className={styles.headerContent}>
        <div className={styles.logoContainer}>
          <img
            src="https://public.readdy.ai/ai/img_res/5ff6d397171f27c83a4bc4d037a1e37e.jpg"
            alt="Hands and Hope Logo"
            className={styles.logo}
          />
        </div>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search products, orders..."
            className={`${styles.searchInput} ${
              highContrastMode ? styles.searchInputHighContrast : ''
            }`}
            aria-label="Search products or orders"
          />
          <i className={`fa fa-search ${styles.searchIcon}`}></i>
        </div>

        <div className={styles.userActions}>
          <button
            onClick={handleAddProduct}
            className={`${styles.addButton} ${
              highContrastMode ? styles.addButtonHighContrast : ''
            }`}
            aria-label="Add a new product"
          >
            <i className={`fa fa-plus ${styles.buttonIcon}`}></i>
            <span>Add Product</span>
          </button>

          <div className={styles.userInfo}>
            <div 
              className={styles.avatarContainer}
              onClick={() => history.push('/profile')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  history.push('/profile');
                }
              }}
            >
              <img
                src={user?.profilePicture || "https://public.readdy.ai/ai/img_res/d148673ac06fcc36bc7ff4b04964af63.jpg"}
                alt={`User Avatar for ${user?.name || 'Seller'}`}
                className={styles.userAvatar}
              />
            </div>
            <span className={`${styles.userName} ${highContrastMode ? styles.userNameHighContrast : ''}`}>
              {user?.name || 'Seller'}
            </span>
            <button
              onClick={handleLogout}
              className={`${styles.logoutButton} ${
                highContrastMode ? styles.logoutButtonHighContrast : ''
              }`}
              aria-label="Log out of your account"
            >
              <i className={`fa fa-sign-out-alt ${styles.buttonIcon}`}></i>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
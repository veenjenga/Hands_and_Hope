// src/components/Header.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Header.module.css';

function Header({ highContrastMode }) {
  const history = useHistory();

  const handleAddProduct = () => {
    history.push('/add-product');
  };

  const handleLogout = () => {
    // Add logout logic here (e.g., clear auth token)
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
            alt="Equal Trade Logo"
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
            <img
              src="https://public.readdy.ai/ai/img_res/d148673ac06fcc36bc7ff4b04964af63.jpg"
              alt="User Avatar for John Doe"
              className={styles.userAvatar}
            />
            <span className={styles.userName}>John Doe</span>
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
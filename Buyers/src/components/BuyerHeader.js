import React from "react";
import { Link } from "react-router-dom";
import { useCart } from '../contexts/CartContext';
import styles from "./BuyerHeader.module.css";

function BuyerHeader({ highContrastMode, searchQuery, onSearchQueryChange, isAuthenticated, currentUser, onLogout }) {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();
  
  return (
    <header className={`${styles.header} ${highContrastMode ? styles.highContrast : ""}`}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <h1>Hands and Hope</h1>
        </div>
        <div className={styles.searchContainer}>
          <input
            type='text'
            placeholder='Search for products...'
            className={`${styles.searchInput} ${highContrastMode ? styles.inputHighContrast : ""}`}
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
          />
          <button
            className={`${styles.searchButton} ${highContrastMode ? styles.buttonHighContrast : ""}`}
            aria-label='Search'
            disabled
          >
            <i className='fas fa-search'></i>
          </button>
        </div>
        <div className={styles.headerRight}>
          <Link
            to='/cart'
            className={`${styles.cartIcon} ${highContrastMode ? styles.iconHighContrast : ""}`}
            aria-label='Shopping Cart'
          >
            <i className='fas fa-shopping-cart'></i>
            {itemCount > 0 && (
              <span className={styles.cartBadge}>{itemCount}</span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <div className={styles.userProfile}>
                <img 
                  src={currentUser?.profilePicture || "https://public.readdy.ai/ai/img_res/d148673ac06fcc36bc7ff4b04964af63.jpg"} 
                  alt="User Profile" 
                  className={styles.userAvatar}
                />
                <span className={`${styles.userName} ${highContrastMode ? styles.userNameHighContrast : ""}`}>
                  {currentUser?.businessName || currentUser?.name || 'User'}
                </span>
              </div>
              <button
                onClick={onLogout}
                className={`${styles.logoutButton} ${highContrastMode ? styles.buttonHighContrast : ""}`}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to='/login'
                className={`${styles.loginButton} ${highContrastMode ? styles.buttonHighContrast : ""}`}
              >
                Login
              </Link>
              <Link
                to='/register'
                className={`${styles.registerButton} ${highContrastMode ? styles.buttonHighContrast : ""}`}
              >
                Register
              </Link>
            </>
          )}
          <Link
            to='/settings'
            className={`${styles.settingsIcon} ${highContrastMode ? styles.iconHighContrast : ""}`}
            aria-label='Settings'
          >
            <i className='fas fa-cog'></i>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default BuyerHeader;

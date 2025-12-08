import React from "react";
import { Link } from "react-router-dom";
import { useCart } from '../contexts/CartContext';
import styles from "./BuyerHeader.module.css";

function BuyerHeader({ highContrastMode, searchQuery, onSearchQueryChange }) {
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
          <Link
            to='/register'
            className={`${styles.registerButton} ${highContrastMode ? styles.buttonHighContrast : ""}`}
          >
            Register as Seller
          </Link>
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

// src/components/ProductCard.js
import React from 'react';
import styles from './ProductCard.module.css';

function ProductCard({ product, highContrastMode }) {
  return (
    <div
      className={`${styles.productCard} ${
        highContrastMode ? styles.productCardHighContrast : ''
      }`}
    >
      <div className={styles.imageContainer}>
        <img
          src={product.image}
          alt={`${product.name} product listing`}
          className={styles.productImage}
        />
      </div>
      <div className={styles.productContent}>
        <div className={styles.productHeader}>
          <h3
            className={`${styles.productName} ${
              highContrastMode ? styles.productNameHighContrast : ''
            }`}
          >
            {product.name}
          </h3>
          <span
            className={`${styles.productStatus} ${
              highContrastMode ? styles.productStatusHighContrast : ''
            }`}
          >
            {product.status}
          </span>
        </div>
        <p
          className={`${styles.productPrice} ${
            highContrastMode ? styles.productPriceHighContrast : ''
          }`}
        >
          {product.price}
        </p>
        <div className={styles.productActions}>
          <button
            className={`${styles.editButton} ${
              highContrastMode ? styles.editButtonHighContrast : ''
            }`}
            aria-label={`Edit ${product.name}`}
          >
            Edit
          </button>
          <button
            className={`${styles.viewButton} ${
              highContrastMode ? styles.viewButtonHighContrast : ''
            }`}
            aria-label={`View details of ${product.name}`}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
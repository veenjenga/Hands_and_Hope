// src/pages/ProductListing.js
import React, { useState } from 'react';
import styles from './ProductListing.module.css';

function ProductListing({
  highContrastMode,
  products,
  onDelete,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  searchQuery,
  setSearchQuery
}) {
  const categories = ['All', 'Furniture', 'Clothing', 'Home Decor', 'Electronics', 'Accessories'];
  const statuses = ['All', 'Active', 'Draft', 'Sold Out'];

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || product.status === selectedStatus;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <main className={`${styles.productListing} ${highContrastMode ? styles.highContrast : ''}`}>
      {/* Products Header Section */}
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Your Products</h1>
        <p className={styles.subtitle}>Manage and organize your product listings</p>
      </div>

      {/* Filters and Search Section */}
      <div className={styles.filtersSection}>
        <div className={styles.navigationBar}>
          {/* Left Group: Category and Status */}
          <div className={styles.leftGroup}>
            {/* Category Filter */}
            <div className={styles.dropdownContainer}>
              <div
                className={styles.dropdownButton}
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              >
                <i className="fa fa-tags"></i>
                Category: {selectedCategory}
                <i className="fa fa-chevron-down ml-2"></i>
              </div>
              <div
                className={`${styles.dropdownMenu} ${
                  isCategoryDropdownOpen ? '' : styles.hidden
                }`}
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    className={styles.dropdownItem}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsCategoryDropdownOpen(false);
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className={styles.dropdownContainer}>
              <div
                className={styles.dropdownButton}
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              >
                <i className="fa fa-circle"></i>
                Status: {selectedStatus}
                <i className="fa fa-chevron-down ml-2"></i>
              </div>
              <div
                className={`${styles.dropdownMenu} ${
                  isStatusDropdownOpen ? '' : styles.hidden
                }`}
              >
                {statuses.map((status) => (
                  <button
                    key={status}
                    className={styles.dropdownItem}
                    onClick={() => {
                      setSelectedStatus(status);
                      setIsStatusDropdownOpen(false);
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Group: Search and Add Product */}
          <div className={styles.rightGroup}>
            {/* Search Bar */}
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <i className="fa fa-search"></i>
            </div>

            {/* Add Product Button */}
            <button
              className={styles.addProductButton}
              onClick={() => window.location.href = '/add-product'}
            >
              <i className="fa fa-plus"></i>
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className={styles.productGrid}>
        {filteredProducts.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.productImageContainer}>
              <img
                src={product.image}
                alt={product.name}
                className={styles.productImage}
              />
            </div>
            <div className={styles.productDetails}>
              <div className={styles.productHeader}>
                <h3 className={styles.productName}>{product.name}</h3>
                <span className={`${styles.status} ${styles[product.status.toLowerCase()]}`}>
                  {product.status}
                </span>
              </div>
              <p className={styles.category}>{product.category}</p>
              <p className={styles.price}>{product.price}</p>
              <div className={styles.actions}>
                <button className={styles.editButton}>
                  <i className="fa fa-edit"></i>
                  Edit
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => onDelete(product.id)}
                >
                  <i className="fa fa-trash"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default ProductListing;
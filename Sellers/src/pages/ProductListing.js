// src/pages/ProductListing.js
import React, { useState, useEffect } from 'react';
import styles from './ProductListing.module.css';
import voiceFeedback from '../utils/voiceFeedback';

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
  const [isVoiceNavActive, setIsVoiceNavActive] = useState(false);

  // Check if voice navigation is enabled
  useEffect(() => {
    const voiceNavPref = localStorage.getItem('voiceNavigationPreference');
    setIsVoiceNavActive(voiceNavPref === 'enabled');
    
    // Provide voice feedback when entering products page
    voiceFeedback.announce("You are in products");
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || product.status === selectedStatus;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Function to update product status
  const updateProductStatus = async (productId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Refresh the product list or update the specific product in state
        window.location.reload();
      } else {
        console.error('Failed to update product status');
      }
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsCategoryDropdownOpen(false);
    voiceFeedback.announce(`Filtering by category: ${category}`);
  };

  // Handle status selection
  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setIsStatusDropdownOpen(false);
    voiceFeedback.announce(`Filtering by status: ${status}`);
  };

  // Handle add product button click
  const handleAddProductClick = () => {
    window.location.href = '/add-product';
    voiceFeedback.announce("Navigating to add product page");
  };

  // Handle delete product
  const handleDeleteProduct = (productId, productName) => {
    onDelete(productId);
    voiceFeedback.announce(`Product ${productName} has been deleted`);
  };

  return (
    <main className={`${styles.productListing} ${highContrastMode ? styles.highContrast : ''}`}>
      {/* Products Header Section */}
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Your Products</h1>
        <p className={styles.subtitle}>Manage and organize your product listings</p>
        {isVoiceNavActive && (
          <div className={styles.voiceHelp}>
            <p>Voice Navigation Active: Say "add new product" to add a product, or use filters with voice commands</p>
          </div>
        )}
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
                    onClick={() => handleCategorySelect(category)}
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
                    onClick={() => handleStatusSelect(status)}
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
              onClick={handleAddProductClick}
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
          <div key={product._id} className={styles.productCard}>
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
              {product.color && (
                <p className={styles.color}>Color: {product.color}</p>
              )}
              <p className={styles.price}>${product.price.toFixed(2)}</p>
              
              {/* Status Change Dropdown */}
              <div className={styles.statusChangeContainer}>
                <label htmlFor={`status-${product._id}`}>Change Status:</label>
                <select
                  id={`status-${product._id}`}
                  value={product.status}
                  onChange={(e) => updateProductStatus(product._id, e.target.value)}
                  className={styles.statusSelect}
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Sold Out">Sold Out</option>
                </select>
              </div>
              
              <div className={styles.actions}>
                <button className={styles.editButton}>
                  <i className="fa fa-edit"></i>
                  Edit
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteProduct(product._id, product.name)}
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
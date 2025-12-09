import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import styles from './BuyersDashboard.module.css';
import { API_ENDPOINTS } from '../config/api'; // Import API configuration

function CategoryPage({ highContrastMode, fontSize }) {
  const { category } = useParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Decode the category name from URL
  const decodedCategory = decodeURIComponent(category).replace(/-/g, ' ');

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.PRODUCTS.LIST);
        if (response.ok) {
          const productsData = await response.json();
          setProducts(productsData);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by category when products or category changes
  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter(product => 
        product.category.toLowerCase() === decodedCategory.toLowerCase()
      );
      setFilteredProducts(filtered);
      setLoading(false);
    }
  }, [category, products, decodedCategory]);

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optional: Show a notification or feedback to the user
  };

  if (loading) {
    return (
      <main className={`${styles.main} ${highContrastMode ? styles.highContrast : ''}`}>
        <div className={styles.container}>
          <h1 className={styles.sectionTitle}>Loading...</h1>
        </div>
      </main>
    );
  }

  return (
    <main className={`${styles.main} ${highContrastMode ? styles.highContrast : ''}`}>
      <div className={styles.container}>
        <h1 className={styles.sectionTitle}>{decodedCategory} Products</h1>
        {filteredProducts.length === 0 ? (
          <div style={{ 
            background: '#fff', 
            padding: '2rem', 
            borderRadius: '0.5rem', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2>No products found in this category</h2>
            <p>Check back later for new products in the {decodedCategory} category.</p>
          </div>
        ) : (
          <div className={styles.productGrid}>
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className={`${styles.productCard} ${highContrastMode ? styles.cardHighContrast : ''}`}
              >
                <div className={styles.productImageWrapper}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.productDetails}>
                  <div className={styles.productInfo}>
                    <div>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={`${styles.productCategory} ${highContrastMode ? styles.textHighContrast : ''}`}>
                        {product.category}
                      </p>
                    </div>
                    <div className={styles.productPrice}>{product.price.toLocaleString('en-KE')} Ksh</div>
                  </div>
                  <button 
                    className={styles.contactButton}
                    onClick={() => handleAddToCart(product)}
                  >
                    <i className="fas fa-shopping-cart mr-2"></i>Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default CategoryPage;
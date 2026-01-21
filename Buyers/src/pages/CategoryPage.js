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
        product.category && 
        product.category.toLowerCase() === decodedCategory.toLowerCase() &&
        product.status === 'Active'
      );
      setFilteredProducts(filtered);
      setLoading(false);
    }
  }, [products, decodedCategory]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <main className={`${styles.main} ${highContrastMode ? styles.highContrast : ''}`}>
        <div className={styles.container}>
          <h1>Loading products...</h1>
        </div>
      </main>
    );
  }

  return (
    <main className={`${styles.main} ${highContrastMode ? styles.highContrast : ''}`}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>{decodedCategory} Products</h1>
        
        {filteredProducts.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          <div className={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <div key={product._id} className={styles.productCard}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className={styles.productImage}
                />
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productPrice}>Ksh {product.price.toLocaleString()}</p>
                  <button 
                    className={styles.addToCartButton}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
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
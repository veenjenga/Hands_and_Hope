// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import ProductCard from '../components/ProductCard';
import styles from './Dashboard.module.css';

function Dashboard({ highContrastMode }) {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState([
    { title: 'Active Listings', value: '0', icon: 'tag', color: 'blue' },
    { title: 'Pending Inquiries', value: '0', icon: 'question-circle', color: 'yellow' },
    { title: 'Listed Categories', value: '0', icon: 'tag', color: 'green' },
  ]);
  
  const [isNewUser, setIsNewUser] = useState(false);

  // Check if this is a new user
  useEffect(() => {
    const newUserFlag = localStorage.getItem('isNewUser');
    if (newUserFlag === 'true') {
      setIsNewUser(true);
      // Remove the flag so the message doesn't show again
      localStorage.removeItem('isNewUser');
    }
  }, []);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        setProducts(data);

        // Update stats dynamically
        const activeCount = data.filter((p) => p.status === 'Active').length;
        const categories = [...new Set(data.map((p) => p.category))].length;

        setStats([
          { title: 'Active Listings', value: activeCount, icon: 'tag', color: 'blue' },
          { title: 'Pending Inquiries', value: '8', icon: 'question-circle', color: 'yellow' }, // 👈 replace with real inquiries later
          { title: 'Listed Categories', value: categories, icon: 'tag', color: 'green' },
        ]);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main
      className={`${styles.main} ${highContrastMode ? styles.highContrast : ''}`}
      role="main"
    >
      {/* Welcome Section */}
      <div className={styles.welcomeSection}>
        {isNewUser ? (
          <>
            <h1
              className={`${styles.welcomeTitle} ${
                highContrastMode ? styles.welcomeTitleHighContrast : ''
              }`}
            >
              Welcome to Hands and Hope!
            </h1>
            <p
              className={`${styles.welcomeText} ${
                highContrastMode ? styles.welcomeTextHighContrast : ''
              }`}
            >
              Congratulations on joining our community. We're excited to see what you'll build for trade!
            </p>
          </>
        ) : (
          <>
            <h1
              className={`${styles.welcomeTitle} ${
                highContrastMode ? styles.welcomeTitleHighContrast : ''
              }`}
            >
              Welcome, John Doe
            </h1>
            <p
              className={`${styles.welcomeText} ${
                highContrastMode ? styles.welcomeTextHighContrast : ''
              }`}
            >
              Here's an overview of your store performance
            </p>
          </>
        )}
      </div>

      {/* Stats Section */}
      <div className={styles.statsSection}>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            highContrastMode={highContrastMode}
          />
        ))}
      </div>

      {/* Recent Listings Section */}
      <div className={styles.listingsSection}>
        <div className={styles.listingsHeader}>
          <h2
            className={`${styles.listingsTitle} ${
              highContrastMode ? styles.listingsTitleHighContrast : ''
            }`}
          >
            Recent Listings
          </h2>
          <button
            className={`${styles.viewAllButton} ${
              highContrastMode ? styles.viewAllButtonHighContrast : ''
            }`}
            aria-label="View all recent listings"
          >
            View All
          </button>
        </div>

        <div className={styles.listingsGrid}>
          {products.slice(0, 3).map((product, index) => (
            <ProductCard
              key={product._id || index}
              product={{
                ...product,
                price: `$${product.price.toFixed(2)}`, // format number
              }}
              highContrastMode={highContrastMode}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Dashboard;

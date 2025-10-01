// src/pages/Dashboard.js
import React from 'react';
import StatCard from '../components/StatCard';
import ProductCard from '../components/ProductCard';
import styles from './Dashboard.module.css';

function Dashboard({ highContrastMode }) {
  const stats = [
    { title: 'Active Listings', value: '24', icon: 'tag', color: 'blue' },
    { title: 'Pending Inquiries', value: '8', icon: 'question-circle', color: 'yellow' },
    { title: 'Listed Categories', value: '3', icon: 'tag', color: 'green' },
  ];

  const products = [
    {
      name: 'Handcrafted Wooden Chair',
      price: '$149.99',
      status: 'Active',
      image: 'https://public.readdy.ai/ai/img_res/178e990867a812359b502d82b2529450.jpg',
    },
    {
      name: 'Organic Cotton T-Shirt',
      price: '$29.99',
      status: 'Active',
      image: 'https://public.readdy.ai/ai/img_res/34f2b6ef2b8a46854cb01dcdc4a5e72e.jpg',
    },
    {
      name: 'Handmade Ceramic Vase',
      price: '$79.99',
      status: 'Active',
      image: 'https://public.readdy.ai/ai/img_res/f402ad34942bd3e271a3ffd3f3c63970.jpg',
    },
  ];

  return (
    <main className={`${styles.main} ${highContrastMode ? styles.highContrast : ''}`} role="main">
      {/* Welcome Section */}
      <div className={styles.welcomeSection}>
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
          {products.map((product, index) => (
            <ProductCard
              key={index}
              product={product}
              highContrastMode={highContrastMode}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
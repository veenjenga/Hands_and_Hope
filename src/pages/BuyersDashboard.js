import React from 'react';
import styles from './BuyersDashboard.module.css';

function BuyersDashboard({ highContrastMode, fontSize, products, filters }) {
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      filters.categories.length === 0 || filters.categories.includes(product.category);
    const matchesPrice =
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
    const matchesColor =
      filters.colors.length === 0 || filters.colors.includes(product.color);
    const matchesStatus = product.status === 'Active'; // Added status filter
    return matchesCategory && matchesPrice && matchesColor && matchesStatus;
  });

  const categories = [
    "Electronics",
    "Furniture",
    "Smart Home",
    "Wearables",
    "Gaming",
    "Audio"
  ];

  return (
    <main className={`${styles.main} ${highContrastMode ? styles.highContrast : ''}`}>
      <div className={styles.container}>
        {/* Hero Banner */}
        <div
          className={`${styles.hero} ${highContrastMode ? styles.heroHighContrast : ''}`}
          style={{
            backgroundImage: "url('https://readdy.ai/api/search-image?query=modern%20marketplace%20ecommerce%20shopping%20abstract%20background%20with%20geometric%20shapes%20and%20soft%20gradient%20colors%20perfect%20for%20hero%20banner&width=1200&height=400&seq=7&orientation=landscape')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>Welcome to Hands and Hope</h1>
              <p className={styles.heroSubtitle}>
                Discover amazing products from trusted sellers around the world. Your one-stop destination for quality trade.
              </p>
              <button className={styles.heroButton}>
                <i className="fas fa-shopping-cart mr-2"></i>Start Shopping
              </button>
            </div>
          </div>
        </div>
        {/* Product Grid */}
        <h2 className={styles.sectionTitle}>Featured Products</h2>
        <div className={styles.productGrid}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
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
                <button className={styles.contactButton}>
                  <i className="fas fa-envelope mr-2"></i>Contact Seller
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Footer */}
        <footer className={`${styles.footer} ${highContrastMode ? styles.footerHighContrast : ''}`}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h3 className={styles.footerTitle}>Hands and Hope</h3>
              <p className={`${styles.footerText} ${highContrastMode ? styles.textHighContrast : ''}`}>
                Making global trade accessible and equal for everyone.
              </p>
            </div>
            <div className={styles.footerSection}>
              <h4 className={styles.footerSubtitle}>Quick Links</h4>
              <ul className={styles.footerList}>
                <li><a href="/about" className={styles.footerLink}>About Us</a></li>
                <li><a href="/how-it-works" className={styles.footerLink}>How It Works</a></li>
                <li><a href="/safety-tips" className={styles.footerLink}>Safety Tips</a></li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4 className={styles.footerSubtitle}>Categories</h4>
              <ul className={styles.footerList}>
                {categories.slice(0, 4).map((category) => (
                  <li key={category}><a href={`/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`} className={styles.footerLink}>{category}</a></li>
                ))}
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4 className={styles.footerSubtitle}>Contact</h4>
              <ul className={styles.footerList}>
                <li className={styles.footerContact}>
                  <i className="fas fa-envelope mr-2"></i>support@handsandhope.com
                </li>
                <li className={styles.footerContact}>
                  <i className="fas fa-phone mr-2"></i>+1 (555) 123-4567
                </li>
              </ul>
            </div>
          </div>
          <div className={`${styles.footerBottom} ${highContrastMode ? styles.footerBottomHighContrast : ''}`}>
            © 2025 Hands and Hope. All rights reserved.
          </div>
        </footer>
      </div>
    </main>
  );
}

export default BuyersDashboard;
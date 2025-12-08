import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Dashboard.module.css';

function Dashboard({ highContrastMode }) {
  const history = useHistory();
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [isVoiceNavEnabled, setIsVoiceNavEnabled] = useState(false);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeListings: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });

  // Check if this is the user's first visit
  useEffect(() => {
    const isFirstVisit = !localStorage.getItem('hasVisitedDashboard');
    if (isFirstVisit) {
      setShowWelcomeTour(true);
      localStorage.setItem('hasVisitedDashboard', 'true');
    }
    
    // Check if voice navigation is enabled
    const voiceNavPref = localStorage.getItem('voiceNavigationPreference');
    setIsVoiceNavEnabled(voiceNavPref === 'enabled');
  }, []);

  // Fetch seller products and calculate stats
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('http://localhost:5000/api/products/seller', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const productsData = await response.json();
          setProducts(productsData);
          
          // Calculate stats
          const totalProducts = productsData.length;
          const activeListings = productsData.filter(p => p.status === 'Active').length;
          const pendingOrders = productsData.filter(p => p.status === 'Pending').length;
          const totalRevenue = productsData
            .filter(p => p.status === 'Sold')
            .reduce((sum, product) => sum + product.price, 0);
          
          setStats({
            totalProducts,
            activeListings,
            pendingOrders,
            totalRevenue
          });
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchProducts();
  }, []);

  // Handle welcome tour
  useEffect(() => {
    if (showWelcomeTour && isVoiceNavEnabled) {
      // Start the welcome tour
      startWelcomeTour();
    }
  }, [showWelcomeTour, isVoiceNavEnabled]);

  const startWelcomeTour = () => {
    // This would be handled by the VoiceNavigation component
    // We'll trigger a custom event that VoiceNavigation can listen to
    window.dispatchEvent(new CustomEvent('startWelcomeTour'));
  };

  const tourSteps = [
    "Welcome to Hand and Hope! I'm your AI assistant and I'll guide you through the platform.",
    "This is your dashboard where you can see an overview of your products and sales.",
    "You can navigate to different sections using the sidebar on the left or by using voice commands.",
    "To add a new product, you can say 'add new product' or click the 'Add Product' link in the sidebar.",
    "To view your existing products, say 'go to products' or click 'Products' in the sidebar.",
    "To check customer inquiries, say 'go to inquiries' or click 'Inquiries' in the sidebar.",
    "To update your profile or change settings, say 'go to settings' or click 'Settings' in the sidebar.",
    "Would you like me to continue showing you how to use voice navigation or do you have any questions?",
  ];

  const nextTourStep = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      setShowWelcomeTour(false);
    }
  };

  const skipTour = () => {
    setShowWelcomeTour(false);
  };

  // Handle stat card clicks
  const handleStatClick = (statType) => {
    switch (statType) {
      case 'totalProducts':
        history.push('/products');
        break;
      case 'activeListings':
        history.push('/products?status=Active');
        break;
      case 'pendingOrders':
        history.push('/inquiries');
        break;
      case 'totalRevenue':
        // Could navigate to a revenue report page if implemented
        break;
      default:
        break;
    }
  };

  return (
    <main className={`${styles.main} ${highContrastMode ? styles.highContrast : ''}`}>
      <div className={styles.welcomeSection}>
        <h1 className={`${styles.welcomeTitle} ${highContrastMode ? styles.welcomeTitleHighContrast : ''}`}>
          Dashboard
        </h1>
        <p className={`${styles.welcomeText} ${highContrastMode ? styles.welcomeTextHighContrast : ''}`}>
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      <section className={styles.statsSection}>
        <h2 className={`${styles.sectionTitle} ${highContrastMode ? styles.sectionTitleHighContrast : ''}`}>
          Store Statistics
        </h2>
        <div className={styles.statsGrid}>
          <div 
            className={`${styles.statCard} ${styles.yellowCard} ${highContrastMode ? styles.statCardHighContrast : ''}`}
            onClick={() => handleStatClick('totalProducts')}
          >
            <h3 className={styles.statValue}>{stats.totalProducts}</h3>
            <p className={`${styles.statLabel} ${highContrastMode ? styles.statLabelHighContrast : ''}`}>
              Total Products
            </p>
          </div>
          <div 
            className={`${styles.statCard} ${styles.blueCard} ${highContrastMode ? styles.statCardHighContrast : ''}`}
            onClick={() => handleStatClick('activeListings')}
          >
            <h3 className={styles.statValue}>{stats.activeListings}</h3>
            <p className={`${styles.statLabel} ${highContrastMode ? styles.statLabelHighContrast : ''}`}>
              Active Listings
            </p>
          </div>
          <div 
            className={`${styles.statCard} ${styles.yellowCard} ${highContrastMode ? styles.statCardHighContrast : ''}`}
            onClick={() => handleStatClick('pendingOrders')}
          >
            <h3 className={styles.statValue}>{stats.pendingOrders}</h3>
            <p className={`${styles.statLabel} ${highContrastMode ? styles.statLabelHighContrast : ''}`}>
              Pending Orders
            </p>
          </div>
          <div 
            className={`${styles.statCard} ${styles.blueCard} ${highContrastMode ? styles.statCardHighContrast : ''}`}
            onClick={() => handleStatClick('totalRevenue')}
          >
            <h3 className={styles.statValue}>${stats.totalRevenue.toLocaleString()}</h3>
            <p className={`${styles.statLabel} ${highContrastMode ? styles.statLabelHighContrast : ''}`}>
              Total Revenue
            </p>
          </div>
        </div>
      </section>

      <section className={styles.recentActivitySection}>
        <h2 className={`${styles.sectionTitle} ${highContrastMode ? styles.sectionTitleHighContrast : ''}`}>
          Recent Activity
        </h2>
        <div className={`${styles.activityCard} ${highContrastMode ? styles.activityCardHighContrast : ''}`}>
          <ul className={styles.activityList}>
            <li className={styles.activityItem}>
              <span className={styles.activityTime}>2 hours ago</span>
              <span className={styles.activityText}>New inquiry received for "Wireless Headphones"</span>
            </li>
            <li className={styles.activityItem}>
              <span className={styles.activityTime}>5 hours ago</span>
              <span className={styles.activityText}>"Vintage Camera" listing approved</span>
            </li>
            <li className={styles.activityItem}>
              <span className={styles.activityTime}>1 day ago</span>
              <span className={styles.activityText}>Order placed for "Leather Wallet"</span>
            </li>
          </ul>
        </div>
      </section>

      {showWelcomeTour && (
        <div className={styles.welcomeTour}>
          <div className={styles.tourContent}>
            <h3>Welcome Tour</h3>
            <p>{tourSteps[tourStep]}</p>
            <div className={styles.tourControls}>
              <button onClick={skipTour}>Skip Tour</button>
              <button onClick={nextTourStep}>
                {tourStep < tourSteps.length - 1 ? 'Next' : 'Finish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
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
  const [currentUser, setCurrentUser] = useState(null);
  const [voiceNavigationAnnounced, setVoiceNavigationAnnounced] = useState(false);
  const [isPlayingFeedback, setIsPlayingFeedback] = useState(false); // Prevent overlapping feedback

  // Get user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    const newUserFlag = localStorage.getItem('isNewUser');
    if (newUserFlag === 'true') {
      setIsNewUser(true);
      // Remove the flag so the message doesn't show again
      localStorage.removeItem('isNewUser');
    }
  }, []);

  // Combined effect to load user data and check if this is a new user
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
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

  // Check voice navigation status and announce if enabled
  useEffect(() => {
    const storedVoicePref = localStorage.getItem('voiceNavigationPreference');
    if (storedVoicePref === 'enabled' && !voiceNavigationAnnounced) {
      setVoiceNavigationAnnounced(true);
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        announceVoiceNavigationStatus();
      }, 2000);
    }
  }, [voiceNavigationAnnounced]);

  const announceVoiceNavigationStatus = async () => {
    // Prevent overlapping feedback
    if (isPlayingFeedback) return;
    
    setIsPlayingFeedback(true);
    
    const message = "Voice navigation is enabled. You can say 'turn off voice navigation' to disable it.";
    
    try {
      // Use Eleven Labs API for high-quality speech synthesis
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': 'sk_20734ae2903209818628e37d95e46a5c6f59a503a17d1eb3',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: message,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });
      
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        // Play the Eleven Labs audio
        audio.play();
        
        // Reset the playing flag when audio finishes
        audio.onended = () => {
          setIsPlayingFeedback(false);
        };
      } else {
        // Fallback to browser speech synthesis if Eleven Labs fails
        fallbackToBrowserSpeech(message);
      }
    } catch (error) {
      console.error('Eleven Labs API error:', error);
      // Fallback to browser speech synthesis if Eleven Labs fails
      fallbackToBrowserSpeech(message);
    }
  };

  const fallbackToBrowserSpeech = (text) => {
    // Cancel any ongoing speech synthesis to prevent overlap
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Reset the playing flag when speech ends
      utterance.onend = () => {
        setIsPlayingFeedback(false);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      // Reset the playing flag if no speech synthesis available
      setIsPlayingFeedback(false);
    }
  };

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
              Welcome, {currentUser?.name || 'Seller'}
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
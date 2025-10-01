import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BuyerSidebar from './components/BuyerSidebar';
import BuyerHeader from './components/BuyerHeader';
import BuyersDashboard from './pages/BuyersDashboard';
import Register from './pages/Register';
import RegisterModeSelection from './components/RegisterModeSelection';
import Settings from './pages/Settings';
import VoiceNavigation from './components/VoiceNavigation';
import AccessibilityPanel from './components/AccessibilityPanel';
import styles from './App.module.css';

function App() {
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isVoiceNavigationEnabled, setIsVoiceNavigationEnabled] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 100000],
    colors: []
  });
  const [isAccessibilityPanelOpen, setIsAccessibilityPanelOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const initialProducts = [
    {
      id: 1,
      name: 'Handcrafted Wooden Chair',
      price: 149.99 * 130,
      status: 'Active',
      category: 'Furniture',
      color: 'Brown',
      image: 'https://readdy.ai/api/search-image?query=A%20beautiful%20handcrafted%20wooden%20chair%20with%20intricate%20details%2C%20natural%20wood%20grain%20visible%2C%20elegant%20design%2C%20professional%20product%20photography%20on%20pure%20white%20background%2C%20high%20quality%20studio%20lighting%20showing%20texture%20and%20craftsmanship&width=300&height=200&seq=product1&orientation=landscape'
    },
    {
      id: 2,
      name: 'Organic Cotton T-Shirt',
      price: 29.99 * 130,
      status: 'Active',
      category: 'Clothing',
      color: 'White',
      image: 'https://readdy.ai/api/search-image?query=A%20high-quality%20organic%20cotton%20t-shirt%20in%20solid%20color%2C%20neatly%20folded%2C%20professional%20product%20photography%20on%20pure%20white%20background%2C%20showing%20fabric%20texture%20and%20quality%20stitching%2C%20clean%20and%20minimal%20styling&width=300&height=200&seq=product2&orientation=landscape'
    },
    {
      id: 3,
      name: 'Handmade Ceramic Vase',
      price: 79.99 * 130,
      status: 'Active',
      category: 'Home Decor',
      color: 'Blue',
      image: 'https://readdy.ai/api/search-image?query=An%20elegant%20handmade%20ceramic%20vase%20with%20unique%20glaze%20pattern%2C%20artistic%20design%2C%20professional%20product%20photography%2C%20showing%20texture%20and%20craftsmanship%2C%20high%20quality%20studio%20lighting&width=300&height=200&seq=product3&orientation=landscape'
    },
    {
      id: 4,
      name: 'Smart Watch Pro',
      price: 199.99 * 130,
      status: 'Sold Out',
      category: 'Electronics',
      color: 'Black',
      image: 'https://readdy.ai/api/search-image?query=A%20modern%20smartwatch%20with%20sleek%20design%2C%20clear%20display%20showing%20fitness%20tracking%20interface%2C%20premium%20materials%2C%20professional%20product%20photography%20on%20pure%20white%20background%2C%20high-end%20tech%20product%20appearance&width=300&height=200&seq=product4&orientation=landscape'
    },
    {
      id: 5,
      name: 'Leather Messenger Bag',
      price: 89.99 * 130,
      status: 'Active',
      category: 'Accessories',
      color: 'Brown',
      image: 'https://readdy.ai/api/search-image?query=A%20premium%20leather%20messenger%20bag%20with%20brass%20hardware%2C%20rich%20brown%20color%2C%20professional%20product%20photography%20on%20pure%20white%20background%2C%20showing%20leather%20texture%20and%20craftsmanship%20details&width=300&height=200&seq=product5&orientation=landscape'
    },
    {
      id: 6,
      name: 'Minimalist Desk Lamp',
      price: 59.99 * 130,
      status: 'Active',
      category: 'Home Decor',
      color: 'White',
      image: 'https://readdy.ai/api/search-image?query=A%20modern%20minimalist%20desk%20lamp%20with%20adjustable%20arm%2C%20clean%20lines%2C%20metallic%20finish%2C%20professional%20product%20photography%20on%20pure%20white%20background%2C%20showing%20design%20details&width=300&height=200&seq=product6&orientation=landscape'
    },
    {
      id: 7,
      name: 'Professional Camera Kit',
      price: 1299.99 * 130,
      color: 'Black',
      image: 'https://readdy.ai/api/search-image?query=professional%20camera%20kit%20with%20lens%20on%20minimalist%20white%20background%20modern%20product%20photography%20high%20end%20equipment&width=400&height=300&seq=1&orientation=landscape',
      category: 'Electronics',
      status: 'Active'
    },
    {
      id: 8,
      name: 'Ergonomic Office Chair',
      price: 299.99 * 130,
      color: 'Black',
      image: 'https://readdy.ai/api/search-image?query=ergonomic%20office%20chair%20modern%20design%20on%20minimalist%20white%20background%20professional%20product%20photography&width=400&height=300&seq=2&orientation=landscape',
      category: 'Furniture',
      status: 'Active'
    },
    {
      id: 9,
      name: 'Smart Home Security System',
      price: 449.99 * 130,
      color: 'White',
      image: 'https://readdy.ai/api/search-image?query=smart%20home%20security%20system%20modern%20design%20on%20minimalist%20white%20background%20professional%20product%20photography&width=400&height=300&seq=3&orientation=landscape',
      category: 'Smart Home',
      status: 'Active'
    },
    {
      id: 10,
      name: 'Fitness Smartwatch',
      price: 199.99 * 130,
      color: 'Blue',
      image: 'https://readdy.ai/api/search-image?query=premium%20fitness%20smartwatch%20modern%20design%20on%20minimalist%20white%20background%20professional%20product%20photography&width=400&height=300&seq=4&orientation=landscape',
      category: 'Wearables',
      status: 'Active'
    },
    {
      id: 11,
      name: 'Wireless Gaming Headset',
      price: 159.99 * 130,
      color: 'Red',
      image: 'https://readdy.ai/api/search-image?query=gaming%20headset%20with%20rgb%20lights%20modern%20design%20on%20minimalist%20white%20background%20professional%20product%20photography&width=400&height=300&seq=5&orientation=landscape',
      category: 'Gaming',
      status: 'Active'
    },
    {
      id: 12,
      name: 'Electric Standing Desk',
      price: 599.99 * 130,
      color: 'White',
      image: 'https://readdy.ai/api/search-image?query=electric%20standing%20desk%20modern%20design%20on%20minimalist%20white%20background%20professional%20product%20photography&width=400&height=300&seq=6&orientation=landscape',
      category: 'Furniture',
      status: 'Active'
    }
  ];

  const [products] = useState(initialProducts);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
  };

  const toggleHighContrastMode = () => {
    setHighContrastMode(!highContrastMode);
  };

  const increaseFontSize = () => {
    if (fontSize < 24) setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 14) setFontSize(fontSize - 2);
  };

  const toggleVoiceNavigation = () => {
    setIsVoiceNavigationEnabled(!isVoiceNavigationEnabled);
  };

  const resetAccessibilitySettings = () => {
    setHighContrastMode(false);
    setFontSize(16);
    setIsVoiceNavigationEnabled(false);
    setVoiceFeedback(false);
  };

  const toggleAccessibilityPanel = () => {
    setIsAccessibilityPanelOpen(!isAccessibilityPanelOpen);
  };

  const handleRegister = (formData) => {
    console.log('Registration successful! Form Data:', formData);
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  return (
    <Router>
      <div
        className={`${styles.appContainer} ${highContrastMode ? styles.highContrast : ''}`}
        style={{ fontFamily: 'Lexend, sans-serif', fontSize: `${fontSize}px` }}
      >
        <BuyerSidebar
          highContrastMode={highContrastMode}
          onFilterChange={handleFilterChange}
        />
        <div className={styles.mainContent}>
          <BuyerHeader
            highContrastMode={highContrastMode}
            searchQuery={searchQuery}
            onSearchQueryChange={handleSearchQueryChange}
          />
          <button
            onClick={toggleAccessibilityPanel}
            className={styles.accessibilityToggleButton}
            aria-label="Toggle accessibility settings"
          >
            <i className="fas fa-wheelchair"></i>
          </button>
          {isAccessibilityPanelOpen && (
            <AccessibilityPanel
              highContrastMode={highContrastMode}
              toggleHighContrastMode={toggleHighContrastMode}
              fontSize={fontSize}
              increaseFontSize={increaseFontSize}
              decreaseFontSize={decreaseFontSize}
              isVoiceNavigationEnabled={isVoiceNavigationEnabled}
              toggleVoiceNavigation={toggleVoiceNavigation}
              resetAccessibilitySettings={resetAccessibilitySettings}
              isOpen={isAccessibilityPanelOpen}
              setIsOpen={setIsAccessibilityPanelOpen}
            />
          )}
          <Routes>
            <Route
              path="/"
              element={
                <BuyersDashboard
                  highContrastMode={highContrastMode}
                  fontSize={fontSize}
                  products={products}
                  filters={filters}
                  searchQuery={searchQuery}
                />
              }
            />
            <Route
              path="/register"
              element={<RegisterModeSelection onModeSelect={handleModeSelect} />}
            />
            <Route
              path="/register-form"
              element={<Register onRegister={handleRegister} selectedMode={selectedMode} />}
            />
            <Route
              path="/settings"
              element={
                <Settings
                  highContrastMode={highContrastMode}
                  fontSize={fontSize}
                  setFontSize={setFontSize}
                  isVoiceNavigationEnabled={isVoiceNavigationEnabled}
                  setIsVoiceNavigationEnabled={setIsVoiceNavigationEnabled}
                  voiceFeedback={voiceFeedback}
                  setVoiceFeedback={setVoiceFeedback}
                />
              }
            />
            <Route
              path="*"
              element={<div>404 - Page Not Found</div>}
            />
          </Routes>
        </div>
      </div>
      {isVoiceNavigationEnabled && (
        <VoiceNavigation
          isVoiceNavigationEnabled={isVoiceNavigationEnabled}
        />
      )}
    </Router>
  );
}

export default App;
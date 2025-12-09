import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BuyerSidebar from './components/BuyerSidebar';
import BuyerHeader from './components/BuyerHeader';
import BuyersDashboard from './pages/BuyersDashboard';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Receipt from './pages/Receipt';
import Register from './pages/Register';
import Login from './pages/Login';
import RegisterModeSelection from './components/RegisterModeSelection';
import Settings from './pages/Settings';
import AboutUs from './pages/AboutUs';
import HowItWorks from './pages/HowItWorks';
import SafetyTips from './pages/SafetyTips';
import CategoryPage from './pages/CategoryPage'; // Added import
import VoiceNavigation from './components/VoiceNavigation';
import AccessibilityPanel from './components/AccessibilityPanel';
import { CartProvider } from './contexts/CartContext';
import { API_ENDPOINTS } from './config/api'; // Import API configuration
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
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState([]); // State for products

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

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsAuthenticated(true);
      try {
        setCurrentUser(JSON.parse(user));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const handleRegister = async (formData) => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Registration successful!');
        // Redirect to login page with success message
        window.location.href = '/login?registered=true';
      } else {
        console.error('Registration failed');
        const errorData = await response.json();
        alert(errorData.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleLogin = async (token, user) => {
    // Handle login logic here
    console.log('User logged in:', user);
    // Set authentication state
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
    setCurrentUser(user);
    // Redirect to dashboard
    window.location.href = '/';
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <Router>
      <CartProvider>
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
              isAuthenticated={isAuthenticated}
              currentUser={currentUser}
              onLogout={handleLogout}
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
                path="/cart"
                element={<Cart />}
              />
              <Route
                path="/payment"
                element={<Payment />}
              />
              <Route
                path="/receipt"
                element={<Receipt />}
              />
              <Route
                path="/login"
                element={<Login onLogin={handleLogin} />}
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
              {/* Added category route */}
              <Route
                path="/category/:category"
                element={
                  <CategoryPage
                    highContrastMode={highContrastMode}
                    fontSize={fontSize}
                  />
                }
              />
              <Route
                path="/about"
                element={<AboutUs highContrastMode={highContrastMode} />}
              />
              <Route
                path="/how-it-works"
                element={<HowItWorks highContrastMode={highContrastMode} />}
              />
              <Route
                path="/safety-tips"
                element={<SafetyTips highContrastMode={highContrastMode} />}
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
      </CartProvider>
    </Router>
  );
}

export default App;
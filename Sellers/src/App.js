import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import axios from "axios";   
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ProductListing from './pages/ProductListing';
import AddProduct from './pages/AddProduct';
import Inquiries from './pages/Inquiries';
import Settings from './pages/Settings';
import Profile from './pages/Profile'; // ✅ import profile
import VoiceNavigation from './components/VoiceNavigation';
import AccessibilityPanel from './components/AccessibilityPanel';
import Login from './pages/Login';   // ✅ import login
import Signup from './pages/Signup'; // ✅ import signup
import styles from './App.module.css';

function App() {
  const [activeNavItem, setActiveNavItem] = useState('Dashboard');
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccessibilityPanelOpen, setIsAccessibilityPanelOpen] = useState(false);
  const [isVoiceNavigationEnabled, setIsVoiceNavigationEnabled] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState(false);

  // ✅ track authentication
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch user data from API or localStorage
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("http://localhost:5000/api/profile", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setCurrentUser(userData);
            // Also update localStorage for immediate access
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            // Fallback to localStorage if API fails
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              setCurrentUser(JSON.parse(storedUser));
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback to localStorage if API fails
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
          }
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = async () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
      
      if (token) {
        try {
          const response = await fetch("http://localhost:5000/api/profile", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setCurrentUser(userData);
            // Also update localStorage for immediate access
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            // Fallback to localStorage if API fails
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              setCurrentUser(JSON.parse(storedUser));
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback to localStorage if API fails
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
          }
        }
        
        // Fetch products for the authenticated seller
        fetchSellerProducts(token);
      } else {
        setCurrentUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for high contrast toggle event from Settings
  useEffect(() => {
    const handleToggleHighContrast = (event) => {
      setHighContrastMode(event.detail);
    };

    window.addEventListener('toggleHighContrast', handleToggleHighContrast);
    return () => window.removeEventListener('toggleHighContrast', handleToggleHighContrast);
  }, []);

  // Check voice navigation preference on app load
  useEffect(() => {
    const storedVoicePref = localStorage.getItem('voiceNavigationPreference');
    if (storedVoicePref === 'enabled') {
      setIsVoiceNavigationEnabled(true);
    } else if (storedVoicePref === 'disabled') {
      setIsVoiceNavigationEnabled(false);
    }
  }, []);

  // Function to handle auto-login after signup
  const handleAutoLogin = (token, userData) => {
    localStorage.setItem("token", token);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setCurrentUser(userData);
    }
    setIsAuthenticated(true);
    
    // Fetch products for the authenticated seller
    fetchSellerProducts(token);
  };

  // ✅ Products from backend
  const [products, setProducts] = useState([]);

  const fetchSellerProducts = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/products/seller", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const productsData = await response.json();
        setProducts(productsData);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/products", newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts([...products, res.data]);
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleNavItemClick = (item) => setActiveNavItem(item);
  const toggleHighContrastMode = () => setHighContrastMode(!highContrastMode);
  const increaseFontSize = () => fontSize < 24 && setFontSize((prev) => prev + 2);
  const decreaseFontSize = () => fontSize > 14 && setFontSize((prev) => prev - 2);
  const toggleVoiceNavigation = () => {
    const newVoiceNavState = !isVoiceNavigationEnabled;
    setIsVoiceNavigationEnabled(newVoiceNavState);
    // Save preference to localStorage
    localStorage.setItem('voiceNavigationPreference', newVoiceNavState ? 'enabled' : 'disabled');
  };
  const resetAccessibilitySettings = () => {
    setHighContrastMode(false);
    setFontSize(16);
    setIsVoiceNavigationEnabled(false);
    setVoiceFeedback(false);
    // Save preference to localStorage
    localStorage.setItem('voiceNavigationPreference', 'disabled');
  };

  return (
    <Router>
      <div className={styles.appContainer} style={{ fontSize: `${fontSize}px` }}>
        <Switch>
          {/* Public Routes */}
          <Route path="/login">
            <Login onLogin={handleAutoLogin} />
          </Route>
          <Route path="/signup">
            <Signup onAutoLogin={(token, userData) => handleAutoLogin(token, userData)} />
          </Route>

          {/* Protected Routes */}
          {isAuthenticated ? (
            <>
              <Sidebar
                activeNavItem={activeNavItem}
                handleNavItemClick={handleNavItemClick}
                highContrastMode={highContrastMode}
              />

              <div
                className={`${styles.mainContent} ${
                  highContrastMode ? styles.mainContentHighContrast : ''
                }`}
              >
                <Header highContrastMode={highContrastMode} currentUser={currentUser} />

                <Switch>
                  <Route exact path="/">
                    <Dashboard highContrastMode={highContrastMode} />
                  </Route>
                  <Route path="/products">
                    <ProductListing
                      highContrastMode={highContrastMode}
                      products={products}
                      onDelete={handleDeleteProduct}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                      selectedStatus={selectedStatus}
                      setSelectedStatus={setSelectedStatus}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                    />
                  </Route>
                  <Route path="/add-product">
                    <AddProduct onAddProduct={handleAddProduct} />
                  </Route>
                  <Route path="/inquiries">
                    <Inquiries highContrastMode={highContrastMode} />
                  </Route>
                  <Route path="/settings">
                    <Settings
                      highContrastMode={highContrastMode}
                      fontSize={fontSize}
                      setFontSize={setFontSize}
                      isVoiceNavigationEnabled={isVoiceNavigationEnabled}
                      setIsVoiceNavigationEnabled={setIsVoiceNavigationEnabled}
                      voiceFeedback={voiceFeedback}
                      setVoiceFeedback={setVoiceFeedback}
                    />
                  </Route>
                  <Route path="/profile">
                    <Profile />
                  </Route>
                </Switch>
              </div>

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

              {isVoiceNavigationEnabled && (
                <VoiceNavigation 
                  isVoiceNavigationEnabled={isVoiceNavigationEnabled}
                />
              )}
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
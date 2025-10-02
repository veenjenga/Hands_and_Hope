import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from "axios";   // ✅ make sure axios is installed: npm install axios
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ProductListing from './pages/ProductListing';
import AddProduct from './pages/AddProduct';
import Inquiries from './pages/Inquiries';
import Settings from './pages/Settings';
import VoiceNavigation from './components/VoiceNavigation';
import AccessibilityPanel from './components/AccessibilityPanel';
import styles from './App.module.css';

function App() {
  const [activeNavItem, setActiveNavItem] = useState('Dashboard');
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [fontSize, setFontSize] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccessibilityPanelOpen, setIsAccessibilityPanelOpen] = useState(false);
  const [isVoiceNavigationEnabled, setIsVoiceNavigationEnabled] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState(false);

  // ✅ Products from backend
  const [products, setProducts] = useState([]);

  // Fetch products from backend on load
  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  // Add product (send to backend)
  const handleAddProduct = async (newProduct) => {
    try {
      const res = await axios.post("http://localhost:5000/api/products", newProduct);
      setProducts([...products, res.data]); // append the new one
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Accessibility controls
  const handleNavItemClick = (item) => setActiveNavItem(item);
  const toggleHighContrastMode = () => setHighContrastMode(!highContrastMode);
  const increaseFontSize = () => fontSize < 1.5 && setFontSize((prev) => prev + 0.1);
  const decreaseFontSize = () => fontSize > 0.8 && setFontSize((prev) => prev - 0.1);
  const toggleVoiceNavigation = () => setIsVoiceNavigationEnabled(!isVoiceNavigationEnabled);
  const resetAccessibilitySettings = () => {
    setHighContrastMode(false);
    setFontSize(1);
    setIsVoiceNavigationEnabled(false);
    setVoiceFeedback(false);
  };

  return (
    <Router>
      <div className={styles.appContainer} style={{ fontSize: `${fontSize}rem` }}>
        {/* Sidebar */}
        <Sidebar
          activeNavItem={activeNavItem}
          handleNavItemClick={handleNavItemClick}
          highContrastMode={highContrastMode}
        />

        {/* Main content */}
        <div
          className={`${styles.mainContent} ${
            highContrastMode ? styles.mainContentHighContrast : ''
          }`}
        >
          <Header highContrastMode={highContrastMode} />

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
                fontSize={fontSize * 16}
                setFontSize={(newSize) => setFontSize(newSize / 16)}
                isVoiceNavigationEnabled={isVoiceNavigationEnabled}
                setIsVoiceNavigationEnabled={setIsVoiceNavigationEnabled}
                voiceFeedback={voiceFeedback}
                setVoiceFeedback={setVoiceFeedback}
              />
            </Route>
          </Switch>
        </div>

        {/* Accessibility Panel */}
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
      </div>

      {isVoiceNavigationEnabled && (
        <VoiceNavigation isVoiceNavigationEnabled={isVoiceNavigationEnabled} />
      )}
    </Router>
  );
}

export default App;

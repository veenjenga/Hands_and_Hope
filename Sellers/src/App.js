import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ProductListing from './pages/ProductListing';
import AddProduct from './pages/AddProduct';
import Inquiries from './pages/Inquiries';
import Settings from './pages/Settings'; // Import the new Settings page
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
  const [voiceFeedback, setVoiceFeedback] = useState(false); // New state for voice feedback

  const initialProducts = [
    {
      id: 1,
      name: 'Handcrafted Wooden Chair',
      price: '$149.99',
      status: 'Active',
      category: 'Furniture',
      image: 'https://readdy.ai/api/search-image?query=A%20beautiful%20handcrafted%20wooden%20chair%20with%20intricate%20details%2C%20natural%20wood%20grain%20visible%2C%20elegant%20design%2C%20professional%20product%20photography%20on%20pure%20white%20background%2C%20high%20quality%20studio%20lighting%20showing%20texture%20and%20craftsmanship&width=300&height=200&seq=product1&orientation=landscape'
    },
    {
      id: 2,
      name: 'Organic Cotton T-Shirt',
      price: '$29.99',
      status: 'Active',
      category: 'Clothing',
      image: 'https://readdy.ai/api/search-image?query=A%20high-quality%20organic%20cotton%20t-shirt%20in%20solid%20color%2C%20neatly%20folded%2C%20professional%20product%20photography%20on%20pure%20white%20background%2C%20showing%20fabric%20texture%20and%20quality%20stitching%2C%20clean%20and%20minimal%20styling&width=300&height=200&seq=product2&orientation=landscape'
    },
    {
      id: 3,
      name: 'Handmade Ceramic Vase',
      price: '$79.99',
      status: 'Draft',
      category: 'Home Decor',
      image: 'https://readdy.ai/api/search-image?query=An%20elegant%20handmade%20ceramic%20vase%20with%20unique%20glaze%20pattern%2C%20artistic%20design%2C%20professional%20product%20photography%20on%20pure%20white%20background%2C%20showing%20texture%20and%20craftsmanship%2C%20high%20quality%20studio%20lighting&width=300&height=200&seq=product3&orientation=landscape'
    },
    {
      id: 4,
      name: 'Smart Watch Pro',
      price: '$199.99',
      status: 'Sold Out',
      category: 'Electronics',
      image: 'https://readdy.ai/api/search-image?query=A%20modern%20smartwatch%20with%20sleek%20design%2C%20clear%20display%20showing%20fitness%20tracking%20interface%2C%20premium%20materials%2C%20professional%20product%20photography%20on%20pure%20white%20background%2C%20high-end%20tech%20product%20appearance&width=300&height=200&seq=product4&orientation=landscape'
    },
    {
      id: 5,
      name: 'Leather Messenger Bag',
      price: '$89.99',
      status: 'Active',
      category: 'Accessories',
      image: 'https://readdy.ai/api/search-image?query=A%20premium%20leather%20messenger%20bag%20with%20brass%20hardware%2C%20rich%20brown%20color%2C%20professional%20product%20photography%20on%20pure%20white%20background%2C%20showing%20leather%20texture%20and%20craftsmanship%20details&width=300&height=200&seq=product5&orientation=landscape'
    },
    {
      id: 6,
      name: 'Minimalist Desk Lamp',
      price: '$59.99',
      status: 'Active',
      category: 'Home Decor',
      image: 'https://readdy.ai/api/search-image?query=A%20modern%20minimalist%20desk%20lamp%20with%20adjustable%20arm%2C%20clean%20lines%2C%20metallic%20finish%2C%20professional%20product%20photography%20on%20pure%20white%20background%2C%20showing%20design%20details&width=300&height=200&seq=product6&orientation=landscape'
    }
  ];

  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const handleNavItemClick = (item) => {
    setActiveNavItem(item);
  };

  const toggleHighContrastMode = () => {
    setHighContrastMode(!highContrastMode);
  };

  const increaseFontSize = () => {
    if (fontSize < 1.5) {
      setFontSize((prev) => prev + 0.1);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 0.8) {
      setFontSize((prev) => prev - 0.1);
    }
  };

  const toggleVoiceNavigation = () => {
    setIsVoiceNavigationEnabled(!isVoiceNavigationEnabled);
  };

  const resetAccessibilitySettings = () => {
    setHighContrastMode(false);
    setFontSize(1);
    setIsVoiceNavigationEnabled(false);
    setVoiceFeedback(false); // Reset voice feedback as well
  };

  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  return (
    <Router>
      <div className={styles.appContainer} style={{ fontSize: `${fontSize}rem` }}>
        {/* Left Sidebar */}
        <Sidebar
          activeNavItem={activeNavItem}
          handleNavItemClick={handleNavItemClick}
          highContrastMode={highContrastMode}
        />

        {/* Main Content */}
        <div
          className={`${styles.mainContent} ${
            highContrastMode ? styles.mainContentHighContrast : ''
          }`}
        >
          {/* Top Navigation */}
          <Header highContrastMode={highContrastMode} />

          {/* Main Content Area */}
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
                fontSize={fontSize * 16} // Convert rem to px for Settings
                setFontSize={(newSize) => setFontSize(newSize / 16)} // Convert px back to rem
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
      {isVoiceNavigationEnabled && <VoiceNavigation isVoiceNavigationEnabled={isVoiceNavigationEnabled} />}
    </Router>
  );
}

export default App;
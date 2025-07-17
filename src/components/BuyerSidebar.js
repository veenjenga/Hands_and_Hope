import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './BuyerSidebar.module.css';

function BuyerSidebar({ highContrastMode, onFilterChange }) {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedColors, setSelectedColors] = useState([]);

  const categories = [
    "Electronics",
    "Furniture",
    "Smart Home",
    "Wearables",
    "Gaming",
    "Audio"
  ];

  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow'];

  const handleCategoryChange = (category, checked) => {
    const newCategories = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter((c) => c !== category);
    setSelectedCategories(newCategories);
    onFilterChange({ categories: newCategories, priceRange, colors: selectedColors });
  };

  const handlePriceRangeChange = (e, index) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = Number(e.target.value);
    if (index === 0 && newPriceRange[0] > newPriceRange[1]) {
      newPriceRange[0] = newPriceRange[1];
    } else if (index === 1 && newPriceRange[1] < newPriceRange[0]) {
      newPriceRange[1] = newPriceRange[0];
    }
    setPriceRange(newPriceRange);
    onFilterChange({ categories: selectedCategories, priceRange: newPriceRange, colors: selectedColors });
  };

  const handleColorChange = (color) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    setSelectedColors(newColors);
    onFilterChange({ categories: selectedCategories, priceRange, colors: newColors });
  };

  return (
    <div className={`${styles.sidebar} ${highContrastMode ? styles.highContrast : ''}`}>
      <nav className={styles.nav}>
        <div className={styles.filterSection}>
          {/* Home Button */}
          <div className={styles.filterGroup}>
            <Link
              to="/"
              className={`${styles.filterHeader} ${styles.navLink} ${highContrastMode ? styles.navLinkHighContrast : ''}`}
            >
              <h3 className={styles.homeHeader}>
                <i className="fas fa-home"></i>
                <span>Home</span>
              </h3>
            </Link>
          </div>
          {/* Product Category Section */}
          <div className={styles.filterGroup}>
            <div
              className={styles.filterHeader}
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              <h3>
                <i className="fas fa-list"></i>
                <span>Product Category</span>
              </h3>
              <i className={`fas fa-chevron-${categoryOpen ? 'up' : 'down'}`}></i>
            </div>
            {categoryOpen && (
              <div className={styles.filterContent}>
                {categories.map((category) => (
                  <label key={category} className={styles.filterOption}>
                    <div className={styles.checkboxContainer}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        onChange={(e) => handleCategoryChange(category, e.target.checked)}
                      />
                      <div className={styles.customCheckbox}></div>
                      <i className={`fas fa-check ${styles.checkIcon}`}></i>
                    </div>
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          {/* Price Range Section */}
          <div className={styles.filterGroup}>
            <div
              className={styles.filterHeader}
              onClick={() => setPriceOpen(!priceOpen)}
            >
              <h3>
                <i className="fas fa-tag"></i>
                <span>Price Range</span>
              </h3>
              <i className={`fas fa-chevron-${priceOpen ? 'up' : 'down'}`}></i>
            </div>
            {priceOpen && (
              <div className={styles.filterContent}>
                <div className={styles.priceRangeContainer}>
                  <div className={styles.priceRangeValues}>
                    <span>{priceRange[0]} Ksh</span>
                    <span>{priceRange[1]} Ksh</span>
                  </div>
                  <div className={styles.sliderContainer}>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(e, 0)}
                      className={styles.priceSlider}
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(e, 1)}
                      className={styles.priceSlider}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Color Section */}
          <div className={styles.filterGroup}>
            <div
              className={styles.filterHeader}
              onClick={() => setColorOpen(!colorOpen)}
            >
              <h3>
                <i className="fas fa-palette"></i>
                <span>Color</span>
              </h3>
              <i className={`fas fa-chevron-${colorOpen ? 'up' : 'down'}`}></i>
            </div>
            {colorOpen && (
              <div className={styles.colorGrid}>
                {colors.map((color) => (
                  <div
                    key={color}
                    className={`${styles.colorButton} ${
                      selectedColors.includes(color) ? styles.colorButtonSelected : ''
                    }`}
                    onClick={() => handleColorChange(color)}
                    style={{
                      backgroundColor: color.toLowerCase(),
                      border: color.toLowerCase() === 'white' ? '1px solid rgba(255,255,255,0.5)' : 'none'
                    }}
                    title={color}
                  >
                    {selectedColors.includes(color) && (
                      <i className={`fas fa-check ${styles.colorCheckIcon}`}></i>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default BuyerSidebar;
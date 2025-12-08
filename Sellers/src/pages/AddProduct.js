// src/pages/AddProduct.js
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './AddProduct.module.css';

function AddProduct({ onAddProduct }) {
  const history = useHistory();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isVoiceNavActive, setIsVoiceNavActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [voicePrompt, setVoicePrompt] = useState('');

  // Check if voice navigation is enabled
  useEffect(() => {
    const voiceNavPref = localStorage.getItem('voiceNavigationPreference');
    setIsVoiceNavActive(voiceNavPref === 'enabled');
    
    // When component mounts and voice nav is active, prompt user
    if (voiceNavPref === 'enabled') {
      setVoicePrompt('What product would you like to list? Please describe it to me.');
    }
  }, []);

  // Handle voice command updates
  const handleVoiceFieldUpdate = (field, value) => {
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'price':
        setPrice(value);
        break;
      case 'category':
        setCategory(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'image':
        setImage(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Prepare product data
    const productData = {
      name,
      price: parseFloat(price),
      category,
      image: image || 'https://via.placeholder.com/300x200',
      description
    };
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required. Please log in.');
        setIsSaving(false);
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        const newProduct = await response.json();
        // onAddProduct callback for any additional handling
        onAddProduct(newProduct);
        // Navigate to products page
        history.push('/products');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to add product'}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.addProduct}>
      <h2>Add New Product</h2>
      {isVoiceNavActive && (
        <div className={styles.voiceHelp}>
          <p>Voice Navigation Active: {voicePrompt}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            step="0.01"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            className={styles.textarea}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="image">Image URL</label>
          <input
            type="url"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          {isVoiceNavActive && (
            <button 
              type="button" 
              className={styles.voiceCameraButton}
              onClick={() => {
                // This would trigger the voice command to open camera
                if (window.annyang) {
                  // Simulate voice command
                  window.annyang.trigger('take a photo');
                }
              }}
            >
              Take Photo with Voice
            </button>
          )}
        </div>
        <button 
          type="submit" 
          className={styles.submit}
          disabled={isSaving}
        >
          {isSaving ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
// src/pages/AddProduct.js
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import productNLP from '../utils/productNLP';
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

  // Get categories from productNLP utility
  const categories = productNLP.getCategories();

  // Check if voice navigation is enabled
  useEffect(() => {
    const voiceNavPref = localStorage.getItem('voiceNavigationPreference');
    setIsVoiceNavActive(voiceNavPref === 'enabled');
    
    // If voice navigation is enabled, start the product listing flow
    if (voiceNavPref === 'enabled') {
      // Trigger the voice navigation to start asking questions
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('startProductListing'));
      }, 1000);
    }
  }, []);

  // Handle voice command updates
  useEffect(() => {
    const handleVoiceUpdate = (event) => {
      const { field, value } = event.detail;
      handleVoiceFieldUpdate(field, value);
    };

    window.addEventListener('voiceFieldUpdate', handleVoiceUpdate);
    return () => {
      window.removeEventListener('voiceFieldUpdate', handleVoiceUpdate);
    };
  }, []);

  const handleVoiceFieldUpdate = (field, value) => {
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'price':
        setPrice(value);
        // After setting price, check if we should ask for category
        if (!category) {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('voicePrompt', { 
              detail: { 
                message: `What category should the product be in? Available categories are: ${categories.join(', ')}.` 
              } 
            }));
          }, 1000);
        }
        break;
      case 'category':
        // Validate category
        const matchedCategory = productNLP.matchCategory(value);
        if (matchedCategory) {
          setCategory(matchedCategory);
          // After setting category, ask for description
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('voicePrompt', { 
              detail: { 
                message: "Please provide a description for your product, or say 'skip' to skip this step." 
              } 
            }));
          }, 1000);
        }
        break;
      case 'description':
        setDescription(value);
        // After setting description, ask for image
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('voicePrompt', { 
            detail: { 
              message: "Would you like to upload an image of your product? Say 'take photo' to activate the camera or 'skip' to list without an image." 
            } 
          }));
        }, 1000);
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
        
        // Announce success with voice if enabled
        if (isVoiceNavActive) {
          window.dispatchEvent(new CustomEvent('voicePrompt', { 
            detail: { 
              message: `Successfully added product ${name} for $${price}.` 
            } 
          }));
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to add product'}`);
        
        // Announce error with voice if enabled
        if (isVoiceNavActive) {
          window.dispatchEvent(new CustomEvent('voicePrompt', { 
            detail: { 
              message: `Error adding product: ${errorData.error || 'Failed to add product'}.` 
            } 
          }));
        }
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Network error. Please try again.');
      
      // Announce error with voice if enabled
      if (isVoiceNavActive) {
        window.dispatchEvent(new CustomEvent('voicePrompt', { 
          detail: { 
            message: "Network error. Please try again." 
          } 
        }));
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.addProduct}>
      <div className={styles.formContainer}>
        <h2>Add New Product</h2>
        {isVoiceNavActive && (
          <div className={styles.voiceHelp}>
            <p>Voice Navigation Active: I'm ready to help you list your product. Just tell me about it!</p>
            <p>Say something like "I want to sell a blue wireless headphone" and I'll ask for more details.</p>
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
            <label htmlFor="price">Price ($)</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              step="0.01"
              min="0"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className={styles.selectInput}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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
    </div>
  );
}

export default AddProduct;
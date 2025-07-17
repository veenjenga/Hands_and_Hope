// src/pages/AddProduct.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './AddProduct.module.css';

function AddProduct({ onAddProduct }) {
  const history = useHistory();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(),
      name,
      price: `$${parseFloat(price).toFixed(2)}`,
      status: 'Active',
      category,
      image: image || 'https://via.placeholder.com/300x200',
    };
    onAddProduct(newProduct);
    history.push('/products');
  };

  return (
    <div className={styles.addProduct}>
      <h2>Add New Product</h2>
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
          <label htmlFor="image">Image URL</label>
          <input
            type="url"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <button type="submit" className={styles.submit}>
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
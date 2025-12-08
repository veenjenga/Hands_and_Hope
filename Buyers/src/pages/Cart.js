import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Cart.module.css';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, parseInt(newQuantity));
  };

  const handleCheckout = () => {
    // Redirect to registration/login page
    navigate('/register');
  };

  if (cartItems.length === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Your Shopping Cart</h1>
          <div className={styles.emptyCart}>
            <i className="fas fa-shopping-cart fa-3x"></i>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/" className={styles.continueShoppingButton}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Your Shopping Cart</h1>
        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <img src={item.image} alt={item.name} />
                </div>
                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemCategory}>{item.category}</p>
                </div>
                <div className={styles.itemPrice}>
                  {item.price.toLocaleString('en-KE')} Ksh
                </div>
                <div className={styles.itemQuantity}>
                  <label htmlFor={`quantity-${item.id}`}>Qty:</label>
                  <select
                    id={`quantity-${item.id}`}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    className={styles.quantitySelect}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.itemTotal}>
                  {(item.price * item.quantity).toLocaleString('en-KE')} Ksh
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className={styles.removeButton}
                  aria-label="Remove item"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
          <div className={styles.cartSummary}>
            <div className={styles.summaryBox}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              <div className={styles.summaryRow}>
                <span>Total Items:</span>
                <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>{getCartTotal().toLocaleString('en-KE')} Ksh</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total:</span>
                <span>{getCartTotal().toLocaleString('en-KE')} Ksh</span>
              </div>
              <button 
                onClick={handleCheckout}
                className={styles.checkoutButton}
              >
                Proceed to Checkout
              </button>
              <Link to="/" className={styles.continueShoppingLink}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Cart;
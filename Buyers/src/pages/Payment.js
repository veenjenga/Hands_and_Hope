import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import styles from './Cart.module.css';

function Payment() {
  const { cartItems, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [deliveryOption, setDeliveryOption] = useState('current');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [customAddress, setCustomAddress] = useState('');

  const handlePayment = () => {
    // Process payment logic here
    // For now, we'll just redirect to a receipt page
    navigate('/receipt', { 
      state: { 
        deliveryOption, 
        paymentMethod, 
        customAddress,
        total: getCartTotal(),
        items: cartItems
      } 
    });
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Payment & Delivery</h1>
        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            <div className={styles.paymentSection}>
              <h2>Delivery Options</h2>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="delivery"
                    value="current"
                    checked={deliveryOption === 'current'}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                    className={styles.radioInput}
                  />
                  Deliver to current address
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="delivery"
                    value="custom"
                    checked={deliveryOption === 'custom'}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                    className={styles.radioInput}
                  />
                  Deliver to a different address
                </label>
              </div>
              
              {deliveryOption === 'custom' && (
                <div className={styles.formGroup}>
                  <label htmlFor="address">Delivery Address</label>
                  <textarea
                    id="address"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    className={styles.textarea}
                    placeholder="Enter your delivery address"
                    rows="4"
                  />
                </div>
              )}
            </div>
            
            <div className={styles.paymentSection}>
              <h2>Payment Method</h2>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="payment"
                    value="mpesa"
                    checked={paymentMethod === 'mpesa'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={styles.radioInput}
                  />
                  M-Pesa
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={styles.radioInput}
                  />
                  Credit/Debit Card
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={styles.radioInput}
                  />
                  PayPal
                </label>
              </div>
            </div>
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
                onClick={handlePayment}
                className={styles.checkoutButton}
              >
                Pay Now
              </button>
              <button 
                onClick={() => navigate('/cart')}
                className={styles.backToCartButton}
              >
                <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Payment;
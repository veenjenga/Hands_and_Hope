import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import styles from './Cart.module.css';

function Receipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3); // 3 days countdown

  const { deliveryOption, paymentMethod, customAddress, total, items } = location.state || {};

  // Simulate countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Function to generate and download PDF receipt
  const downloadReceipt = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(22);
    doc.text("Payment Receipt", 105, 20, null, null, "center");
    
    // Add company info
    doc.setFontSize(12);
    doc.text("Hands and Hope", 105, 30, null, null, "center");
    doc.text("Thank you for your purchase!", 105, 37, null, null, "center");
    
    // Add order details
    doc.setFontSize(14);
    doc.text("Order Details:", 20, 50);
    
    doc.setFontSize(10);
    doc.text(`Order Number: #${Math.floor(Math.random() * 1000000)}`, 20, 60);
    doc.text(`Order Date: ${new Date().toLocaleDateString()}`, 20, 67);
    doc.text(`Estimated Delivery: ${countdown} day${countdown !== 1 ? 's' : ''}`, 20, 74);
    
    // Add delivery information
    doc.setFontSize(14);
    doc.text("Delivery Information:", 20, 90);
    
    doc.setFontSize(10);
    doc.text(`Delivery Option: ${deliveryOption === 'current' ? 'Current Address' : 'Custom Address'}`, 20, 100);
    if (deliveryOption === 'custom') {
      doc.text(`Delivery Address: ${customAddress}`, 20, 107);
    }
    doc.text(`Payment Method: ${paymentMethod.toUpperCase()}`, 20, deliveryOption === 'custom' ? 114 : 107);
    
    // Add items header
    doc.setFontSize(14);
    doc.text("Items Purchased:", 20, 130);
    
    // Add items
    doc.setFontSize(10);
    let yPos = 140;
    items.forEach((item, index) => {
      doc.text(`${item.name} (x${item.quantity})`, 20, yPos);
      doc.text(`${(item.price * item.quantity).toLocaleString('en-KE')} Ksh`, 150, yPos);
      yPos += 7;
    });
    
    // Add total
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Paid: ${total.toLocaleString('en-KE')} Ksh`, 150, yPos + 10);
    
    // Save the PDF
    doc.save("receipt.pdf");
  };

  if (!location.state) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.emptyCart}>
            <i className="fas fa-exclamation-circle fa-3x"></i>
            <h2>No Payment Data</h2>
            <p>It seems you haven't completed a payment yet.</p>
            <button 
              onClick={() => navigate('/')}
              className={styles.continueShoppingButton}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Payment Receipt</h1>
        <div className={styles.receiptContainer}>
          <div className={styles.receiptHeader}>
            <i className="fas fa-check-circle fa-3x" style={{color: '#28a745'}}></i>
            <h2>Payment Successful!</h2>
            <p>Thank you for your purchase. Your order has been confirmed.</p>
          </div>
          
          <div className={styles.receiptContent}>
            <div className={styles.receiptSection}>
              <h3>Order Details</h3>
              <div className={styles.orderInfo}>
                <p><strong>Order Number:</strong> #{Math.floor(Math.random() * 1000000)}</p>
                <p><strong>Order Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Estimated Delivery:</strong> {countdown} day{countdown !== 1 ? 's' : ''}</p>
              </div>
            </div>
            
            <div className={styles.receiptSection}>
              <h3>Delivery Information</h3>
              <div className={styles.deliveryInfo}>
                <p><strong>Delivery Option:</strong> {deliveryOption === 'current' ? 'Current Address' : 'Custom Address'}</p>
                {deliveryOption === 'custom' && (
                  <p><strong>Delivery Address:</strong> {customAddress}</p>
                )}
                <p><strong>Payment Method:</strong> {paymentMethod.toUpperCase()}</p>
              </div>
            </div>
            
            <div className={styles.receiptSection}>
              <h3>Items Purchased</h3>
              <div className={styles.itemsList}>
                {items.map((item, index) => (
                  <div key={index} className={styles.receiptItem}>
                    <span>{item.name} (x{item.quantity})</span>
                    <span>{(item.price * item.quantity).toLocaleString('en-KE')} Ksh</span>
                  </div>
                ))}
              </div>
              <div className={styles.receiptTotal}>
                <strong>Total Paid: {total.toLocaleString('en-KE')} Ksh</strong>
              </div>
            </div>
          </div>
          
          <div className={styles.receiptFooter}>
            <p>You will receive a confirmation email shortly.</p>
            <p>If you have any questions, please contact our support team.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
              <button 
                onClick={downloadReceipt}
                className={styles.continueShoppingButton}
                style={{ backgroundColor: '#28a745' }}
              >
                <i className="fas fa-download"></i> Download Receipt
              </button>
              <button 
                onClick={() => navigate('/')}
                className={styles.continueShoppingButton}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Receipt;
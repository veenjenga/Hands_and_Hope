// src/pages/Inquiries.js
import React, { useState } from 'react';
import styles from './Inquiries.module.css';

function Inquiries({ highContrastMode }) {
  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      productName: "Wireless Headphones",
      contactMethod: "WhatsApp",
      timestamp: "Today, 10:24 AM",
      status: "New"
    },
    {
      id: 2,
      productName: "Smart Watch Series 5",
      contactMethod: "Call",
      timestamp: "Today, 9:15 AM",
      status: "New"
    },
    {
      id: 3,
      productName: "Bluetooth Speaker",
      contactMethod: "SMS",
      timestamp: "Yesterday, 4:30 PM",
      status: "Contacted"
    },
    {
      id: 4,
      productName: "Laptop Stand",
      contactMethod: "WhatsApp",
      timestamp: "Yesterday, 2:45 PM",
      status: "Contacted"
    },
    {
      id: 5,
      productName: "Wireless Charger",
      contactMethod: "Call",
      timestamp: "Apr 14, 3:20 PM",
      status: "New"
    },
    {
      id: 6,
      productName: "Ergonomic Keyboard",
      contactMethod: "SMS",
      timestamp: "Apr 14, 1:10 PM",
      status: "Contacted"
    }
  ]);

  const markAsContacted = (id) => {
    setInquiries(inquiries.map(inquiry => 
      inquiry.id === id ? { ...inquiry, status: "Contacted" } : inquiry
    ));
  };

  const deleteInquiry = (id) => {
    setInquiries(inquiries.filter(inquiry => inquiry.id !== id));
  };

  const getIconForContactMethod = (method) => {
    switch (method) {
      case "WhatsApp":
        return <i className="fa fa-whatsapp mr-2"></i>;
      case "Call":
        return <i className="fa fa-phone mr-2"></i>;
      case "SMS":
        return <i className="fa fa-comment mr-2"></i>;
      default:
        return <i className="fa fa-envelope mr-2"></i>;
    }
  };

  return (
    <main className={`${styles.inquiries} ${highContrastMode ? styles.highContrast : ''}`}>
      {/* Inquiries Header Section */}
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Your Inquiries</h1>
        <span className={styles.inquiryCount}>
          {inquiries.length} Total
        </span>
      </div>

      {/* Inquiries Grid */}
      <div className={styles.inquiryGrid}>
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className={styles.inquiryCard}>
            <div className={styles.inquiryDetails}>
              <div className={styles.inquiryHeader}>
                <h3 className={styles.productName}>{inquiry.productName}</h3>
                <span className={`${styles.status} ${inquiry.status === 'New' ? styles.new : styles.contacted}`}>
                  {inquiry.status}
                </span>
              </div>
              <div className={styles.contactMethod}>
                {getIconForContactMethod(inquiry.contactMethod)}
                <span>{inquiry.contactMethod}</span>
              </div>
              <p className={styles.timestamp}>{inquiry.timestamp}</p>
              <div className={styles.actions}>
                {inquiry.status === "New" && (
                  <button
                    className={styles.markButton}
                    onClick={() => markAsContacted(inquiry.id)}
                  >
                    <i className="fa fa-check"></i>
                    Mark as Contacted
                  </button>
                )}
                <button
                  className={styles.deleteButton}
                  onClick={() => deleteInquiry(inquiry.id)}
                >
                  <i className="fa fa-trash"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Inquiries;
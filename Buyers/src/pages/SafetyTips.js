import React from 'react';
import styles from './BuyersDashboard.module.css';

function SafetyTips({ highContrastMode }) {
  const tips = [
    {
      category: "Before You Buy",
      tips: [
        "Research the seller thoroughly by checking their ratings, reviews, and profile information",
        "Ask detailed questions about the product, shipping times, and return policies before purchasing",
        "Use the platform's messaging system for all communication - never share personal contact information",
        "Verify product authenticity by requesting additional photos or documentation if needed",
        "Compare prices with similar products to ensure you're getting a fair deal"
      ]
    },
    {
      category: "Payment Security",
      tips: [
        "Always use the platform's secure payment system - never send money through external channels",
        "Keep records of all transactions, including screenshots of payment confirmations",
        "Be wary of sellers who insist on unusual payment methods or rush payments",
        "Understand the refund and dispute resolution process before making a purchase",
        "Check if the platform offers buyer protection and understand what it covers"
      ]
    },
    {
      category: "Shipping & Delivery",
      tips: [
        "Request tracking information for all shipments valued over a certain amount",
        "Inspect packages upon delivery and note any damage before signing for them",
        "Communicate with sellers immediately if there are shipping delays or issues",
        "Understand customs fees and import duties that may apply to international purchases",
        "Keep all shipping documents and correspondence for future reference"
      ]
    },
    {
      category: "Recognizing Scams",
      tips: [
        "Be suspicious of deals that seem too good to be true",
        "Watch out for sellers who pressure you to act quickly or make immediate decisions",
        "Never provide personal financial information like bank account details or credit card numbers directly to sellers",
        "Be cautious of sellers who refuse to use the platform's built-in communication tools",
        "Report suspicious activity to platform administrators immediately"
      ]
    }
  ];

  const dosAndDonts = [
    {
      do: "Communicate through the platform's messaging system",
      dont: "Share personal phone numbers, emails, or social media accounts"
    },
    {
      do: "Use secure payment methods provided by the platform",
      dont: "Send money through wire transfers, gift cards, or cash"
    },
    {
      do: "Ask for detailed product photos and descriptions",
      dont: "Make purchases based solely on stock images"
    },
    {
      do: "Check seller ratings and reviews before buying",
      dont: "Ignore negative feedback or complaints about sellers"
    }
  ];

  return (
    <main className={`${styles.main} ${highContrastMode ? styles.highContrast : ''}`}>
      <div className={styles.container}>
        <h1 className={styles.sectionTitle}>Safety Tips for Buyers</h1>
        <div style={{ 
          background: '#fff', 
          padding: '2rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <p style={{ 
            fontSize: '1.125rem', 
            lineHeight: '1.6', 
            color: highContrastMode ? '#fff' : '#333',
            marginBottom: '2rem'
          }}>
            Your safety is our top priority. Follow these essential tips to protect yourself when shopping on Hands and Hope. 
            By staying informed and vigilant, you can enjoy a secure and satisfying shopping experience.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            {tips.map((section, index) => (
              <div 
                key={index} 
                style={{ 
                  background: highContrastMode ? '#000' : '#f8f9fa', 
                  border: highContrastMode ? '1px solid #fff' : '1px solid #eee',
                  borderRadius: '0.5rem',
                  padding: '1.5rem'
                }}
              >
                <h2 style={{ 
                  color: highContrastMode ? '#fff' : '#1a237e', 
                  marginBottom: '1rem',
                  paddingBottom: '0.5rem',
                  borderBottom: highContrastMode ? '1px solid #fff' : '1px solid #eee'
                }}>
                  {section.category}
                </h2>
                <ul style={{ 
                  paddingLeft: '1.5rem', 
                  color: highContrastMode ? '#ccc' : '#666',
                  lineHeight: '1.8'
                }}>
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex}>{tip}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <h2 style={{ 
            color: highContrastMode ? '#fff' : '#1a237e', 
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            Do's and Don'ts
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1rem',
            marginBottom: '3rem'
          }}>
            {dosAndDonts.map((item, index) => (
              <div 
                key={index} 
                style={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem'
                }}
              >
                <div style={{ 
                  background: highContrastMode ? '#000' : '#e8f5e9', 
                  border: highContrastMode ? '1px solid #fff' : '1px solid #a5d6a7',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  borderLeft: '4px solid #4caf50'
                }}>
                  <h3 style={{ 
                    color: highContrastMode ? '#fff' : '#2e7d32',
                    margin: '0 0 0.5rem 0',
                    fontSize: '1rem'
                  }}>
                    <i className="fas fa-check-circle" style={{ marginRight: '0.5rem' }}></i> Do
                  </h3>
                  <p style={{ 
                    color: highContrastMode ? '#ccc' : '#333',
                    margin: 0,
                    fontSize: '0.9rem'
                  }}>
                    {item.do}
                  </p>
                </div>
                
                <div style={{ 
                  background: highContrastMode ? '#000' : '#ffebee', 
                  border: highContrastMode ? '1px solid #fff' : '1px solid #ef9a9a',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  borderLeft: '4px solid #f44336'
                }}>
                  <h3 style={{ 
                    color: highContrastMode ? '#fff' : '#c62828',
                    margin: '0 0 0.5rem 0',
                    fontSize: '1rem'
                  }}>
                    <i className="fas fa-times-circle" style={{ marginRight: '0.5rem' }}></i> Don't
                  </h3>
                  <p style={{ 
                    color: highContrastMode ? '#ccc' : '#333',
                    margin: 0,
                    fontSize: '0.9rem'
                  }}>
                    {item.dont}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ 
            padding: '1.5rem', 
            background: highContrastMode ? '#000' : '#fff3e0', 
            borderRadius: '0.5rem',
            border: highContrastMode ? '1px solid #fff' : '1px solid #ffcc80'
          }}>
            <h2 style={{ 
              color: highContrastMode ? '#fff' : '#e65100', 
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
              Report Suspicious Activity
            </h2>
            <p style={{ 
              textAlign: 'center',
              color: highContrastMode ? '#ccc' : '#333',
              lineHeight: '1.6'
            }}>
              If you encounter any suspicious behavior, fraudulent listings, or feel unsafe during a transaction, 
              please contact our support team immediately at <strong>support@handsandhope.com</strong> or use the 
              reporting feature in your account settings. We're here to help 24/7.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SafetyTips;
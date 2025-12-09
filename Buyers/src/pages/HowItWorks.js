import React from 'react';
import styles from './BuyersDashboard.module.css';

function HowItWorks({ highContrastMode }) {
  const steps = [
    {
      title: "Browse Products",
      description: "Explore our wide selection of handcrafted goods from sellers around the world. Use filters to find exactly what you're looking for.",
      icon: "fas fa-search"
    },
    {
      title: "Connect with Sellers",
      description: "Communicate directly with sellers to ask questions, negotiate prices, or request customizations before purchasing.",
      icon: "fas fa-comments"
    },
    {
      title: "Secure Payment",
      description: "Complete your purchase through our secure payment system. Your payment is held until you confirm receipt of your order.",
      icon: "fas fa-shield-alt"
    },
    {
      title: "Track Your Order",
      description: "Monitor your shipment status and communicate with sellers throughout the delivery process.",
      icon: "fas fa-truck"
    },
    {
      title: "Receive & Review",
      description: "Once you receive your items, confirm delivery and leave feedback to help other buyers make informed decisions.",
      icon: "fas fa-check-circle"
    }
  ];

  return (
    <main className={`${styles.main} ${highContrastMode ? styles.highContrast : ''}`}>
      <div className={styles.container}>
        <h1 className={styles.sectionTitle}>How Hands and Hope Works</h1>
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
            Hands and Hope connects buyers with trusted sellers worldwide through a simple five-step process. Our platform ensures 
            secure transactions and fosters direct communication between buyers and sellers for the best shopping experience.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {steps.map((step, index) => (
              <div 
                key={index} 
                style={{ 
                  background: highContrastMode ? '#000' : '#f8f9fa', 
                  border: highContrastMode ? '1px solid #fff' : '1px solid #eee',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}
              >
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  backgroundColor: '#1a237e', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: '#fff',
                  fontSize: '1.5rem'
                }}>
                  <i className={step.icon}></i>
                </div>
                <h3 style={{ 
                  color: highContrastMode ? '#fff' : '#1a237e', 
                  marginBottom: '1rem' 
                }}>
                  Step {index + 1}: {step.title}
                </h3>
                <p style={{ 
                  color: highContrastMode ? '#ccc' : '#666',
                  lineHeight: '1.6'
                }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          
          <div style={{ 
            marginTop: '3rem', 
            padding: '1.5rem', 
            background: highContrastMode ? '#000' : '#e3f2fd', 
            borderRadius: '0.5rem',
            border: highContrastMode ? '1px solid #fff' : 'none'
          }}>
            <h2 style={{ 
              color: highContrastMode ? '#fff' : '#1a237e', 
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              Why Choose Hands and Hope?
            </h2>
            <ul style={{ 
              paddingLeft: '1.5rem', 
              color: highContrastMode ? '#ccc' : '#333',
              lineHeight: '1.8'
            }}>
              <li><strong>Global Marketplace:</strong> Access unique products from sellers around the world</li>
              <li><strong>Direct Communication:</strong> Talk directly to sellers before purchasing</li>
              <li><strong>Secure Payments:</strong> Protected transactions with escrow services</li>
              <li><strong>Accessible Design:</strong> Built with accessibility features for all users</li>
              <li><strong>Community Reviews:</strong> Make informed decisions with honest feedback</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default HowItWorks;
import React from 'react';
import styles from './BuyersDashboard.module.css';

function AboutUs({ highContrastMode }) {
  return (
    <main className={`${styles.main} ${highContrastMode ? styles.highContrast : ''}`}>
      <div className={styles.container}>
        <h1 className={styles.sectionTitle}>About Hands and Hope</h1>
        <div style={{ 
          background: '#fff', 
          padding: '2rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <p style={{ fontSize: '1.125rem', lineHeight: '1.6', color: highContrastMode ? '#fff' : '#333' }}>
            Hands and Hope is a revolutionary e-commerce platform designed to make global trade accessible and equal for everyone. 
            Our mission is to connect buyers with trusted sellers around the world, providing a seamless and secure shopping experience.
          </p>
          
          <h2 style={{ 
            color: highContrastMode ? '#fff' : '#1a237e', 
            marginTop: '2rem', 
            marginBottom: '1rem' 
          }}>Our Vision</h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: highContrastMode ? '#ccc' : '#666' }}>
            We envision a world where geographical boundaries do not limit economic opportunities. By leveraging cutting-edge technology 
            and fostering trust between buyers and sellers, we aim to create a global marketplace that empowers artisans, small businesses, 
            and entrepreneurs worldwide.
          </p>
          
          <h2 style={{ 
            color: highContrastMode ? '#fff' : '#1a237e', 
            marginTop: '2rem', 
            marginBottom: '1rem' 
          }}>Our Values</h2>
          <ul style={{ 
            paddingLeft: '1.5rem', 
            color: highContrastMode ? '#ccc' : '#666',
            lineHeight: '1.8'
          }}>
            <li><strong>Accessibility:</strong> Making global trade accessible to everyone, regardless of location or economic status</li>
            <li><strong>Trust:</strong> Building secure and reliable connections between buyers and sellers</li>
            <li><strong>Equality:</strong> Ensuring fair opportunities for all participants in our marketplace</li>
            <li><strong>Innovation:</strong> Continuously improving our platform with cutting-edge technology</li>
            <li><strong>Sustainability:</strong> Supporting eco-friendly and socially responsible business practices</li>
          </ul>
          
          <h2 style={{ 
            color: highContrastMode ? '#fff' : '#1a237e', 
            marginTop: '2rem', 
            marginBottom: '1rem' 
          }}>Our Team</h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: highContrastMode ? '#ccc' : '#666' }}>
            Our diverse team of developers, designers, and e-commerce experts are passionate about creating technology that makes a difference. 
            With backgrounds in accessibility, international commerce, and user experience, we're committed to building a platform that serves 
            everyone's needs.
          </p>
        </div>
      </div>
    </main>
  );
}

export default AboutUs;
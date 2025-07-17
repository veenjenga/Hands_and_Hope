// src/components/Sidebar.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Sidebar({ activeNavItem, handleNavItemClick, highContrastMode }) {
  const history = useHistory();

  const navItems = [
    { name: 'Dashboard', icon: 'home', path: '/' },
    { name: 'Products', icon: 'box', path: '/products' },

    { name: 'Inquiries', icon: 'envelope', path: '/inquiries' },
    { name: 'Settings', icon: 'cog', path: '/settings' },
    { name: 'Help', icon: 'question-circle', path: '/help' },
  ];

  const handleClick = (item, path) => {
    handleNavItemClick(item);
    history.push(path);
  };

  return (
    <div
      className={`${styles.sidebar} ${
        highContrastMode ? styles.sidebarHighContrast : ''
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={styles.sidebarHeader}>
        <h1 className={styles.sidebarTitle}>Equal Trade</h1>
      </div>
      <nav className={styles.sidebarNav}>
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleClick(item.name, item.path)}
            className={`${styles.navButton} ${
              activeNavItem === item.name
                ? highContrastMode
                  ? styles.navButtonActiveHighContrast
                  : styles.navButtonActive
                : ''
            }`}
            aria-current={activeNavItem === item.name ? 'page' : undefined}
          >
            <i className={`fa fa-${item.icon} ${styles.navIcon}`}></i>
            <span className={styles.navText}>{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
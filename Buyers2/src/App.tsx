import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ProductDetailPage from './components/ProductDetailPage';
import ProfilePage from './components/ProfilePage';
import SchoolsPage from './components/SchoolsPage';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import CheckoutPage from './components/CheckoutPage';
import TeamPage from './components/TeamPage';
import TeamMemberDetailPage from './components/TeamMemberDetailPage';
import { AccessibilitySettings } from './components/AccessibilityMenu';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load accessibility settings from localStorage or use defaults
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('handsAndHopeAccessibility');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      textSize: 100,
      highContrast: false,
      screenReader: false,
      voiceNavigation: false,
      underlineLinks: false,
      keyboardNavigation: true,
      reduceMotion: false
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('handsAndHopeAccessibility', JSON.stringify(accessibilitySettings));
  }, [accessibilitySettings]);

  // Apply accessibility settings to the document
  useEffect(() => {
    const root = document.documentElement;

    // Text size
    root.style.fontSize = `${accessibilitySettings.textSize}%`;

    // High contrast
    if (accessibilitySettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Underline links
    if (accessibilitySettings.underlineLinks) {
      root.classList.add('underline-links');
    } else {
      root.classList.remove('underline-links');
    }

    // Keyboard navigation
    if (accessibilitySettings.keyboardNavigation) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

    // Reduce motion
    if (accessibilitySettings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [accessibilitySettings]);

  const handleLogin = (user: any) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} accessibilitySettings={accessibilitySettings} onAccessibilityChange={setAccessibilitySettings} />} />
        <Route path="/preview_page_v2.html" element={<HomePage isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} accessibilitySettings={accessibilitySettings} onAccessibilityChange={setAccessibilitySettings} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} accessibilitySettings={accessibilitySettings} onAccessibilityChange={setAccessibilitySettings} />} />
        <Route path="/signup" element={<SignUpPage onSignUp={handleLogin} accessibilitySettings={accessibilitySettings} onAccessibilityChange={setAccessibilitySettings} />} />
        <Route path="/product/:id" element={<ProductDetailPage isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} accessibilitySettings={accessibilitySettings} onAccessibilityChange={setAccessibilitySettings} />} />
        <Route path="/profile" element={isLoggedIn ? <ProfilePage currentUser={currentUser} onLogout={handleLogout} accessibilitySettings={accessibilitySettings} onAccessibilityChange={setAccessibilitySettings} /> : <Navigate to="/login" />} />
        <Route path="/schools" element={<SchoolsPage isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} accessibilitySettings={accessibilitySettings} onAccessibilityChange={setAccessibilitySettings} />} />
        <Route path="/about" element={<AboutPage isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} accessibilitySettings={accessibilitySettings} onAccessibilityChange={setAccessibilitySettings} />} />
        <Route path="/services" element={<ServicesPage isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} accessibilitySettings={accessibilitySettings} onAccessibilityChange={setAccessibilitySettings} />} />
        <Route path="/team" element={<TeamPage isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} accessibilitySettings={accessibilitySettings} onAccessibilityChange={setAccessibilitySettings} />} />
        <Route path="/team/:id" element={<TeamMemberDetailPage isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} accessibilitySettings={accessibilitySettings} onAccessibilityChange={setAccessibilitySettings} />} />
        <Route path="/checkout" element={isLoggedIn ? <CheckoutPage currentUser={currentUser} onLogout={handleLogout} accessibilitySettings={accessibilitySettings} onAccessibilityChange={setAccessibilitySettings} /> : <Navigate to="/login" />} />
        <Route path="*" element={<HomePage isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} accessibilitySettings={accessibilitySettings} onAccessibilityChange={setAccessibilitySettings} />} />
      </Routes>
    </Router>
  );
}

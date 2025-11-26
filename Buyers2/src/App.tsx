import { useState } from 'react';
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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

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
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="/preview_page_v2.html" element={<HomePage isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUpPage onSignUp={handleLogin} />} />
        <Route path="/product/:id" element={<ProductDetailPage isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="/profile" element={isLoggedIn ? <ProfilePage currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/schools" element={<SchoolsPage isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="/about" element={<AboutPage isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="/services" element={<ServicesPage isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="/checkout" element={isLoggedIn ? <CheckoutPage currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="*" element={<HomePage isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}
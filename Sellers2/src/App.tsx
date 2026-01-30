import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegistrationPage } from './components/RegistrationPage';
import { SellerDashboard } from './components/SellerDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { SchoolDashboard } from './components/SchoolDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CaregiverDashboard } from './components/CaregiverDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ErrorBoundary } from './components/ErrorBoundary';

type Page = 'login' | 'register' | 'dashboard' | 'admin-dashboard';
type UserRole = 'seller' | 'teacher' | 'student' | 'school' | 'super-admin' | 'admin' | 'caregiver' | null;

function AppContent() {
  const { user, login: authLogin, logout: authLogout } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    console.debug('Auth user changed:', user);
    setIsHydrated(true);
  }, [user]);

  const handleLogin = (role: UserRole) => {
    // User is already set in context via login call in LoginPage
    if (role === 'super-admin' || role === 'admin') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleRegister = (role: UserRole) => {
    // User is set in context after successful registration
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    authLogout();
    setCurrentPage('login');
  };

  // Show loading while auth rehydrates
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on login/register, show login
  if (!user && currentPage !== 'login' && currentPage !== 'register') {
    return (
      <LoginPage 
        onLogin={handleLogin}
        onNavigateToRegister={() => setCurrentPage('register')}
      />
    );
  }

  return (
    <div className="min-h-screen">
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={handleLogin}
          onNavigateToRegister={() => setCurrentPage('register')}
        />
      )}
      
      {currentPage === 'register' && (
        <RegistrationPage
          onRegister={handleRegister}
          onNavigateToLogin={() => setCurrentPage('login')}
        />
      )}

      {currentPage === 'admin-dashboard' && user && (user.role === 'super-admin' || user.role === 'admin') && (
        <ErrorBoundary>
          <AdminDashboard 
            onLogout={handleLogout} 
            adminRole={user.role}
          />
        </ErrorBoundary>
      )}
      
      {currentPage === 'dashboard' && user && user.role === 'school' && (
        <ErrorBoundary>
          <SchoolDashboard onLogout={handleLogout} />
        </ErrorBoundary>
      )}
      
      {currentPage === 'dashboard' && user && user.role === 'teacher' && (
        <ErrorBoundary>
          <TeacherDashboard onLogout={handleLogout} />
        </ErrorBoundary>
      )}
      
      {currentPage === 'dashboard' && user && (user.role === 'seller' || user.role === 'student') && (
        <ErrorBoundary>
          <SellerDashboard onLogout={handleLogout} userRole={user.role} />
        </ErrorBoundary>
      )}

      {currentPage === 'dashboard' && user && user.role === 'caregiver' && (
        <ErrorBoundary>
          <CaregiverDashboard onLogout={handleLogout} />
        </ErrorBoundary>
      )}
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </NotificationProvider>
  );
}
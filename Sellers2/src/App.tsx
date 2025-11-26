import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegistrationPage } from './components/RegistrationPage';
import { SellerDashboard } from './components/SellerDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { SchoolDashboard } from './components/SchoolDashboard';
import { AdminDashboard } from './components/AdminDashboard';

type Page = 'login' | 'register' | 'dashboard' | 'admin-dashboard';
type UserRole = 'seller' | 'teacher' | 'student' | 'school' | 'super-admin' | 'admin' | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === 'super-admin' || role === 'admin') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleRegister = (role: UserRole) => {
    setUserRole(role);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentPage('login');
  };

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

      {currentPage === 'admin-dashboard' && (userRole === 'super-admin' || userRole === 'admin') && (
        <AdminDashboard 
          onLogout={handleLogout} 
          adminRole={userRole}
        />
      )}
      
      {currentPage === 'dashboard' && userRole === 'school' && (
        <SchoolDashboard onLogout={handleLogout} />
      )}
      
      {currentPage === 'dashboard' && userRole === 'teacher' && (
        <TeacherDashboard onLogout={handleLogout} />
      )}
      
      {currentPage === 'dashboard' && (userRole === 'seller' || userRole === 'student') && (
        <SellerDashboard onLogout={handleLogout} userRole={userRole} />
      )}
    </div>
  );
}
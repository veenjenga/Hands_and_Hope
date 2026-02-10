import { Search, Plus, LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { NotificationPanel } from './NotificationPanel';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

interface DashboardHeaderProps {
  onLogout: () => void;
  highContrast: boolean;
  userRole?: 'seller' | 'student' | 'teacher' | 'school';
  onProfileClick?: () => void;
  onNotificationsClick?: () => void;
  onAddProductClick?: () => void;
}

export function DashboardHeader({ onLogout, highContrast, userRole = 'seller', onProfileClick, onNotificationsClick, onAddProductClick }: DashboardHeaderProps) {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/dashboard/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUserData(data.profile);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);
  return (
    <header 
      className={`sticky top-0 z-40 border-b ${highContrast ? 'border-white bg-black' : 'border-gray-200 bg-white'} px-6 py-4`}
      role="banner"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          {/* Removed Equal Trade heading */}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Search products, orders..."
              className="h-11 w-80 pl-10"
              aria-label="Search products and orders"
            />
          </div>

          {/* Only show Add Product button for sellers and students, not teachers */}
          {userRole !== 'teacher' && userRole !== 'school' && (
            <Button size="lg" className="gap-2 h-11" onClick={onAddProductClick}>
              <Plus className="h-5 w-5" aria-hidden="true" />
              <span className="hidden sm:inline">Add Product</span>
            </Button>
          )}

          <NotificationPanel userRole={userRole} highContrast={highContrast} onViewAll={onNotificationsClick} />

          <button 
            onClick={onProfileClick}
            className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-all hover:shadow-md ${
              highContrast ? 'border-white hover:bg-gray-900' : 'border-gray-200 hover:bg-gray-50'
            } cursor-pointer`}
            aria-label="View your profile"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={userData?.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.name || 'user'}`} alt={`${userData?.name || 'User'}'s profile`} />
              <AvatarFallback>{userData?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}</AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <p className="leading-none">{userData?.name || 'User'}</p>
            </div>
          </button>

          <Button 
            variant="outline" 
            size="lg"
            onClick={onLogout}
            className="gap-2 h-11"
            aria-label="Log out of your account"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:inline">Log Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
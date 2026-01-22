import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import AccessibilityMenu, { AccessibilitySettings } from './AccessibilityMenu';

interface HeaderProps {
  isLoggedIn: boolean;
  currentUser?: any;
  onLogout: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearch?: () => void;
  cartItemCount?: number;
  accessibilitySettings?: AccessibilitySettings;
  onAccessibilityChange?: (settings: AccessibilitySettings) => void;
}

export default function Header({ 
  isLoggedIn, 
  currentUser, 
  onLogout, 
  searchQuery = '', 
  onSearchChange = () => {}, 
  onSearch = () => {},
  cartItemCount = 0,
  accessibilitySettings,
  onAccessibilityChange
}: HeaderProps) {
  const navigate = useNavigate();
  const [isAccessibilityMenuOpen, setIsAccessibilityMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <>
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#1e2875] focus:text-white focus:rounded focus:ring-2 focus:ring-yellow-400"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50" role="banner">
        <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded">
          <h1 className="text-[#1e2875]">Hands and Hope</h1>
        </Link>

        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl mx-8" role="search">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-4 pr-12 py-2 w-full border-gray-300 focus:border-[#1e2875] focus:ring-[#1e2875]"
              aria-label="Search products"
            />
            <Button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 bg-[#1e2875] hover:bg-[#2a3490] text-white rounded-l-none"
              aria-label="Search"
            >
              <Search size={20} aria-hidden="true" />
            </Button>
          </div>
        </form>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 hover:text-[#1e2875] focus:ring-2 focus:ring-yellow-400 rounded-full w-12 h-12"
            aria-label="Accessibility settings"
          >
            <SettingsIcon size={20} aria-hidden="true" />
          </Button>

          <button
            onClick={() => setIsAccessibilityMenuOpen(!isAccessibilityMenuOpen)}
            className="fixed bottom-4 right-4 bg-yellow-400 text-[#1e2875] rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-yellow-500 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-yellow-600 z-50 transition-all duration-300 animate-pulse"
            aria-label="Toggle accessibility menu"
            aria-expanded={isAccessibilityMenuOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9" aria-hidden="true">
              <path d="M12 2a2 2 0 100 4 2 2 0 000-4zM8.5 8a1.5 1.5 0 00-1.5 1.5V14a1 1 0 01-2 0V9.5a3.5 3.5 0 013-3.465A3.5 3.5 0 0111.5 3h1a3.5 3.5 0 013.5 3.5V14a1 1 0 11-2 0V9.5A1.5 1.5 0 0012.5 8h-1a1.5 1.5 0 00-1.5 1.5V18l2.5 4a1 1 0 11-1.714 1.028L8 18.618l-2.786 4.41A1 1 0 013.5 22l2.5-4V9.5A1.5 1.5 0 018.5 8z"/>
            </svg>
          </button>

          {/* Accessibility Menu */}
          {accessibilitySettings && onAccessibilityChange && (
            <AccessibilityMenu
              isOpen={isAccessibilityMenuOpen}
              onClose={() => setIsAccessibilityMenuOpen(false)}
              settings={accessibilitySettings}
              onSettingsChange={onAccessibilityChange}
            />
          )}

          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-700 hover:text-[#1e2875] focus:ring-2 focus:ring-yellow-400 rounded-full"
                onClick={() => navigate('/checkout')}
                aria-label={`Shopping cart with ${cartItemCount} items`}
              >
                <ShoppingCart size={24} aria-hidden="true" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center" aria-hidden="true">
                    {cartItemCount}
                  </span>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-700 hover:text-[#1e2875] focus:ring-2 focus:ring-yellow-400 rounded-full" aria-label="User menu">
                    <User size={24} aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2">
                    <p className="font-medium">{currentUser?.name || 'User'}</p>
                    <p className="text-gray-500">{currentUser?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2" size={16} aria-hidden="true" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2" size={16} aria-hidden="true" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-[#1e2875] text-[#1e2875] hover:bg-[#1e2875] hover:text-white focus:ring-2 focus:ring-yellow-400"
              >
                Login
              </Button>
              <Button
                onClick={() => { window.location.href = 'http://localhost:3001'; }}
                className="bg-yellow-400 text-[#1e2875] hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600"
              >
                Register as Seller
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
    </>
  );
}

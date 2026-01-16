import { useState } from 'react';
// Remove the SVG import since it's causing type issues
import { Eye, EyeOff, Accessibility } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AccessibilityPanel } from './AccessibilityPanel';
import { ScreenReaderProvider } from '../contexts/ScreenReaderContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

type UserRole = 'seller' | 'teacher' | 'student' | 'school' | 'super-admin' | 'admin';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  onNavigateToRegister: () => void;
}

export function LoginPage({ onLogin, onNavigateToRegister }: LoginPageProps) {
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [fontSize, setFontSize] = useState('normal' as any);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(true);
  const [voiceNavigation, setVoiceNavigation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.login(email, password);

      // Store in auth context
      authLogin(response.user, response.token);
      console.debug('Auth context updated, user:', response.user);
      onLogin(response.user.role as UserRole);
    } catch (err: any) {
      console.error('Login error', err);
      // Provide more specific error messages
      if (err.message && err.message.includes('400')) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.message && err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else {
        setError(err.message || 'Login failed');
      }
      alert(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fontSizeClass = fontSize === 'large' ? 'text-lg' : fontSize === 'extra-large' ? 'text-xl' : '';

  return (
    <ScreenReaderProvider enabled={screenReader}>
    <div className={`relative min-h-screen overflow-hidden ${highContrast ? 'bg-black text-white' : ''} ${fontSizeClass}`}>
      {/* Animated Background */}
      {!highContrast && (
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6TTEyIDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0yNCAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        </div>
      )}

      {/* Accessibility Button - Fixed Position */}
      <button
        onClick={() => setShowAccessibility(!showAccessibility)}
        className="fixed right-6 top-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 shadow-2xl transition-all hover:scale-110 hover:shadow-yellow-400/50 focus:outline-none focus:ring-4 focus:ring-yellow-600"
        aria-label="Toggle accessibility options"
        aria-expanded={showAccessibility}
      >
        <Accessibility className="h-8 w-8 text-gray-900" aria-hidden="true" />
      </button>

      {/* Accessibility Panel */}
      {showAccessibility && (
        <AccessibilityPanel
          fontSize={fontSize}
          setFontSize={setFontSize}
          highContrast={highContrast}
          setHighContrast={setHighContrast}
          screenReader={screenReader}
          setScreenReader={setScreenReader}
          voiceNavigation={voiceNavigation}
          setVoiceNavigation={setVoiceNavigation}
          onClose={() => setShowAccessibility(false)}
          onNavigate={(page) => {
            if (page === 'register' || page === 'signup' || page === 'create account') {
              onNavigateToRegister();
            }
          }}
        />
      )}

      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <div className="grid w-full max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Side - Branding & Image */}
          <div className="hidden lg:flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-6 py-4 backdrop-blur-sm">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                  <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM7 9.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">HANDS & HOPE</span>
                  <span className="text-xs text-white/80">Accessibility Marketplace</span>
                </div>
              </div>
              <h1 className={`text-5xl font-bold leading-tight ${highContrast ? 'text-white' : 'text-white drop-shadow-lg'}`}>
                Welcome Back to<br />Hands & Hope
              </h1>
              <p className={`text-lg leading-relaxed ${highContrast ? 'text-gray-300' : 'text-white/90'}`}>
                Empowering sellers with disabilities to share their talents and skills with the world. 
                Join our inclusive marketplace today.
              </p>
              <div className="space-y-3 pt-4">
                <div className={`flex items-center gap-3 rounded-xl ${highContrast ? 'bg-white text-black' : 'bg-white/20 backdrop-blur-sm'} px-5 py-3 transition-transform hover:scale-105`}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-400 flex-shrink-0">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`font-medium ${highContrast ? 'text-black' : 'text-white'}`}>Fully Accessible Design</span>
                </div>
                <div className={`flex items-center gap-3 rounded-xl ${highContrast ? 'bg-white text-black' : 'bg-white/20 backdrop-blur-sm'} px-5 py-3 transition-transform hover:scale-105`}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-400 flex-shrink-0">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className={`font-medium ${highContrast ? 'text-black' : 'text-white'}`}>Secure & Verified Platform</span>
                </div>
                <div className={`flex items-center gap-3 rounded-xl ${highContrast ? 'bg-white text-black' : 'bg-white/20 backdrop-blur-sm'} px-5 py-3 transition-transform hover:scale-105`}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-400 flex-shrink-0">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className={`font-medium ${highContrast ? 'text-black' : 'text-white'}`}>Empowering Community</span>
                </div>
              </div>
            </div>
            {/* Community Image - Remove the problematic SVG image */}
            <div className="hidden xl:block pt-6">
              <div className="overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/20 bg-white/10 backdrop-blur-sm">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
                  <span className="text-gray-500">Community Image</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex items-center justify-center">
            <Card className={`w-full max-w-md ${highContrast ? 'border-4 border-white bg-black' : 'border-0 bg-white/95 shadow-2xl backdrop-blur-sm'}`}>
              <CardHeader className="space-y-3 text-center">
                <CardTitle className="text-center">
                  Sign In to Your Account
                </CardTitle>
                <CardDescription className={`text-center ${highContrast ? 'text-gray-300' : ''}`}>
                  Enter your email and password. Your role will be determined from your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className={`rounded-lg p-3 text-sm ${highContrast ? 'bg-gray-800 text-gray-300' : 'bg-blue-50 text-blue-700'}`}>
                      <strong>Demo Credentials:</strong><br/>
                      Admin: admin@handsandhope.com / Admin@2024<br/>
                      Super Admin: superadmin@handsandhope.com / SuperAdmin@2024<br/>
                      <small>Or register as a new user</small>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-lg">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-14 text-lg"
                      aria-required="true"
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-lg">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-14 pr-12 text-lg"
                        aria-required="true"
                        autoComplete="current-password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-1 top-1 h-12 w-12 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="h-auto p-0 text-base text-blue-600 underline hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      onClick={() => alert('Password reset feature coming soon')}
                      disabled={isLoading}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="h-14 w-full text-lg shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className={`px-2 ${highContrast ? 'bg-black text-gray-300' : 'bg-white text-gray-500'}`}>
                        New to the platform?
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="h-14 w-full text-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={onNavigateToRegister}
                    disabled={isLoading}
                  >
                    Create an Account
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </ScreenReaderProvider>
  );
}
import { useState } from 'react';
import { Eye, EyeOff, Accessibility, Shield, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AccessibilityPanel } from './AccessibilityPanel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import handsHopeLogo from 'figma:asset/972a6bc015fa5c98ddeb2bc3d5985f42623eb1bb.png';
import craftImage from 'figma:asset/be213fd3afb7194e83fe4ac6405c70d913f7a4df.png';
import bannerImage from 'figma:asset/575120f8324783dbb6eac73158909b23747d4002.png';
import communityImage from 'figma:asset/b7392069004a962a7faa4411e15b3a342808af78.png';

type UserRole = 'seller' | 'teacher' | 'student' | 'school' | 'super-admin' | 'admin';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  onNavigateToRegister: () => void;
}

export function LoginPage({ onLogin, onNavigateToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserRole>('seller');
  const [showPassword, setShowPassword] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(true);
  const [voiceNavigation, setVoiceNavigation] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If admin mode, validate admin credentials
    if (isAdminMode) {
      const adminCredentials = {
        'superadmin@handsandhope.com': { password: 'SuperAdmin@2024', role: 'super-admin' as const },
        'admin@handsandhope.com': { password: 'Admin@2024', role: 'admin' as const },
      };
      
      const admin = adminCredentials[email as keyof typeof adminCredentials];
      if (admin && admin.password === password) {
        onLogin(admin.role);
      } else {
        alert('Invalid administrator credentials');
      }
    } else {
      onLogin(userType);
    }
  };

  const fontSizeClass = fontSize === 'large' ? 'text-lg' : fontSize === 'extra-large' ? 'text-xl' : '';

  return (
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
        />
      )}

      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <div className="grid w-full max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Side - Branding & Image */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div className="inline-block rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <img 
                  src={handsHopeLogo} 
                  alt="Hands and Hope Logo" 
                  className="h-16 w-auto drop-shadow-lg"
                />
              </div>
              <h1 className={`${highContrast ? 'text-white' : 'text-white drop-shadow-lg'}`}>
                Welcome Back to<br />Hands & Hope
              </h1>
              <p className={`text-xl leading-relaxed ${highContrast ? 'text-gray-300' : 'text-white/90'}`}>
                An accessible marketplace designed for sellers with disabilities. 
                Empowering everyone to share their talents and skills with the world.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className={`flex items-center gap-3 rounded-xl ${highContrast ? 'bg-white text-black' : 'bg-white/20 backdrop-blur-sm'} px-6 py-3`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-400">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={highContrast ? 'text-black' : 'text-white'}>Fully Accessible</span>
                </div>
                <div className={`flex items-center gap-3 rounded-xl ${highContrast ? 'bg-white text-black' : 'bg-white/20 backdrop-blur-sm'} px-6 py-3`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className={highContrast ? 'text-black' : 'text-white'}>Secure Platform</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white/20">
                <img 
                  src={craftImage} 
                  alt="People with disabilities creating crafts together" 
                  className="w-full"
                />
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
                  Select your account type and enter your credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="userType" className="text-lg">
                      I am a *
                    </Label>
                    <Select value={userType} onValueChange={(value: UserRole) => setUserType(value)}>
                      <SelectTrigger className="h-14 text-lg">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seller" className="text-lg">Individual Seller</SelectItem>
                        <SelectItem value="student" className="text-lg">Student</SelectItem>
                        <SelectItem value="teacher" className="text-lg">Teacher</SelectItem>
                        <SelectItem value="school" className="text-lg">School Administrator</SelectItem>
                        <SelectItem value="admin" className="text-lg">Admin</SelectItem>
                        <SelectItem value="super-admin" className="text-lg">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
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
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-12 w-12"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-base text-blue-600"
                      onClick={() => alert('Password reset feature coming soon')}
                    >
                      Forgot Password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="h-14 w-full text-lg shadow-lg"
                  >
                    Sign In
                  </Button>

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

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="h-14 w-full text-lg"
                    onClick={onNavigateToRegister}
                  >
                    Create an Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
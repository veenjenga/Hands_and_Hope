import { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface AdminLoginProps {
  onLogin: (role: 'super-admin' | 'admin') => void;
}

// Mock credentials - In production, this would be verified against a secure backend
const ADMIN_CREDENTIALS = {
  'superadmin@handsandhope.com': { password: 'SuperAdmin@2024', role: 'super-admin' as const },
  'admin@handsandhope.com': { password: 'Admin@2024', role: 'admin' as const },
};

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const admin = ADMIN_CREDENTIALS[email as keyof typeof ADMIN_CREDENTIALS];
      
      if (admin && admin.password === password) {
        onLogin(admin.role);
      } else {
        setError('Invalid administrator credentials');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      {/* Warning Banner */}
      <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-2 px-4 text-center text-sm font-semibold z-50">
        ⚠️ RESTRICTED AREA - AUTHORIZED ADMINISTRATORS ONLY
      </div>

      <Card className="w-full max-w-md shadow-2xl border-2 border-blue-500 mt-12">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Shield className="h-12 w-12 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Administrator Access</CardTitle>
            <p className="text-sm text-gray-500 mt-2">Hands and Hope Platform</p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Administrator Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@handsandhope.com"
                className="h-12"
                required
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-12 pr-10"
                  required
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Authenticating...
                </div>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Access Admin Panel
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              This is a secure administrative area. All access attempts are logged and monitored. 
              Unauthorized access is strictly prohibited.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="fixed bottom-4 left-4 right-4 text-center text-xs text-gray-400">
        Protected by 256-bit encryption • Session timeout: 30 minutes
      </div>
    </div>
  );
}

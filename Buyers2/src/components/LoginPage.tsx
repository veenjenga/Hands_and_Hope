import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import Header from './Header';
import { AccessibilitySettings } from './AccessibilityMenu';
import { api } from '../services/api';

interface LoginPageProps {
  onLogin: (user: any) => void;
  accessibilitySettings?: AccessibilitySettings;
  onAccessibilityChange?: (settings: AccessibilitySettings) => void;
}

export default function LoginPage({ onLogin, accessibilitySettings, onAccessibilityChange }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await api.login(email, password);
      
      // Save token to localStorage
      localStorage.setItem('token', response.token);
      
      // For buyers, we need to extract the user object (which contains buyer info)
      onLogin(response.user);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      // Provide more specific error messages
      if (err.message && err.message.includes('400')) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.message && err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else {
        setError(err.message || 'Failed to login. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        isLoggedIn={false} 
        onLogout={() => {}}
        accessibilitySettings={accessibilitySettings}
        onAccessibilityChange={onAccessibilityChange}
      />
      <main id="main-content" className="flex items-center justify-center p-4" role="main">
        <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            <Link to="/" className="text-[#1e2875] hover:text-[#2a3490] focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded">
              Hands and Hope
            </Link>
          </CardTitle>
          <CardDescription className="text-center">
            Login to your buyer account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" role="alert">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                aria-required="true"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                aria-required="true"
                disabled={loading}
              />
            </div>

            <Button
              type="button"
              variant="link"
              className="text-[#1e2875] p-0 h-auto"
              aria-label="Forgot password"
            >
              Forgot password?
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-[#1e2875] hover:bg-[#2a3490] text-white focus:ring-2 focus:ring-yellow-400"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-[#1e2875] hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
      </main>
    </div>
  );
}
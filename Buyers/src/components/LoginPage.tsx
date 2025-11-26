import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Mock login - in real app, this would validate credentials
    const user = {
      id: 1,
      name: 'John Doe',
      email: email,
      phone: '+1234567890',
      address: '123 Main St, City, Country'
    };

    onLogin(user);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
            >
              Login
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
    </div>
  );
}

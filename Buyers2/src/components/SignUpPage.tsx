import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Checkbox } from './ui/checkbox';

interface SignUpPageProps {
  onSignUp: (user: any) => void;
}

export default function SignUpPage({ onSignUp }: SignUpPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [allowLocation, setAllowLocation] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Mock sign up - in real app, this would create a new user
    const user = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      locationEnabled: allowLocation
    };

    onSignUp(user);
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
            Create your buyer account
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
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className="focus:border-[#1e2875] focus:ring-[#1e2875]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                className="focus:border-[#1e2875] focus:ring-[#1e2875]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                aria-required="true"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="location"
                checked={allowLocation}
                onCheckedChange={(checked) => setAllowLocation(checked as boolean)}
                className="border-[#1e2875] data-[state=checked]:bg-[#1e2875] data-[state=checked]:border-[#1e2875]"
              />
              <Label
                htmlFor="location"
                className="cursor-pointer"
              >
                Allow location tracking for order delivery
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-[#1e2875] hover:bg-[#2a3490] text-white focus:ring-2 focus:ring-yellow-400"
            >
              Sign Up
            </Button>

            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-[#1e2875] hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

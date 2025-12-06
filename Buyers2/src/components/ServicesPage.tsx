import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Clock, Mail } from 'lucide-react';
import { AccessibilitySettings } from './AccessibilityMenu';

interface ServicesPageProps {
  isLoggedIn: boolean;
  currentUser?: any;
  onLogout: () => void;
  accessibilitySettings?: AccessibilitySettings;
  onAccessibilityChange?: (settings: AccessibilitySettings) => void;
}

export default function ServicesPage({ isLoggedIn, currentUser, onLogout, accessibilitySettings, onAccessibilityChange }: ServicesPageProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your interest! We will notify you when our services are available.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar selectedCategories={selectedCategories} onCategoryChange={setSelectedCategories} />
      
      <div className="flex-1">
        <Header 
          isLoggedIn={isLoggedIn} 
          currentUser={currentUser} 
          onLogout={onLogout}
          accessibilitySettings={accessibilitySettings}
          onAccessibilityChange={onAccessibilityChange}
        />

        <main id="main-content" className="p-6" role="main">
          <div className="max-w-4xl mx-auto">
            {/* Coming Soon Banner */}
            <Card className="mb-8 bg-gradient-to-r from-[#1e2875] to-[#2a3490] text-white border-none">
              <CardContent className="p-12 text-center">
                <Clock className="mx-auto mb-4 text-yellow-400" size={64} aria-hidden="true" />
                <h1 className="text-white mb-4">Services Coming Soon</h1>
                <p className="text-gray-200 max-w-2xl mx-auto">
                  We're working hard to bring you amazing services that will enhance your experience 
                  on Hands and Hope. Stay tuned for exciting updates!
                </p>
              </CardContent>
            </Card>

            {/* Planned Services */}
            <div className="mb-8">
              <h2 className="text-[#1e2875] mb-6 text-center">What We're Planning</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-[#1e2875] mb-3">Custom Orders</h3>
                    <p className="text-gray-700 mb-4">
                      Request custom-made products tailored to your specific needs and preferences. 
                      Work directly with artisans to create something truly unique.
                    </p>
                    <div className="text-yellow-400">Coming Q2 2024</div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-[#1e2875] mb-3">Workshops & Training</h3>
                    <p className="text-gray-700 mb-4">
                      Learn crafting skills through our online workshops led by experienced artisans. 
                      Perfect for beginners and those looking to develop new talents.
                    </p>
                    <div className="text-yellow-400">Coming Q3 2024</div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-[#1e2875] mb-3">Gift Registry</h3>
                    <p className="text-gray-700 mb-4">
                      Create a gift registry for special occasions and share unique handmade products 
                      with friends and family.
                    </p>
                    <div className="text-yellow-400">Coming Q2 2024</div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-[#1e2875] mb-3">Wholesale Program</h3>
                    <p className="text-gray-700 mb-4">
                      Businesses can purchase handmade products in bulk to support their corporate 
                      social responsibility initiatives.
                    </p>
                    <div className="text-yellow-400">Coming Q3 2024</div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-[#1e2875] mb-3">Seller Support Services</h3>
                    <p className="text-gray-700 mb-4">
                      Comprehensive support including photography assistance, product description 
                      writing, and marketing consultation for sellers.
                    </p>
                    <div className="text-yellow-400">Coming Q2 2024</div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-[#1e2875] mb-3">Subscription Boxes</h3>
                    <p className="text-gray-700 mb-4">
                      Receive curated boxes of handmade products delivered monthly. Each box supports 
                      different artisans and schools.
                    </p>
                    <div className="text-yellow-400">Coming Q4 2024</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Notification Signup */}
            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Mail className="mx-auto mb-4 text-[#1e2875]" size={48} aria-hidden="true" />
                  <h2 className="text-[#1e2875] mb-2">Get Notified</h2>
                  <p className="text-gray-600">
                    Be the first to know when our services launch. Sign up for updates!
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                        required
                        aria-required="true"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                        required
                        aria-required="true"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Which services interest you? (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us which services you're most excited about..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#1e2875] hover:bg-[#2a3490] text-white py-6 focus:ring-2 focus:ring-yellow-400"
                    >
                      Notify Me
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="mt-8">
              <CardContent className="p-6 text-center">
                <p className="text-gray-700 mb-2">
                  Have questions or suggestions for our upcoming services?
                </p>
                <a 
                  href="mailto:services@handsandhope.com" 
                  className="text-[#1e2875] hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                >
                  Contact us at services@handsandhope.com
                </a>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

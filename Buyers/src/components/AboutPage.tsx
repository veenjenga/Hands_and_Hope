import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Card, CardContent } from './ui/card';
import { Heart, Users, ShoppingBag, Globe } from 'lucide-react';

interface AboutPageProps {
  isLoggedIn: boolean;
  currentUser?: any;
  onLogout: () => void;
}

export default function AboutPage({ isLoggedIn, currentUser, onLogout }: AboutPageProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar selectedCategories={selectedCategories} onCategoryChange={setSelectedCategories} />
      
      <div className="flex-1">
        <Header 
          isLoggedIn={isLoggedIn} 
          currentUser={currentUser} 
          onLogout={onLogout}
        />

        <main className="p-6" role="main">
          <div className="max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-[#1e2875] mb-4">About Hands and Hope</h1>
              <p className="text-gray-700 max-w-3xl mx-auto">
                The Hands and Hope platform provides an inclusive e-commerce environment where people with disabilities can buy and sell assistive and handmade products.
              </p>
            </div>

            {/* Mission Statement */}
            <Card className="mb-8 border-2 border-[#1e2875]">
              <CardContent className="p-8">
                <h2 className="text-[#1e2875] mb-4 text-center">Our Mission</h2>
                <p className="text-gray-700 text-center leading-relaxed">
                  We are committed to creating an accessible marketplace that empowers individuals with disabilities 
                  to showcase their talents, sell their handmade products, and connect with customers worldwide. 
                  Our platform breaks down barriers and creates opportunities for economic independence and creative expression.
                </p>
              </CardContent>
            </Card>

            {/* Core Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-[#1e2875] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Heart size={32} aria-hidden="true" />
                  </div>
                  <h3 className="text-[#1e2875] mb-2">Inclusivity</h3>
                  <p className="text-gray-600">
                    Creating an accessible platform for everyone, regardless of ability
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-[#1e2875] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users size={32} aria-hidden="true" />
                  </div>
                  <h3 className="text-[#1e2875] mb-2">Empowerment</h3>
                  <p className="text-gray-600">
                    Supporting economic independence and self-determination
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-[#1e2875] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag size={32} aria-hidden="true" />
                  </div>
                  <h3 className="text-[#1e2875] mb-2">Quality</h3>
                  <p className="text-gray-600">
                    Promoting handcrafted products made with skill and care
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-[#1e2875] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Globe size={32} aria-hidden="true" />
                  </div>
                  <h3 className="text-[#1e2875] mb-2">Community</h3>
                  <p className="text-gray-600">
                    Building connections between makers and supporters worldwide
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Our Story */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-[#1e2875] mb-4">Our Story</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Hands and Hope was founded with a simple yet powerful vision: to create a marketplace 
                    that celebrates the talents and abilities of people with disabilities. We recognized 
                    that traditional e-commerce platforms often lack the accessibility features and support 
                    structures needed by both sellers and buyers with disabilities.
                  </p>
                  <p>
                    Our platform was designed from the ground up with accessibility at its core. Every 
                    feature, from product listings to payment processing, has been carefully crafted to 
                    ensure that everyone can participate fully in the buying and selling process.
                  </p>
                  <p>
                    Today, we proudly partner with schools, institutions, and individual artisans across 
                    the country, helping them reach customers who appreciate the quality, uniqueness, and 
                    heart that goes into every handmade product.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* What We Offer */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-[#1e2875] mb-6">What We Offer</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-[#1e2875] mb-2">For Buyers</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">✓</span>
                        <span>Access to unique, handcrafted products</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">✓</span>
                        <span>Support for individuals and schools</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">✓</span>
                        <span>Fully accessible shopping experience</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">✓</span>
                        <span>Secure payment options</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">✓</span>
                        <span>Order tracking and support</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[#1e2875] mb-2">For Sellers</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">✓</span>
                        <span>Easy-to-use seller dashboard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">✓</span>
                        <span>Assistive technology integration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">✓</span>
                        <span>Marketing and promotional support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">✓</span>
                        <span>Fair commission structure</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">✓</span>
                        <span>Community of fellow artisans</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accessibility Commitment */}
            <Card className="bg-gradient-to-r from-[#1e2875] to-[#2a3490] text-white">
              <CardContent className="p-8">
                <h2 className="text-white mb-4">Our Accessibility Commitment</h2>
                <p className="leading-relaxed mb-4">
                  Accessibility is not an afterthought—it's the foundation of everything we do. 
                  Our platform meets WCAG 2.1 Level AA standards and includes:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">✓</span>
                    <span>Screen reader compatibility throughout the site</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">✓</span>
                    <span>Keyboard navigation for all interactive elements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">✓</span>
                    <span>High contrast modes and customizable display options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">✓</span>
                    <span>Clear, simple language and intuitive navigation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">✓</span>
                    <span>Alternative text for all images and visual content</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Impact Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <p className="text-[#1e2875] mb-2">3,500+</p>
                  <p className="text-gray-600">Products Listed</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <p className="text-[#1e2875] mb-2">15+</p>
                  <p className="text-gray-600">Partner Schools</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <p className="text-[#1e2875] mb-2">10,000+</p>
                  <p className="text-gray-600">Happy Customers</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

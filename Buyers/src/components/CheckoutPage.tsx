import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { CreditCard, Smartphone, MapPin, Package } from 'lucide-react';

interface CheckoutPageProps {
  currentUser: any;
  onLogout: () => void;
}

const mockCartItems = [
  { id: 6, product: 'Canvas Tote Bag', price: 19.99, quantity: 2, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200' },
  { id: 7, product: 'Abstract Painting', price: 129.99, quantity: 1, image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200' }
];

export default function CheckoutPage({ currentUser, onLogout }: CheckoutPageProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [enableLocationTracking, setEnableLocationTracking] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: currentUser?.name || '',
    address: currentUser?.address || '',
    city: '',
    zipCode: '',
    phone: currentUser?.phone || ''
  });
  const navigate = useNavigate();

  const subtotal = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 10.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.zipCode) {
      alert('Please fill in all shipping address fields');
      return;
    }

    if (enableLocationTracking) {
      alert('Thank you for enabling location tracking! The seller will be able to track delivery after your confirmation.');
    }

    alert('Order placed successfully! You will receive a confirmation email shortly.');
    navigate('/profile');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar selectedCategories={selectedCategories} onCategoryChange={setSelectedCategories} />
      
      <div className="flex-1">
        <Header 
          isLoggedIn={true} 
          currentUser={currentUser} 
          onLogout={onLogout}
          cartItemCount={mockCartItems.reduce((sum, item) => sum + item.quantity, 0)}
        />

        <main className="p-6" role="main">
          <div className="max-w-6xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 focus:ring-2 focus:ring-yellow-400"
              aria-label="Go back"
            >
              ← Back to Shopping
            </Button>

            <h1 className="text-[#1e2875] mb-6">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Forms */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="text-[#1e2875]" aria-hidden="true" />
                      Shipping Address
                    </CardTitle>
                    <CardDescription>Where should we deliver your order?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                        className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                        required
                        aria-required="true"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                        className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                        required
                        aria-required="true"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                          required
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                          className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                          required
                          aria-required="true"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                        required
                        aria-required="true"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-4">
                      <Checkbox
                        id="locationTracking"
                        checked={enableLocationTracking}
                        onCheckedChange={(checked) => setEnableLocationTracking(checked as boolean)}
                        className="border-[#1e2875] data-[state=checked]:bg-[#1e2875]"
                      />
                      <Label htmlFor="locationTracking" className="cursor-pointer flex items-center gap-2">
                        <MapPin size={16} className="text-[#1e2875]" aria-hidden="true" />
                        Allow seller to track my location for delivery confirmation
                      </Label>
                    </div>
                    <p className="text-gray-600">
                      This helps ensure accurate delivery and allows you to confirm receipt of your order.
                    </p>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="text-[#1e2875]" aria-hidden="true" />
                      Payment Method
                    </CardTitle>
                    <CardDescription>Select your preferred payment method</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                      <div className="flex items-center space-x-2 border rounded p-4 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="credit-card" id="credit-card" className="border-[#1e2875]" />
                        <Label htmlFor="credit-card" className="flex-1 cursor-pointer flex items-center gap-2">
                          <CreditCard className="text-[#1e2875]" aria-hidden="true" />
                          Credit/Debit Card
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 border rounded p-4 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="mobile-money" id="mobile-money" className="border-[#1e2875]" />
                        <Label htmlFor="mobile-money" className="flex-1 cursor-pointer flex items-center gap-2">
                          <Smartphone className="text-[#1e2875]" aria-hidden="true" />
                          Mobile Money (BuyGoods)
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === 'credit-card' && (
                      <div className="mt-6 space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/YY"
                              className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'mobile-money' && (
                      <div className="mt-6 space-y-4">
                        <div>
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            placeholder="+1234567890"
                            className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                          />
                        </div>
                        <p className="text-gray-600">
                          You will receive a prompt on your phone to complete the payment.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-6">
                      {mockCartItems.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <img src={item.image} alt={item.product} className="w-16 h-16 object-cover rounded" />
                          <div className="flex-1">
                            <p className="text-gray-700">{item.product}</p>
                            <p className="text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-gray-700">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between mb-6">
                      <span>Total</span>
                      <span className="text-[#1e2875]">${total.toFixed(2)}</span>
                    </div>

                    <Button
                      onClick={handlePlaceOrder}
                      className="w-full bg-[#1e2875] hover:bg-[#2a3490] text-white py-6 focus:ring-2 focus:ring-yellow-400"
                    >
                      Place Order
                    </Button>

                    <p className="text-center text-gray-600 mt-4">
                      By placing this order, you agree to our terms and conditions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

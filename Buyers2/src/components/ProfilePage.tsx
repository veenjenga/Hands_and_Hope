import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Calendar, CreditCard, Package, DollarSign, MapPin, Edit } from 'lucide-react';
import { AccessibilitySettings } from './AccessibilityMenu';

interface ProfilePageProps {
  currentUser: any;
  onLogout: () => void;
  accessibilitySettings?: AccessibilitySettings;
  onAccessibilityChange?: (settings: AccessibilitySettings) => void;
}

const mockPurchaseHistory = [
  { id: 1, product: 'Handmade Wooden Chair', price: 89.99, date: '2024-01-15', status: 'Delivered', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=200' },
  { id: 2, product: 'Cotton T-Shirt', price: 24.99, date: '2024-01-10', status: 'Delivered', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200' },
  { id: 3, product: 'Ceramic Bowl Set', price: 45.99, date: '2024-01-05', status: 'Delivered', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=200' }
];

const mockPendingOrders = [
  { id: 4, product: 'Knitted Scarf', price: 34.99, orderDate: '2024-01-18', estimatedDelivery: '2024-01-25', status: 'In Transit', image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=200', trackingNumber: 'TRK123456789' },
  { id: 5, product: 'Wooden Cutting Board', price: 39.99, orderDate: '2024-01-19', estimatedDelivery: '2024-01-28', status: 'Processing', image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=200', trackingNumber: 'TRK987654321' }
];

const mockCartItems = [
  { id: 6, product: 'Canvas Tote Bag', price: 19.99, quantity: 2, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200' },
  { id: 7, product: 'Abstract Painting', price: 129.99, quantity: 1, image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200' }
];

const paymentMethods = [
  { id: 1, type: 'Credit Card', last4: '4242', expiry: '12/25', brand: 'Visa' },
  { id: 2, type: 'Mobile Money', number: '+1234567890', provider: 'BuyGoods' }
];

export default function ProfilePage({ currentUser, onLogout, accessibilitySettings, onAccessibilityChange }: ProfilePageProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'John Doe',
    email: currentUser?.email || 'john@example.com',
    phone: currentUser?.phone || '+1234567890',
    address: currentUser?.address || '123 Main St, City, Country'
  });
  const navigate = useNavigate();

  const totalSpent = mockPurchaseHistory.reduce((sum, item) => sum + item.price, 0);

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  const handleTrackOrder = (trackingNumber: string) => {
    alert(`Tracking order: ${trackingNumber}\n\nIn a real application, this would show detailed tracking information and location updates.`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar selectedCategories={selectedCategories} onCategoryChange={setSelectedCategories} />
      
      <div className="flex-1">
        <Header 
          isLoggedIn={true} 
          currentUser={currentUser} 
          onLogout={onLogout}
          accessibilitySettings={accessibilitySettings}
          onAccessibilityChange={onAccessibilityChange}
        />

        <main id="main-content" className="p-6" role="main">
          <div className="mb-6">
            <h1 className="text-[#1e2875] mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account and view your orders</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-white" role="tablist" aria-label="Profile sections">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending Orders</TabsTrigger>
              <TabsTrigger value="cart">Cart</TabsTrigger>
              <TabsTrigger value="payment">Payment Methods</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 mb-2">Total Orders</p>
                        <p className="text-[#1e2875]">{mockPurchaseHistory.length}</p>
                      </div>
                      <Package className="text-[#1e2875]" size={32} aria-hidden="true" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 mb-2">Total Spent</p>
                        <p className="text-[#1e2875]">${totalSpent.toFixed(2)}</p>
                      </div>
                      <DollarSign className="text-[#1e2875]" size={32} aria-hidden="true" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 mb-2">Pending Orders</p>
                        <p className="text-[#1e2875]">{mockPendingOrders.length}</p>
                      </div>
                      <Calendar className="text-[#1e2875]" size={32} aria-hidden="true" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 mb-2">Cart Items</p>
                        <p className="text-[#1e2875]">{mockCartItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                      </div>
                      <Package className="text-[#1e2875]" size={32} aria-hidden="true" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPurchaseHistory.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded">
                        <img src={order.image} alt={order.product} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <p>{order.product}</p>
                          <p className="text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#1e2875]">${order.price.toFixed(2)}</p>
                          <Badge className="bg-green-600">{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase History</CardTitle>
                  <CardDescription>View all your completed orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPurchaseHistory.map((order) => (
                      <div key={order.id} className="flex items-center gap-4 p-4 border rounded">
                        <img src={order.image} alt={order.product} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <p>{order.product}</p>
                          <p className="text-gray-600">Order Date: {new Date(order.date).toLocaleDateString()}</p>
                          <Badge className="mt-2 bg-green-600">{order.status}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-[#1e2875] mb-2">${order.price.toFixed(2)}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/product/${order.id}`)}
                            className="border-[#1e2875] text-[#1e2875] hover:bg-[#1e2875] hover:text-white"
                          >
                            Leave Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pending Orders Tab */}
            <TabsContent value="pending" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Orders</CardTitle>
                  <CardDescription>Track your in-progress orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPendingOrders.map((order) => (
                      <div key={order.id} className="p-4 border rounded">
                        <div className="flex items-center gap-4 mb-4">
                          <img src={order.image} alt={order.product} className="w-20 h-20 object-cover rounded" />
                          <div className="flex-1">
                            <p>{order.product}</p>
                            <p className="text-gray-600">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                            <Badge className="mt-2 bg-blue-600">{order.status}</Badge>
                          </div>
                          <p className="text-[#1e2875]">${order.price.toFixed(2)}</p>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="text-[#1e2875]" size={20} aria-hidden="true" />
                            <div>
                              <p className="text-gray-600">Estimated Delivery</p>
                              <p className="text-[#1e2875]">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleTrackOrder(order.trackingNumber)}
                            className="bg-[#1e2875] hover:bg-[#2a3490] focus:ring-2 focus:ring-yellow-400"
                          >
                            <MapPin className="mr-2" size={16} aria-hidden="true" />
                            Track Order
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cart Tab */}
            <TabsContent value="cart" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Shopping Cart</CardTitle>
                  <CardDescription>Items waiting to be checked out</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded">
                        <img src={item.image} alt={item.product} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <p>{item.product}</p>
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="text-[#1e2875]">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-6" />
                  <div className="flex items-center justify-between mb-6">
                    <p>Total:</p>
                    <p className="text-[#1e2875]">
                      ${mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-[#1e2875] hover:bg-[#2a3490] py-6 focus:ring-2 focus:ring-yellow-400"
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Methods Tab */}
            <TabsContent value="payment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center gap-4 p-4 border rounded">
                        <CreditCard className="text-[#1e2875]" size={32} aria-hidden="true" />
                        <div className="flex-1">
                          <p>{method.type}</p>
                          {method.last4 && (
                            <p className="text-gray-600">•••• {method.last4} - Expires {method.expiry}</p>
                          )}
                          {method.number && (
                            <p className="text-gray-600">{method.number} - {method.provider}</p>
                          )}
                        </div>
                        <Button variant="outline" size="sm" className="border-[#1e2875] text-[#1e2875]">
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-[#1e2875] hover:bg-[#2a3490] focus:ring-2 focus:ring-yellow-400">
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Account Details</CardTitle>
                      <CardDescription>Update your personal information</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                      className="border-[#1e2875] text-[#1e2875] hover:bg-[#1e2875] hover:text-white focus:ring-2 focus:ring-yellow-400"
                    >
                      <Edit className="mr-2" size={16} aria-hidden="true" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        disabled={!isEditing}
                        className="focus:border-[#1e2875] focus:ring-[#1e2875]"
                      />
                    </div>

                    {isEditing && (
                      <Button
                        onClick={handleSave}
                        className="w-full bg-[#1e2875] hover:bg-[#2a3490] focus:ring-2 focus:ring-yellow-400"
                      >
                        Save Changes
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

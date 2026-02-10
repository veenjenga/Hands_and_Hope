import { useState, useEffect } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { DashboardOverview } from './DashboardOverview';
import { ProductsPage } from './ProductsPage';
import { InquiriesPage } from './InquiriesPage';
import { NotificationsPage } from './NotificationsPage';
import { ProfilePage } from './ProfilePage';
import { SettingsPage } from './SettingsPage';
import { HelpPage } from './HelpPage';
import { CaregiverManagementPage } from './CaregiverManagementPage';
import { AccessibilityPanel } from './AccessibilityPanel';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ScreenReaderProvider } from '../contexts/ScreenReaderContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Accessibility, Wallet, TrendingUp, DollarSign, Package, 
  MessageSquare, AlertCircle, Calendar, Download, Printer,
  CreditCard, Smartphone, Building2, CheckCircle, XCircle,
  Truck, RefreshCcw, Star, BarChart3, Filter, Send, Eye,
  Clock, ArrowUpRight, ArrowDownRight, Plus, Upload, Trash2,
  Edit3, Save, X, School, Users, HelpCircle as HelpIcon, Loader
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';

type DashboardPage = 'dashboard' | 'products' | 'inquiries' | 'notifications' | 'profile' | 'settings' | 'help' | 
  'withdrawals' | 'analytics' | 'sales-history' | 'buyer-messages' | 'refunds' | 'shipments' | 'assistance' | 'caregivers';

interface SellerDashboardProps {
  onLogout: () => void;
  userRole?: 'seller' | 'student';
}

// Mock Data
const MOCK_WITHDRAWAL_HISTORY = [
  { id: 'w1', amount: 450.00, method: 'Mobile Money', provider: 'Safaricom', account: '0712345678', date: '2024-11-10', status: 'completed' },
  { id: 'w2', amount: 280.50, method: 'Bank Transfer', bank: 'KCB Bank', account: '1234567890', date: '2024-10-28', status: 'completed' },
  { id: 'w3', amount: 150.00, method: 'Mobile Money', provider: 'Airtel', account: '0723456789', date: '2024-10-15', status: 'completed' },
];

const MOCK_PENDING_ORDERS = [
  { 
    id: 'o1', 
    productName: 'Hand-painted Ceramic Bowl', 
    buyer: 'Sarah Johnson',
    buyerEmail: 'sarah@example.com',
    amount: 45.00, 
    status: 'awaiting_delivery', 
    orderDate: '2024-11-14',
    shippingMethod: 'self',
    trackingNumber: null
  },
  { 
    id: 'o2', 
    productName: 'Knitted Winter Scarf', 
    buyer: 'Michael Chen',
    buyerEmail: 'michael@example.com',
    amount: 35.00, 
    status: 'in_transit', 
    orderDate: '2024-11-12',
    shippingMethod: 'platform',
    trackingNumber: 'TRK-2024-001'
  },
];

const MOCK_COMPLETED_ORDERS = [
  { id: 'c1', productName: 'Handmade Jewelry', buyer: 'Emma Wilson', amount: 55.00, completedDate: '2024-11-08', rating: 5, feedback: 'Beautiful work!' },
  { id: 'c2', productName: 'Wooden Crafts', buyer: 'David Brown', amount: 40.00, completedDate: '2024-11-05', rating: 4, feedback: 'Great quality' },
];

const MOCK_REFUNDS = [
  { id: 'r1', productName: 'Ceramic Vase', buyer: 'Lisa Anderson', amount: 60.00, reason: 'Product arrived damaged', date: '2024-11-11', status: 'approved', refundDeadline: '2024-11-18' },
  { id: 'r2', productName: 'Painted Canvas', buyer: 'John Smith', amount: 80.00, reason: 'Not as described', date: '2024-11-09', status: 'pending', refundDeadline: '2024-11-16' },
];

const MOCK_BUYER_MESSAGES = [
  { id: 'm1', buyer: 'Sarah Johnson', buyerAvatar: 'SJ', message: 'When will my order ship?', productName: 'Ceramic Bowl', timestamp: '2024-11-15 2:30 PM', unread: true },
  { id: 'm2', buyer: 'Michael Chen', buyerAvatar: 'MC', message: 'Can you customize the color?', productName: 'Winter Scarf', timestamp: '2024-11-14 5:45 PM', unread: false },
];

const MOCK_SALES_DATA = {
  daily: { total: 125.50, count: 3, refunds: 0 },
  weekly: { total: 645.00, count: 12, refunds: 1 },
  monthly: { total: 2340.00, count: 48, refunds: 3 },
  yearly: { total: 15680.00, count: 287, refunds: 12 },
};

const MOCK_PRODUCT_VIEWS = {
  daily: 45,
  weekly: 234,
  monthly: 1023,
  yearly: 8945,
};

const MOCK_SOLD_OUT_PRODUCTS = [
  { id: 'so1', productName: 'Custom Necklace', lastSoldDate: '2024-11-14', totalSold: 15, avgTimeToSellOut: '3 days' },
  { id: 'so2', productName: 'Handmade Cards', lastSoldDate: '2024-11-10', totalSold: 25, avgTimeToSellOut: '5 days' },
];

export function SellerDashboard({ onLogout, userRole = 'seller' }: SellerDashboardProps) {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<DashboardPage>('dashboard');
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(true);
  const [voiceNavigation, setVoiceNavigation] = useState(true);
  
  // Dashboard data states - REAL DATA FROM BACKEND
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [engagement, setEngagement] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  
  // Withdrawal states
  const [withdrawalData, setWithdrawalData] = useState<any>(null);
  const [pendingDeliveries, setPendingDeliveries] = useState<any[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
  const [completedWithdrawals, setCompletedWithdrawals] = useState<any[]>([]);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [onHoldBalance, setOnHoldBalance] = useState(0);
  
  // Message states
  const [buyerMessages, setBuyerMessages] = useState<any[]>([]);
  const [selectedBuyerMessage, setSelectedBuyerMessage] = useState<string | null>(null);
  
  // Analytics states
  const [analyticsFilter, setAnalyticsFilter] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  
  // Refund states
  const [refundData, setRefundData] = useState<any>(null);
  const [pendingRefunds, setPendingRefunds] = useState<any[]>([]);
  const [approvedRefunds, setApprovedRefunds] = useState<any[]>([]);

  // Withdrawal method state - FIX FOR withdrawalMethod error
  const [withdrawalMethod, setWithdrawalMethod] = useState<'bank' | 'mobile'>('bank');
  const [paymentProvider, setPaymentProvider] = useState<'safaricom' | 'airtel'>('safaricom');

  // Assistance (student)
  const [teacherSubject, setTeacherSubject] = useState('');
  const [teacherMessage, setTeacherMessage] = useState('');
  const [schoolSubject, setSchoolSubject] = useState('');
  const [schoolMessage, setSchoolMessage] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:5000';
  const productViewsValue = typeof analyticsData?.productViews === 'number'
    ? analyticsData.productViews
    : (analyticsData?.productViews?.[analyticsFilter] ?? analyticsData?.productViews?.monthly ?? 0);

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch withdrawals
        const withdrawalsRes = await fetch(`${API_URL}/api/dashboard/withdrawals`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const withdrawalsData = await withdrawalsRes.json();
        setWithdrawalData(withdrawalsData);
        setAvailableBalance(withdrawalsData.availableBalance);
        setOnHoldBalance(withdrawalsData.onHoldBalance);
        setPendingDeliveries(withdrawalsData.pendingDeliveries);
        setWithdrawalRequests(withdrawalsData.withdrawalRequests);
        setCompletedWithdrawals(withdrawalsData.completedWithdrawals);
        
        // Fetch messages
        const messagesRes = await fetch(`${API_URL}/api/dashboard/messages`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const messagesData = await messagesRes.json();
        setBuyerMessages(Array.isArray(messagesData) ? messagesData : messagesData?.messages || []);
        
        // Fetch analytics
        const analyticsRes = await fetch(`${API_URL}/api/dashboard/analytics?period=${analyticsFilter}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const analyticsDataResult = await analyticsRes.json();
        setAnalyticsData(analyticsDataResult && typeof analyticsDataResult === 'object' && !Array.isArray(analyticsDataResult) ? analyticsDataResult : { daily: { total: 0 }, weekly: { total: 0 }, monthly: { total: 0 }, yearly: { total: 0 } });
        
        // Fetch refunds
        const refundsRes = await fetch(`${API_URL}/api/dashboard/refunds`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const refundsDataResult = await refundsRes.json();
        setRefundData(refundsDataResult);
        setPendingRefunds(Array.isArray(refundsDataResult?.pending) ? refundsDataResult.pending : []);
        setApprovedRefunds(Array.isArray(refundsDataResult?.approved) ? refundsDataResult.approved : []);
        
        // Fetch dashboard stats
        const statsRes = await fetch(`${API_URL}/api/dashboard/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        setDashboardStats(statsData);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.id) {
      fetchDashboardData();
    }
  }, [user, API_URL, analyticsFilter]);

  const fontSizeClass = fontSize === 'large' ? 'text-lg' : fontSize === 'extra-large' ? 'text-xl' : '';

  const handleAddProductClick = () => {
    setCurrentPage('products');
  };

  const handleVoiceNavigate = (page: string) => {
    const validPages: DashboardPage[] = ['dashboard', 'products', 'inquiries', 'notifications', 'profile', 'settings', 'help', 'withdrawals', 'analytics', 'sales-history', 'buyer-messages', 'refunds', 'shipments', 'assistance', 'caregivers'];
    if (validPages.includes(page as DashboardPage)) {
      setCurrentPage(page as DashboardPage);
    }
  };

  const handleWithdrawal = (amount: number) => {
    if (amount <= availableBalance) {
      setAvailableBalance(availableBalance - amount);
      alert(`Withdrawal of $${amount.toFixed(2)} initiated successfully!`);
    }
  };

  const handlePrintReport = (reportType: string) => {
    alert(`Printing ${reportType} report...`);
    window.print();
  };

  const handleExportCSV = (dataType: string) => {
    const headers = dataType === 'sales' 
      ? ['Date', 'Product', 'Amount', 'Status']
      : dataType === 'refunds'
      ? ['Date', 'Product', 'Buyer', 'Amount', 'Reason', 'Status']
      : ['Date', 'Amount', 'Method', 'Account', 'Status'];
    
    const csvContent = headers.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${dataType}_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendTeacherAssistance = async () => {
    if (!teacherSubject.trim() || !teacherMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/dashboard/assistance/teacher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ subject: teacherSubject, message: teacherMessage })
      });

      if (!res.ok) return;
      setTeacherSubject('');
      setTeacherMessage('');
      alert('Message sent to teacher');
    } catch (error) {
      console.error('Send teacher assistance error:', error);
    }
  };

  const handleSendSchoolAssistance = async () => {
    if (!schoolSubject.trim() || !schoolMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/dashboard/assistance/school`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ subject: schoolSubject, message: schoolMessage })
      });

      if (!res.ok) return;
      setSchoolSubject('');
      setSchoolMessage('');
      alert('Message sent to school administration');
    } catch (error) {
      console.error('Send school assistance error:', error);
    }
  };

  // Show loading screen while fetching data
  if (isLoading) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${highContrast ? 'bg-black text-white' : 'bg-gray-50'}`}>
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ScreenReaderProvider enabled={screenReader}>
    <div className={`flex min-h-screen ${highContrast ? 'bg-black text-white' : 'bg-gray-50'} ${fontSizeClass}`}>
      {/* Accessibility Button */}
      <button
        onClick={() => setShowAccessibility(!showAccessibility)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-yellow-600"
        aria-label="Toggle accessibility options"
        aria-expanded={showAccessibility}
      >
        <Accessibility className="h-8 w-8 text-gray-900" aria-hidden="true" />
      </button>

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
          onNavigate={handleVoiceNavigate}
        />
      )}

      <DashboardSidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        highContrast={highContrast}
        userRole={userRole}
      />

      <div className="flex-1">
        <DashboardHeader 
          onLogout={onLogout} 
          highContrast={highContrast} 
          userRole={userRole}
          onProfileClick={() => setCurrentPage('profile')}
          onNotificationsClick={() => setCurrentPage('notifications')}
          onAddProductClick={handleAddProductClick}
        />
        
        <main className="p-6">
          {currentPage === 'dashboard' && <DashboardOverview highContrast={highContrast} stats={dashboardStats} />}
          {currentPage === 'products' && <ProductsPage highContrast={highContrast} userRole={userRole} />}
          {currentPage === 'inquiries' && <InquiriesPage highContrast={highContrast} />}
          {currentPage === 'notifications' && <NotificationsPage userRole={userRole} highContrast={highContrast} />}
          {currentPage === 'profile' && <ProfilePage userRole={userRole} highContrast={highContrast} />}
          {currentPage === 'settings' && <SettingsPage highContrast={highContrast} userRole={userRole} />}
          {currentPage === 'help' && <HelpPage highContrast={highContrast} userRole={userRole} />}
          {currentPage === 'caregivers' && <CaregiverManagementPage />}

          {/* WITHDRAWALS PAGE */}
          {currentPage === 'withdrawals' && (
            <div className="space-y-8">
              <div>
                <h1>Withdrawals & Payments</h1>
                <p className={`mt-2 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  Manage your earnings and withdrawal methods
                </p>
              </div>

              {/* Balance Cards */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card className={`${highContrast ? 'border-2 border-white bg-black' : 'border-0 bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-100">Available Balance</p>
                        <h2 className="mt-2 text-white">${availableBalance.toFixed(2)}</h2>
                        <p className="text-xs text-green-100 mt-1">Ready to withdraw</p>
                      </div>
                      <Wallet className="h-12 w-12 text-white opacity-80" />
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${highContrast ? 'border-2 border-white bg-black' : 'border-0 bg-gradient-to-br from-orange-500 to-red-500 shadow-lg'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-100">On Hold</p>
                        <h2 className="mt-2 text-white">${onHoldBalance.toFixed(2)}</h2>
                        <p className="text-xs text-orange-100 mt-1">{pendingDeliveries.length} orders pending delivery</p>
                      </div>
                      <Clock className="h-12 w-12 text-white opacity-80" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pending Orders - Money on Hold */}
              <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Pending Deliveries</CardTitle>
                      <p className={`mt-1 text-sm ${highContrast ? 'text-gray-300' : 'text-gray-500'}`}>
                        Money will be released when buyers confirm receipt
                      </p>
                    </div>
                    <Badge variant="secondary">{pendingDeliveries.length} Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingDeliveries.length === 0 ? (
                      <p className={highContrast ? 'text-gray-300' : 'text-gray-500'}>No pending deliveries</p>
                    ) : (
                      pendingDeliveries.map((order) => (
                        <div
                          key={order.id}
                          className={`flex items-center justify-between rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <Package className="h-5 w-5 text-blue-600" />
                              <div>
                                <h4 className={`font-semibold ${highContrast ? 'text-white' : 'text-gray-900'}`}>{order.productName}</h4>
                                <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                                  Buyer: {order.buyerName} • Ordered: {order.orderDate}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-green-600">${order.amount.toFixed(2)}</p>
                            <Badge variant={order.status === 'in_transit' ? 'default' : 'secondary'}>
                              {order.status === 'in_transit' ? 'In Transit' : 'Awaiting Delivery'}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Withdrawal Request */}
              <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                <CardHeader>
                  <CardTitle>Request Withdrawal</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="method" className="space-y-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                      <TabsTrigger value="method">Payment Method</TabsTrigger>
                      <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                    </TabsList>

                    <TabsContent value="method" className="space-y-6">
                      <div className="space-y-4">
                        <Label>Select Withdrawal Method</Label>
                        <div className="grid gap-4 md:grid-cols-2">
                          <button
                            onClick={() => setWithdrawalMethod('bank')}
                            className={`flex items-center gap-4 rounded-lg border-2 p-6 transition-all ${
                              withdrawalMethod === 'bank'
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            <Building2 className="h-8 w-8 text-blue-600" />
                            <div className="text-left">
                              <h4 className="font-semibold">Bank Transfer</h4>
                              <p className="text-sm text-gray-600">Direct to your bank account</p>
                            </div>
                          </button>

                          <button
                            onClick={() => setWithdrawalMethod('mobile')}
                            className={`flex items-center gap-4 rounded-lg border-2 p-6 transition-all ${
                              withdrawalMethod === 'mobile'
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            <Smartphone className="h-8 w-8 text-green-600" />
                            <div className="text-left">
                              <h4 className="font-semibold">Mobile Money</h4>
                              <p className="text-sm text-gray-600">Safaricom or Airtel</p>
                            </div>
                          </button>
                        </div>
                      </div>

                      {withdrawalMethod === 'bank' && (
                        <div className="space-y-4 rounded-lg border p-6">
                          <h4 className="font-semibold">Bank Account Details</h4>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="bankName">Bank Name *</Label>
                              <Input id="bankName" placeholder="e.g., KCB Bank" className="h-12" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="accountNumber">Account Number *</Label>
                              <Input id="accountNumber" placeholder="1234567890" className="h-12" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="accountName">Account Name *</Label>
                              <Input id="accountName" placeholder="Your full name" className="h-12" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="branchCode">Branch Code</Label>
                              <Input id="branchCode" placeholder="Optional" className="h-12" />
                            </div>
                          </div>
                          <Button size="lg" className="w-full">
                            <Save className="h-4 w-4 mr-2" />
                            Save Bank Details
                          </Button>
                        </div>
                      )}

                      {withdrawalMethod === 'mobile' && (
                        <div className="space-y-4 rounded-lg border p-6">
                          <h4 className="font-semibold">Mobile Money Details</h4>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Select Provider *</Label>
                              <div className="grid gap-4 sm:grid-cols-2">
                                <button
                                  onClick={() => setPaymentProvider('safaricom')}
                                  className={`flex items-center gap-3 rounded-lg border-2 p-4 ${
                                    paymentProvider === 'safaricom'
                                      ? 'border-green-600 bg-green-50'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  <Smartphone className="h-6 w-6 text-green-600" />
                                  <span className="font-semibold">Safaricom M-PESA</span>
                                </button>
                                <button
                                  onClick={() => setPaymentProvider('airtel')}
                                  className={`flex items-center gap-3 rounded-lg border-2 p-4 ${
                                    paymentProvider === 'airtel'
                                      ? 'border-red-600 bg-red-50'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  <Smartphone className="h-6 w-6 text-red-600" />
                                  <span className="font-semibold">Airtel Money</span>
                                </button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mobileNumber">Phone Number *</Label>
                              <Input id="mobileNumber" placeholder="0712345678" className="h-12" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="accountNameMobile">Account Name *</Label>
                              <Input id="accountNameMobile" placeholder="Your full name" className="h-12" />
                            </div>
                          </div>
                          <Button size="lg" className="w-full">
                            <Save className="h-4 w-4 mr-2" />
                            Save Mobile Money Details
                          </Button>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="withdraw" className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="withdrawAmount">Withdrawal Amount</Label>
                          <Input
                            id="withdrawAmount"
                            type="number"
                            placeholder="Enter amount"
                            max={availableBalance}
                            className="h-12"
                          />
                          <p className="text-sm text-gray-500">
                            Available: ${availableBalance.toFixed(2)}
                          </p>
                        </div>
                        <Button
                          size="lg"
                          className="w-full"
                          onClick={() => {
                            const amount = parseFloat((document.getElementById('withdrawAmount') as HTMLInputElement).value);
                            if (amount > 0) handleWithdrawal(amount);
                          }}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Request Withdrawal
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Withdrawal History */}
              <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Withdrawal History</CardTitle>
                    <Button variant="outline" onClick={() => handleExportCSV('withdrawals')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedWithdrawals.length === 0 ? (
                      <p className={highContrast ? 'text-gray-300' : 'text-gray-500'}>No completed withdrawals yet</p>
                    ) : (
                      completedWithdrawals.map((withdrawal) => (
                        <div
                          key={withdrawal.id}
                          className={`flex items-center justify-between rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              withdrawal.method === 'bank' ? 'bg-blue-100' : 'bg-green-100'
                            }`}>
                              {withdrawal.method === 'bank' ? (
                                <Building2 className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Smartphone className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            <div>
                              <h4 className={`font-semibold ${highContrast ? 'text-white' : 'text-gray-900'}`}>
                                ${withdrawal.amount.toFixed(2)}
                              </h4>
                              <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                                {withdrawal.method === 'bank' ? withdrawal.bankName : withdrawal.provider}
                              </p>
                              <p className={`text-xs ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                                {new Date(withdrawal.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ANALYTICS PAGE */}
          {currentPage === 'analytics' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1>Sales Analytics</h1>
                  <p className={`mt-2 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                    Track your sales performance and buyer engagement
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => handlePrintReport('analytics')}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Report
                  </Button>
                  <Button variant="outline" onClick={() => handleExportCSV('sales')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>

              {/* Time Filter */}
              <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Filter className="h-5 w-5 text-gray-600" />
                    <Label htmlFor="analyticsFilter">Time Period:</Label>
                    <Select value={analyticsFilter} onValueChange={(value: any) => setAnalyticsFilter(value)}>
                      <SelectTrigger id="analyticsFilter" className="w-48 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Sales Stats */}
              <div className="grid gap-6 md:grid-cols-4">
                <Card className={`${highContrast ? 'border-2 border-white bg-black' : 'border-0 bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-100">Total Sales</p>
                        <h2 className="mt-2 text-white">${analyticsData?.sales?.total || '0.00'}</h2>
                        <div className="flex items-center gap-1 mt-1">
                          <ArrowUpRight className="h-4 w-4 text-green-100" />
                          <span className="text-xs text-green-100">Period: {analyticsFilter}</span>
                        </div>
                      </div>
                      <DollarSign className="h-12 w-12 text-white opacity-80" />
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${highContrast ? 'border-2 border-white bg-black' : 'border-0 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-100">Orders</p>
                        <h2 className="mt-2 text-white">{analyticsData?.orders?.total || 0}</h2>
                        <div className="flex items-center gap-1 mt-1">
                          <ArrowUpRight className="h-4 w-4 text-blue-100" />
                          <span className="text-xs text-blue-100">Completed: {analyticsData?.orders?.completed || 0}</span>
                        </div>
                      </div>
                      <Package className="h-12 w-12 text-white opacity-80" />
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${highContrast ? 'border-2 border-white bg-black' : 'border-0 bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-100">Product Views</p>
                        <h2 className="mt-2 text-white">{productViewsValue}</h2>
                        <div className="flex items-center gap-1 mt-1">
                          <ArrowUpRight className="h-4 w-4 text-purple-100" />
                          <span className="text-xs text-purple-100">Total: {productViewsValue}</span>
                        </div>
                      </div>
                      <Eye className="h-12 w-12 text-white opacity-80" />
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${highContrast ? 'border-2 border-white bg-black' : 'border-0 bg-gradient-to-br from-orange-500 to-red-500 shadow-lg'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-100">Refunds</p>
                        <h2 className="mt-2 text-white">{analyticsData?.refunds?.count || 0}</h2>
                        <div className="flex items-center gap-1 mt-1">
                          <ArrowDownRight className="h-4 w-4 text-orange-100" />
                          <span className="text-xs text-orange-100">Amount: ${analyticsData?.refunds?.totalAmount || '0.00'}</span>
                        </div>
                      </div>
                      <RefreshCcw className="h-12 w-12 text-white opacity-80" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sold Out Products - Demand Analysis */}
              <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Sold Out Products - Demand Analysis
                  </CardTitle>
                  <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-500'}`}>
                    Track which products sell out fastest to understand demand
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {analyticsData?.soldOutProducts?.length === 0 ? (
                      <p className={highContrast ? 'text-gray-300' : 'text-gray-500'}>No sold out products yet</p>
                    ) : (
                      analyticsData?.soldOutProducts?.map((product: any) => (
                        <div
                          key={product.id}
                          className={`flex items-center justify-between rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}
                        >
                          <div className="flex-1">
                            <h4 className={`font-semibold ${highContrast ? 'text-white' : 'text-gray-900'}`}>
                              {product.productName}
                            </h4>
                            <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                              Last sold: {new Date(product.lastSoldDate).toLocaleDateString()} • Total sold: {product.totalSold} units
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">Demand: High</Badge>
                            <p className="text-xs text-gray-500 mt-1">Popular Product</p>
                          </div>
                        </div>
                    )))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* BUYER MESSAGES PAGE */}
          {currentPage === 'buyer-messages' && (
            <div className="space-y-8">
              <div>
                <h1>Buyer Messages</h1>
                <p className={`mt-2 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  Communicate with your customers
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {/* Messages List */}
                <Card className={`lg:col-span-1 ${highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}`}>
                  <CardHeader>
                    <CardTitle>Messages ({buyerMessages.filter(m => m.unread).length} unread)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {buyerMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <MessageSquare className="h-12 w-12 text-gray-400 mb-2" />
                        <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>No messages yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {buyerMessages.map((msg) => (
                          <button
                            key={msg.id}
                            onClick={() => setSelectedBuyerMessage(msg.id)}
                            className={`w-full text-left rounded-lg border p-4 transition-colors ${
                              selectedBuyerMessage === msg.id
                                ? 'border-blue-600 bg-blue-50'
                                : msg.unread
                                ? 'border-gray-300 bg-yellow-50'
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{msg.fromAvatar}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-gray-900 truncate">{msg.from}</h4>
                                  {msg.unread && <Badge variant="default" className="text-xs">New</Badge>}
                                </div>
                                <p className="text-sm text-gray-600 truncate">{msg.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{new Date(msg.timestamp).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Message Detail */}
                <Card className={`lg:col-span-2 ${highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}`}>
                  <CardHeader>
                    <CardTitle>
                      {selectedBuyerMessage
                        ? buyerMessages.find(m => m.id === selectedBuyerMessage)?.from
                        : 'Select a message'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedBuyerMessage ? (
                      <div className="space-y-6">
                        <div className={`rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}>
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {buyerMessages.find(m => m.id === selectedBuyerMessage)?.fromAvatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold">
                                    {buyerMessages.find(m => m.id === selectedBuyerMessage)?.from}
                                  </h4>
                                  <p className={`text-xs ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {buyerMessages.find(m => m.id === selectedBuyerMessage)?.fromEmail}
                                  </p>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(buyerMessages.find(m => m.id === selectedBuyerMessage)?.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">
                                Re: {buyerMessages.find(m => m.id === selectedBuyerMessage)?.productName}
                              </p>
                              <p className="mt-3">
                                {buyerMessages.find(m => m.id === selectedBuyerMessage)?.message}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="replyMessage">Your Reply</Label>
                          <Textarea
                            id="replyMessage"
                            placeholder="Type your message here..."
                            className="min-h-[150px]"
                          />
                          <Button size="lg" className="w-full">
                            <Send className="h-4 w-4 mr-2" />
                            Send Reply
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <MessageSquare className="h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-gray-600">No message selected</h3>
                        <p className="text-sm text-gray-500 mt-2">Select a conversation to view and reply</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* REFUNDS PAGE */}
          {currentPage === 'refunds' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1>Refunds Management</h1>
                  <p className={`mt-2 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                    Handle product returns and refund requests
                  </p>
                </div>
                <Button variant="outline" onClick={() => handleExportCSV('refunds')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Refunds Report
                </Button>
              </div>

              <Tabs defaultValue="pending" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="pending">Pending Refunds ({pendingRefunds.length})</TabsTrigger>
                  <TabsTrigger value="approved">Approved Refunds ({approvedRefunds.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                  {pendingRefunds.length === 0 ? (
                    <Card className="p-12 text-center">
                      <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-gray-600">No Pending Refunds</h3>
                    </Card>
                  ) : (
                    pendingRefunds.map((refund) => (
                      <Card key={refund.id} className={highContrast ? 'border-2 border-white bg-black' : 'shadow-md'}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className={highContrast ? 'text-white' : 'text-gray-900'}>{refund.productName}</h3>
                              <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                                Buyer: {refund.buyerName} • Amount: ${refund.amount.toFixed(2)}
                              </p>
                            </div>
                            <Badge variant="secondary">Pending Review</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4 border-t pt-4">
                          <div className={`rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}>
                            <p className="text-sm font-semibold mb-2">Refund Reason:</p>
                            <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-700'}`}>{refund.reason}</p>
                            <p className={`text-xs ${highContrast ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                              Requested: {new Date(refund.requestDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <Button size="lg" className="flex-1">
                              <CheckCircle className="h-5 w-5 mr-2" />
                              Approve Refund
                            </Button>
                            <Button variant="destructive" size="lg" className="flex-1">
                              <XCircle className="h-5 w-5 mr-2" />
                              Reject Refund
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="approved" className="space-y-4">
                  {approvedRefunds.length === 0 ? (
                    <Card className="p-12 text-center">
                      <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-gray-600">No Approved Refunds</h3>
                    </Card>
                  ) : (
                    approvedRefunds.map((refund) => (
                      <Card key={refund.id} className={`${highContrast ? 'border-2 border-green-500 bg-black' : 'border-green-200 bg-green-50 shadow-md'}`}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className={highContrast ? 'text-white' : 'text-gray-900'}>{refund.productName}</h3>
                              <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                                Buyer: {refund.buyerName} • Refunded: ${refund.amount.toFixed(2)}
                              </p>
                            </div>
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2 border-t pt-4">
                          <p className={`text-xs ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                            Approved: {new Date(refund.approvalDate).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>

              {/* Refund Stats */}
              <div className="grid gap-6 md:grid-cols-3">
                <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Refunds (Monthly)</p>
                        <h3 className="mt-2">{(refundData?.stats?.pendingCount || 0) + (refundData?.stats?.approvedCount || 0)}</h3>
                      </div>
                      <RefreshCcw className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Refund Rate</p>
                        <h3 className="mt-2">{refundData?.stats?.refundRate || '0'}%</h3>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Refunded Amount</p>
                        <h3 className="mt-2">${(parseFloat(refundData?.stats?.totalApproved || 0) + parseFloat(refundData?.stats?.totalPending || 0)).toFixed(2)}</h3>
                      </div>
                      <DollarSign className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* SHIPMENTS PAGE */}
          {currentPage === 'shipments' && (
            <div className="space-y-8">
              <div>
                <h1>Shipment Management</h1>
                <p className={`mt-2 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  Track and manage product deliveries
                </p>
              </div>

              <Tabs defaultValue="pending" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="pending">Pending Shipments</TabsTrigger>
                  <TabsTrigger value="transit">In Transit</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                  {MOCK_PENDING_ORDERS.filter(o => o.status === 'awaiting_delivery').map((order) => (
                    <Card key={order.id} className={highContrast ? 'border-2 border-white bg-black' : 'shadow-md'}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={highContrast ? 'text-white' : 'text-gray-900'}>{order.productName}</h3>
                            <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                              Buyer: {order.buyer} ({order.buyerEmail})
                            </p>
                          </div>
                          <Badge variant="secondary">Awaiting Shipment</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 border-t pt-4">
                        <div className="space-y-3">
                          <Label>Shipment Method</Label>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <button className="flex items-center gap-3 rounded-lg border-2 border-blue-600 bg-blue-50 p-4">
                              <Truck className="h-6 w-6 text-blue-600" />
                              <div className="text-left">
                                <h4 className="font-semibold">Handle Myself</h4>
                                <p className="text-sm text-gray-600">I'll ship this product</p>
                              </div>
                            </button>
                            <button className="flex items-center gap-3 rounded-lg border-2 border-gray-300 p-4">
                              <Package className="h-6 w-6 text-purple-600" />
                              <div className="text-left">
                                <h4 className="font-semibold">Platform Shipping</h4>
                                <p className="text-sm text-gray-600">We'll handle it</p>
                              </div>
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`tracking-${order.id}`}>Tracking Number (Optional)</Label>
                          <Input id={`tracking-${order.id}`} placeholder="Enter tracking number" className="h-12" />
                        </div>
                        <Button size="lg" className="w-full">
                          <Truck className="h-4 w-4 mr-2" />
                          Mark as Shipped
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="transit" className="space-y-4">
                  {MOCK_PENDING_ORDERS.filter(o => o.status === 'in_transit').map((order) => (
                    <Card key={order.id} className={highContrast ? 'border-2 border-white bg-black' : 'shadow-md'}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={highContrast ? 'text-white' : 'text-gray-900'}>{order.productName}</h3>
                            <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                              Buyer: {order.buyer}
                            </p>
                          </div>
                          <Badge variant="default">In Transit</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="border-t pt-4">
                        <div className={`rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}>
                          <p className="text-sm font-semibold mb-1">Tracking Number:</p>
                          <p className="text-sm">{order.trackingNumber}</p>
                          <p className="text-xs text-gray-500 mt-2">Shipped via: Platform Shipping</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="delivered" className="space-y-4">
                  {MOCK_COMPLETED_ORDERS.map((order) => (
                    <Card key={order.id} className={`${highContrast ? 'border-2 border-green-500 bg-black' : 'border-green-200 bg-green-50 shadow-md'}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={highContrast ? 'text-white' : 'text-gray-900'}>{order.productName}</h3>
                            <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                              Buyer: {order.buyer} • Delivered: {order.completedDate}
                            </p>
                          </div>
                          <Badge variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Delivered
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="border-t pt-4">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{order.rating}/5</span>
                          <span className="text-sm text-gray-600 ml-2">{order.feedback}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* ASSISTANCE PAGE (Student Only) */}
          {currentPage === 'assistance' && userRole === 'student' && (
            <div className="space-y-8">
              <div>
                <h1>Request Assistance</h1>
                <p className={`mt-2 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  Get help from your teacher or school administration
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Message Teacher
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="teacherSubject">Subject</Label>
                      <Input
                        id="teacherSubject"
                        value={teacherSubject}
                        onChange={(e) => setTeacherSubject(e.target.value)}
                        placeholder="What do you need help with?"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teacherMessage">Message</Label>
                      <Textarea
                        id="teacherMessage"
                        value={teacherMessage}
                        onChange={(e) => setTeacherMessage(e.target.value)}
                        placeholder="Describe your issue or question..."
                        className="min-h-[150px]"
                      />
                    </div>
                    <Button size="lg" className="w-full" onClick={handleSendTeacherAssistance}>
                      <Send className="h-4 w-4 mr-2" />
                      Send to Teacher
                    </Button>
                  </CardContent>
                </Card>

                <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <School className="h-5 w-5" />
                      Message School Administration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="schoolSubject">Subject</Label>
                      <Input
                        id="schoolSubject"
                        value={schoolSubject}
                        onChange={(e) => setSchoolSubject(e.target.value)}
                        placeholder="What do you need help with?"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schoolMessage">Message</Label>
                      <Textarea
                        id="schoolMessage"
                        value={schoolMessage}
                        onChange={(e) => setSchoolMessage(e.target.value)}
                        placeholder="Describe your issue or question..."
                        className="min-h-[150px]"
                      />
                    </div>
                    <Button size="lg" className="w-full" onClick={handleSendSchoolAssistance}>
                      <Send className="h-4 w-4 mr-2" />
                      Send to School Admin
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className={highContrast ? 'border-2 border-blue-500 bg-black' : 'bg-blue-50 border-blue-200'}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <HelpIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                      <p className="text-sm text-blue-800">
                        Your teacher and school administrators are here to support you. Don't hesitate to reach out if you need 
                        assistance with product listings, sales, or any other questions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
    </ScreenReaderProvider>
  );
}

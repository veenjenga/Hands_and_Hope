import { useState } from 'react';
import { 
  Shield, Users, Building2, GraduationCap, UserCheck, UserX, 
  DollarSign, TrendingUp, Package, AlertTriangle, Eye, MapPin,
  BarChart3, Activity, FileText, LogOut, Settings, Bell, User,
  Plus, CheckCircle, XCircle, Ban, Search, Filter, Download,
  Calendar, Clock, Globe, School, ShoppingBag, Heart, Key,
  Lock, Unlock, RefreshCw, ChevronDown, ChevronUp, Edit, Trash2,
  MessageSquare, History, UserCog, Database, Printer, UserPlus, Truck, Wallet
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
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AdminCaregiverManagement } from './AdminCaregiverManagement';
import { AdminLocationsPage } from './admin/AdminLocationsPage';
import { AdminReportsPage } from './admin/AdminReportsPage';
import { AdminDeactivatedAccountsPage } from './admin/AdminDeactivatedAccountsPage';
import { AdminNotificationsPage } from './admin/AdminNotificationsPage';
import { AdminProfilePage } from './admin/AdminProfilePage';
import { AdminSettingsPage } from './admin/AdminSettingsPage';
import { AdminSchoolHierarchyPage } from './admin/AdminSchoolHierarchyPage';
import { AdminEnhancedAnalyticsPage } from './admin/AdminEnhancedAnalyticsPage';
import { AdminTransactionsCommissionPage } from './admin/AdminTransactionsCommissionPage';
import { AdminFundsOnHoldPage } from './admin/AdminFundsOnHoldPage';
import { AdminShipmentTrackingPage } from './admin/AdminShipmentTrackingPage';
import { AdminMessagesInquiriesPage } from './admin/AdminMessagesInquiriesPage';

type AdminPage = 'dashboard' | 'users' | 'accounts-pending' | 'products' | 'transactions' | 'analytics' | 
  'locations' | 'reports' | 'deactivated' | 'admins' | 'hierarchy' | 'notifications' | 'profile' | 'settings' | 'caregivers' |
  'funds-on-hold' | 'shipments' | 'messages';

interface AdminDashboardProps {
  onLogout: () => void;
  adminRole: 'super-admin' | 'admin';
}

// Mock Data
const MOCK_PENDING_ACCOUNTS = [
  { 
    id: 'pa1', 
    type: 'individual', 
    name: 'John Anderson', 
    email: 'john@example.com', 
    disabilityId: 'DIS-2024-301',
    documents: ['disability_certificate.pdf', 'id_document.pdf'],
    location: 'Nairobi, Kenya',
    requestedDate: '2024-11-14',
    status: 'pending'
  },
  { 
    id: 'pa2', 
    type: 'school', 
    name: 'Bright Future Academy', 
    email: 'admin@brightfuture.edu', 
    registrationNumber: 'SCH-2024-445',
    documents: ['school_license.pdf', 'registration_certificate.pdf'],
    location: 'Mombasa, Kenya',
    requestedDate: '2024-11-15',
    status: 'pending'
  },
];

const MOCK_ALL_USERS = [
  { id: 'u1', type: 'individual', name: 'Sarah Williams', email: 'sarah@example.com', status: 'active', location: 'Nairobi', joinDate: '2024-09-15', totalSales: 2450.00, productsListed: 8 },
  { id: 'u2', type: 'school', name: 'Hope Academy', email: 'admin@hope.edu', status: 'active', location: 'Kisumu', joinDate: '2024-08-10', teachers: 15, students: 120 },
  { id: 'u3', type: 'buyer', name: 'Michael Chen', email: 'michael@example.com', status: 'active', location: 'Nairobi', joinDate: '2024-10-20', totalPurchases: 890.50 },
  { id: 'u4', type: 'individual', name: 'Emma Johnson', email: 'emma@example.com', status: 'banned', location: 'Mombasa', joinDate: '2024-10-01', banReason: 'Fraudulent activity', bannedDate: '2024-11-10' },
];

const MOCK_TRANSACTIONS = [
  { id: 't1', userId: 'u1', userName: 'Sarah Williams', type: 'sale', amount: 45.00, product: 'Ceramic Bowl', date: '2024-11-15 10:30 AM', status: 'completed' },
  { id: 't2', userId: 'u3', userName: 'Michael Chen', type: 'purchase', amount: 120.00, product: 'Painting', date: '2024-11-14 2:45 PM', status: 'completed' },
  { id: 't3', userId: 'u1', userName: 'Sarah Williams', type: 'withdrawal', amount: 280.50, method: 'Bank Transfer', date: '2024-11-13 11:20 AM', status: 'completed' },
];

const MOCK_PENDING_PRODUCTS = [
  { id: 'pp1', sellerId: 'u1', sellerName: 'Sarah Williams', productName: 'Hand-painted Vase', price: 65.00, category: 'Pottery', images: 4, submittedDate: '2024-11-14', documents: ['product_photo_1.jpg', 'product_photo_2.jpg'] },
  { id: 'pp2', sellerId: 'u4', sellerName: 'Emma Johnson', productName: 'Wooden Sculpture', price: 150.00, category: 'Woodwork', images: 5, submittedDate: '2024-11-15', documents: ['product_photo_1.jpg'] },
];

const MOCK_REPORTS = [
  { id: 'r1', reporterId: 'u3', reporterName: 'Michael Chen', reportedUser: 'Sarah Williams', reportedUserId: 'u1', reason: 'Product not as described', date: '2024-11-12', status: 'pending' },
  { id: 'r2', reporterId: 'u2', reporterName: 'Hope Academy', reportedUser: 'Emma Johnson', reportedUserId: 'u4', reason: 'Inappropriate behavior', date: '2024-11-10', status: 'resolved' },
];

const MOCK_SIGNUP_STATS = {
  daily: { individuals: 3, schools: 0, students: 5, teachers: 1, buyers: 8 },
  weekly: { individuals: 15, schools: 2, students: 32, teachers: 6, buyers: 45 },
  monthly: { individuals: 68, schools: 8, students: 145, teachers: 28, buyers: 234 },
  yearly: { individuals: 420, schools: 45, students: 1250, teachers: 180, buyers: 1890 },
};

const MOCK_LOCATION_DATA = [
  { location: 'Nairobi', schools: 25, teachers: 180, students: 1240, individuals: 150, buyers: 890 },
  { location: 'Mombasa', schools: 15, teachers: 95, students: 680, individuals: 85, buyers: 450 },
  { location: 'Kisumu', schools: 12, teachers: 78, students: 520, individuals: 62, buyers: 320 },
];

const MOCK_ADMINS = [
  { id: 'a1', name: 'Super Admin', email: 'superadmin@handsandhope.com', role: 'super-admin', createdDate: '2024-01-01', lastLogin: '2024-11-16 09:00 AM', status: 'active' },
  { id: 'a2', name: 'John Smith', email: 'john.smith@handsandhope.com', role: 'admin', createdDate: '2024-06-15', lastLogin: '2024-11-15 3:30 PM', status: 'active', createdBy: 'Super Admin' },
];

export function AdminDashboard({ onLogout, adminRole }: AdminDashboardProps) {
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [impersonateUser, setImpersonateUser] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleApproveAccount = (accountId: string) => {
    alert(`Account ${accountId} approved successfully!`);
  };

  const handleDeclineAccount = (accountId: string, reason: string) => {
    if (reason.trim()) {
      alert(`Account ${accountId} declined. Reason: ${reason}`);
    }
  };

  const handleBanUser = (userId: string, reason: string) => {
    if (reason.trim()) {
      alert(`User ${userId} banned. Reason: ${reason}`);
    }
  };

  const handleActivateUser = (userId: string) => {
    alert(`User ${userId} reactivated successfully!`);
  };

  const handleApproveProduct = (productId: string) => {
    alert(`Product ${productId} approved!`);
  };

  const handleDeclineProduct = (productId: string, reason: string) => {
    if (reason.trim()) {
      alert(`Product ${productId} declined. Reason: ${reason}`);
    }
  };

  const handleControlMoney = (userId: string, action: 'release' | 'hold', amount: number) => {
    alert(`${action === 'release' ? 'Released' : 'Put on hold'} $${amount} for user ${userId}`);
  };

  const handleImpersonate = (userId: string) => {
    if (confirm(`Are you sure you want to login as this user? This action will be logged.`)) {
      setImpersonateUser(userId);
      alert(`Now viewing as user ${userId}. All actions are being logged.`);
    }
  };

  const handleExportData = (dataType: string) => {
    alert(`Exporting ${dataType} data...`);
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <Shield className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-white font-bold">Admin Panel</h2>
              <p className="text-xs text-blue-100">{adminRole === 'super-admin' ? 'Super Administrator' : 'Administrator'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'users', label: 'All Users', icon: Users },
            { id: 'accounts-pending', label: 'Pending Approvals', icon: Clock, badge: MOCK_PENDING_ACCOUNTS.length },
            { id: 'products', label: 'Product Approvals', icon: Package, badge: MOCK_PENDING_PRODUCTS.length },
            { id: 'caregivers', label: 'Caregiver Management', icon: UserPlus },
            { id: 'transactions', label: 'Transactions', icon: DollarSign },
            { id: 'funds-on-hold', label: 'Funds on Hold', icon: Wallet },
            { id: 'analytics', label: 'Analytics & Stats', icon: TrendingUp },
            { id: 'shipments', label: 'Shipment Tracking', icon: Truck },
            { id: 'messages', label: 'Messages & Inquiries', icon: MessageSquare },
            { id: 'locations', label: 'Locations', icon: MapPin },
            { id: 'hierarchy', label: 'School Hierarchy', icon: School },
            { id: 'reports', label: 'Reports', icon: AlertTriangle, badge: MOCK_REPORTS.filter(r => r.status === 'pending').length },
            { id: 'deactivated', label: 'Deactivated Accounts', icon: UserX },
            ...(adminRole === 'super-admin' ? [{ id: 'admins' as AdminPage, label: 'Admin Management', icon: UserCog }] : []),
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as AdminPage)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </div>
              {item.badge && item.badge > 0 && (
                <Badge variant="destructive" className="text-xs">{item.badge}</Badge>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <Button 
            variant="outline" 
            className="w-full gap-2 border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {currentPage.charAt(0).toUpperCase() + currentPage.slice(1).replace('-', ' ')}
              </h1>
              <p className="text-sm text-gray-400 mt-1">Hands and Hope Platform Control Center</p>
            </div>
            <div className="flex items-center gap-4">
              {impersonateUser && (
                <div className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-semibold">Viewing as User</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="ml-2 h-6 text-xs"
                    onClick={() => setImpersonateUser(null)}
                  >
                    Exit
                  </Button>
                </div>
              )}
              <Button variant="outline" size="sm" className="gap-2 border-gray-600 text-gray-300">
                <Bell className="h-4 w-4" />
                <Badge variant="destructive" className="text-xs">3</Badge>
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-900">
          {/* DASHBOARD */}
          {currentPage === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid gap-6 md:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-100">Total Users</p>
                        <h2 className="text-3xl font-bold mt-2">{MOCK_ALL_USERS.length}</h2>
                      </div>
                      <Users className="h-12 w-12 opacity-80" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-100">Pending Approvals</p>
                        <h2 className="text-3xl font-bold mt-2">{MOCK_PENDING_ACCOUNTS.length}</h2>
                      </div>
                      <Clock className="h-12 w-12 opacity-80" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-100">Total Transactions</p>
                        <h2 className="text-3xl font-bold mt-2">{MOCK_TRANSACTIONS.length}</h2>
                      </div>
                      <DollarSign className="h-12 w-12 opacity-80" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-600 to-red-600 border-0 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-100">Pending Reports</p>
                        <h2 className="text-3xl font-bold mt-2">{MOCK_REPORTS.filter(r => r.status === 'pending').length}</h2>
                      </div>
                      <AlertTriangle className="h-12 w-12 opacity-80" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <Button 
                      className="h-20 bg-blue-600 hover:bg-blue-700"
                      onClick={() => setCurrentPage('accounts-pending')}
                    >
                      <div className="text-center">
                        <CheckCircle className="h-6 w-6 mx-auto mb-1" />
                        <div className="text-sm">Review Approvals</div>
                      </div>
                    </Button>
                    <Button 
                      className="h-20 bg-purple-600 hover:bg-purple-700"
                      onClick={() => setCurrentPage('users')}
                    >
                      <div className="text-center">
                        <Users className="h-6 w-6 mx-auto mb-1" />
                        <div className="text-sm">Manage Users</div>
                      </div>
                    </Button>
                    <Button 
                      className="h-20 bg-green-600 hover:bg-green-700"
                      onClick={() => setCurrentPage('analytics')}
                    >
                      <div className="text-center">
                        <BarChart3 className="h-6 w-6 mx-auto mb-1" />
                        <div className="text-sm">View Analytics</div>
                      </div>
                    </Button>
                    {adminRole === 'super-admin' && (
                      <Button 
                        className="h-20 bg-orange-600 hover:bg-orange-700"
                        onClick={() => setCurrentPage('admins')}
                      >
                        <div className="text-center">
                          <UserCog className="h-6 w-6 mx-auto mb-1" />
                          <div className="text-sm">Manage Admins</div>
                        </div>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {MOCK_TRANSACTIONS.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'sale' ? 'bg-green-500/20' :
                            transaction.type === 'purchase' ? 'bg-blue-500/20' :
                            'bg-purple-500/20'
                          }`}>
                            <DollarSign className={`h-5 w-5 ${
                              transaction.type === 'sale' ? 'text-green-400' :
                              transaction.type === 'purchase' ? 'text-blue-400' :
                              'text-purple-400'
                            }`} />
                          </div>
                          <div>
                            <p className="text-white font-medium">{transaction.userName}</p>
                            <p className="text-sm text-gray-400">{transaction.type} • {transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">${transaction.amount.toFixed(2)}</p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PENDING ACCOUNTS APPROVAL */}
          {currentPage === 'accounts-pending' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-400">Review and approve new account requests</p>
                <Button variant="outline" className="gap-2 border-gray-600 text-gray-300">
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              </div>

              {MOCK_PENDING_ACCOUNTS.map((account) => (
                <Card key={account.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 bg-blue-600">
                          <AvatarFallback className="text-white">{account.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-white font-semibold">{account.name}</h3>
                          <p className="text-sm text-gray-400">{account.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {account.type}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              Pending Review
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Requested</p>
                        <p className="text-white">{account.requestedDate}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 border-t border-gray-700 pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-gray-400">Location</Label>
                        <p className="text-white flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-blue-400" />
                          {account.location}
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-400">
                          {account.type === 'individual' ? 'Disability ID' : 'Registration Number'}
                        </Label>
                        <p className="text-white mt-1">
                          {account.type === 'individual' ? account.disabilityId : account.registrationNumber}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-400">Uploaded Documents</Label>
                      <div className="flex gap-2 mt-2">
                        {account.documents.map((doc, idx) => (
                          <Button key={idx} variant="outline" size="sm" className="gap-2 border-gray-600 text-gray-300">
                            <FileText className="h-4 w-4" />
                            {doc}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveAccount(account.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Account
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="flex-1">
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline Account
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 border-gray-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">Decline Account - {account.name}</DialogTitle>
                            <DialogDescription className="text-gray-400">
                              Provide a valid reason for declining this account request.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-gray-300">Reason for Declining *</Label>
                              <Textarea 
                                id={`decline-${account.id}`}
                                placeholder="Explain why this account is being declined..."
                                className="min-h-[100px] bg-gray-900 border-gray-700 text-white"
                              />
                            </div>
                            <div className="flex gap-3">
                              <Button 
                                variant="destructive"
                                onClick={() => {
                                  const textarea = document.getElementById(`decline-${account.id}`) as HTMLTextAreaElement;
                                  handleDeclineAccount(account.id, textarea.value);
                                }}
                              >
                                Confirm Decline
                              </Button>
                              <Button variant="outline" className="border-gray-600 text-gray-300">Cancel</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {MOCK_PENDING_ACCOUNTS.length === 0 && (
                <Card className="bg-gray-800 border-gray-700 p-12 text-center">
                  <CheckCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white">No Pending Approvals</h3>
                  <p className="text-gray-400 mt-2">All account requests have been reviewed</p>
                </Card>
              )}
            </div>
          )}

          {/* ALL USERS PAGE */}
          {currentPage === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-80 h-12 bg-gray-800 border-gray-700 text-white"
                  />
                  <Button variant="outline" className="gap-2 border-gray-600 text-gray-300">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
                <Button variant="outline" className="gap-2 border-gray-600 text-gray-300" onClick={() => handleExportData('users')}>
                  <Download className="h-4 w-4" />
                  Export Users
                </Button>
              </div>

              {MOCK_ALL_USERS.filter(u => u.status === 'active').map((user) => (
                <Card key={user.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 bg-blue-600">
                          <AvatarFallback className="text-white">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-white font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-400">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{user.type}</Badge>
                            <Badge variant="default" className="bg-green-600">Active</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 border-gray-600 text-gray-300"
                          onClick={() => handleImpersonate(user.id)}
                        >
                          <Eye className="h-4 w-4" />
                          View as User
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 border-gray-600 text-gray-300"
                          onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                        >
                          {expandedUser === user.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {expandedUser === user.id && (
                    <CardContent className="border-t border-gray-700 pt-4">
                      <div className="grid gap-4 md:grid-cols-3 mb-4">
                        <div>
                          <Label className="text-gray-400">Location</Label>
                          <p className="text-white flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-blue-400" />
                            {user.location}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Join Date</Label>
                          <p className="text-white mt-1">{user.joinDate}</p>
                        </div>
                        {user.type === 'individual' && (
                          <>
                            <div>
                              <Label className="text-gray-400">Total Sales</Label>
                              <p className="text-white mt-1">${user.totalSales?.toFixed(2)}</p>
                            </div>
                            <div>
                              <Label className="text-gray-400">Products Listed</Label>
                              <p className="text-white mt-1">{user.productsListed}</p>
                            </div>
                          </>
                        )}
                        {user.type === 'school' && (
                          <>
                            <div>
                              <Label className="text-gray-400">Teachers</Label>
                              <p className="text-white mt-1">{user.teachers}</p>
                            </div>
                            <div>
                              <Label className="text-gray-400">Students</Label>
                              <p className="text-white mt-1">{user.students}</p>
                            </div>
                          </>
                        )}
                        {user.type === 'buyer' && (
                          <div>
                            <Label className="text-gray-400">Total Purchases</Label>
                            <p className="text-white mt-1">${user.totalPurchases?.toFixed(2)}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <Button size="sm" variant="outline" className="gap-2 border-gray-600 text-gray-300">
                          <History className="h-4 w-4" />
                          View Transaction History
                        </Button>
                        {user.type === 'individual' && (
                          <Button size="sm" variant="outline" className="gap-2 border-gray-600 text-gray-300">
                            <DollarSign className="h-4 w-4" />
                            Control Money
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="gap-2">
                              <Ban className="h-4 w-4" />
                              Ban User
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">Ban User - {user.name}</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                Provide a valid reason for banning this user.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label className="text-gray-300">Reason for Banning *</Label>
                                <Textarea 
                                  id={`ban-${user.id}`}
                                  placeholder="Explain why this user is being banned..."
                                  className="min-h-[100px] bg-gray-900 border-gray-700 text-white"
                                />
                              </div>
                              <Button 
                                variant="destructive"
                                onClick={() => {
                                  const textarea = document.getElementById(`ban-${user.id}`) as HTMLTextAreaElement;
                                  handleBanUser(user.id, textarea.value);
                                }}
                              >
                                Confirm Ban
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* PRODUCT APPROVALS PAGE */}
          {currentPage === 'products' && (
            <div className="space-y-6">
              <p className="text-gray-400">Review and approve product listings from sellers</p>

              {MOCK_PENDING_PRODUCTS.map((product) => (
                <Card key={product.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold">{product.productName}</h3>
                        <p className="text-sm text-gray-400">by {product.sellerName}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{product.category}</Badge>
                          <Badge variant="secondary">{product.images} images</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400">${product.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-400">{product.submittedDate}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 border-t border-gray-700 pt-4">
                    <div>
                      <Label className="text-gray-400">Product Images</Label>
                      <div className="flex gap-2 mt-2">
                        {product.documents.map((doc, idx) => (
                          <Button key={idx} variant="outline" size="sm" className="gap-2 border-gray-600 text-gray-300">
                            <Eye className="h-4 w-4" />
                            Image {idx + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveProduct(product.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Product
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="flex-1">
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline Product
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 border-gray-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">Decline Product</DialogTitle>
                            <DialogDescription className="text-gray-400">
                              Provide a reason for declining this product.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea 
                              id={`decline-product-${product.id}`}
                              placeholder="Explain why this product is being declined..."
                              className="min-h-[100px] bg-gray-900 border-gray-700 text-white"
                            />
                            <Button 
                              variant="destructive"
                              onClick={() => {
                                const textarea = document.getElementById(`decline-product-${product.id}`) as HTMLTextAreaElement;
                                handleDeclineProduct(product.id, textarea.value);
                              }}
                            >
                              Confirm Decline
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {MOCK_PENDING_PRODUCTS.length === 0 && (
                <Card className="bg-gray-800 border-gray-700 p-12 text-center">
                  <CheckCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white">No Pending Products</h3>
                  <p className="text-gray-400 mt-2">All products have been reviewed</p>
                </Card>
              )}
            </div>
          )}

          {/* TRANSACTIONS PAGE */}
          {currentPage === 'transactions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Search transactions..."
                    className="w-80 h-12 bg-gray-800 border-gray-700 text-white"
                  />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48 h-12 bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="sale">Sales</SelectItem>
                      <SelectItem value="purchase">Purchases</SelectItem>
                      <SelectItem value="withdrawal">Withdrawals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" className="gap-2 border-gray-600 text-gray-300" onClick={() => handleExportData('transactions')}>
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-gray-700">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">User</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Type</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Details</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Date</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Amount</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_TRANSACTIONS.map((transaction) => (
                          <tr key={transaction.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 bg-blue-600">
                                  <AvatarFallback className="text-white text-xs">{transaction.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-white text-sm">{transaction.userName}</p>
                                  <p className="text-xs text-gray-400">{transaction.userId}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={transaction.type === 'sale' ? 'default' : transaction.type === 'purchase' ? 'secondary' : 'outline'}>
                                {transaction.type}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-white text-sm">
                                {transaction.product || transaction.method}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-gray-400 text-sm">{transaction.date}</td>
                            <td className="px-6 py-4">
                              <p className="text-green-400 font-semibold">${transaction.amount.toFixed(2)}</p>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline" className="text-green-400 border-green-400">
                                {transaction.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ANALYTICS & STATS PAGE */}
          {currentPage === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-400">Platform analytics and sign-up statistics</p>
                <Select value={timeFilter} onValueChange={(value: any) => setTimeFilter(value)}>
                  <SelectTrigger className="w-48 h-12 bg-gray-800 border-gray-700 text-white">
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

              {/* Sign-up Stats */}
              <div className="grid gap-6 md:grid-cols-5">
                <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-blue-100">Individuals</p>
                      <h2 className="text-3xl font-bold text-white mt-2">{MOCK_SIGNUP_STATS[timeFilter].individuals}</h2>
                      <p className="text-xs text-blue-100 mt-1">New sign-ups</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-purple-100">Schools</p>
                      <h2 className="text-3xl font-bold text-white mt-2">{MOCK_SIGNUP_STATS[timeFilter].schools}</h2>
                      <p className="text-xs text-purple-100 mt-1">New sign-ups</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-green-100">Students</p>
                      <h2 className="text-3xl font-bold text-white mt-2">{MOCK_SIGNUP_STATS[timeFilter].students}</h2>
                      <p className="text-xs text-green-100 mt-1">New sign-ups</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-0">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-orange-100">Teachers</p>
                      <h2 className="text-3xl font-bold text-white mt-2">{MOCK_SIGNUP_STATS[timeFilter].teachers}</h2>
                      <p className="text-xs text-orange-100 mt-1">New sign-ups</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-pink-600 to-pink-700 border-0">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-pink-100">Buyers</p>
                      <h2 className="text-3xl font-bold text-white mt-2">{MOCK_SIGNUP_STATS[timeFilter].buyers}</h2>
                      <p className="text-xs text-pink-100 mt-1">New sign-ups</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Histogram Placeholder */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Sign-up Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-around gap-2 p-6 bg-gray-900 rounded-lg">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                      <div key={day} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg transition-all hover:opacity-80"
                          style={{ height: `${Math.random() * 100}%` }}
                        />
                        <span className="text-xs text-gray-400">{day}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TRANSACTIONS & COMMISSION PAGE (Super Admin Only) */}
          {currentPage === 'transactions' && (
            <AdminTransactionsCommissionPage adminRole={adminRole} />
          )}

          {/* FUNDS ON HOLD PAGE */}
          {currentPage === 'funds-on-hold' && (
            <AdminFundsOnHoldPage />
          )}

          {/* SHIPMENT TRACKING PAGE */}
          {currentPage === 'shipments' && (
            <AdminShipmentTrackingPage />
          )}

          {/* MESSAGES & INQUIRIES PAGE */}
          {currentPage === 'messages' && (
            <AdminMessagesInquiriesPage />
          )}

          {/* LOCATIONS PAGE */}
          {currentPage === 'locations' && (
            <AdminLocationsPage />
          )}

          {/* REPORTS PAGE */}
          {currentPage === 'reports' && (
            <AdminReportsPage />
          )}

          {/* DEACTIVATED ACCOUNTS PAGE */}
          {currentPage === 'deactivated' && (
            <AdminDeactivatedAccountsPage />
          )}

          {/* NOTIFICATIONS PAGE */}
          {currentPage === 'notifications' && (
            <AdminNotificationsPage />
          )}

          {/* PROFILE PAGE */}
          {currentPage === 'profile' && (
            <AdminProfilePage adminRole={adminRole} />
          )}

          {/* SETTINGS PAGE */}
          {currentPage === 'settings' && (
            <AdminSettingsPage />
          )}

          {/* SCHOOL HIERARCHY PAGE */}
          {currentPage === 'hierarchy' && (
            <AdminSchoolHierarchyPage />
          )}

          {/* ENHANCED ANALYTICS PAGE (User Categories) */}
          {currentPage === 'analytics' && (
            <AdminEnhancedAnalyticsPage adminRole={adminRole} />
          )}

          {/* CAREGIVER MANAGEMENT PAGE */}
          {currentPage === 'caregivers' && (
            <AdminCaregiverManagement />
          )}

          {/* ADMIN MANAGEMENT PAGE (Super Admin Only) */}
          {currentPage === 'admins' && adminRole === 'super-admin' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-400">Manage administrator accounts and permissions</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4" />
                      Create New Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Create New Administrator</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Add a new admin account to manage the platform
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Full Name *</Label>
                        <Input 
                          placeholder="John Doe"
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Email Address *</Label>
                        <Input 
                          type="email"
                          placeholder="john.doe@handsandhope.com"
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Role *</Label>
                        <Select>
                          <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="super-admin">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                        <p className="text-blue-200 text-sm">
                          📧 A temporary password will be generated and emailed to the new admin
                        </p>
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Create Admin Account
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Admin Accounts List */}
              {MOCK_ADMINS.map((admin) => (
                <Card key={admin.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 bg-gradient-to-br from-purple-600 to-blue-600">
                          <AvatarFallback className="text-white">{admin.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-white font-semibold">{admin.name}</h3>
                          <p className="text-sm text-gray-400">{admin.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={admin.role === 'super-admin' ? 'default' : 'secondary'} className={admin.role === 'super-admin' ? 'bg-purple-600' : ''}>
                              {admin.role === 'super-admin' ? 'Super Admin' : 'Admin'}
                            </Badge>
                            <Badge variant="outline" className={`text-${admin.status === 'active' ? 'green' : 'gray'}-400`}>
                              {admin.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Last Login</p>
                        <p className="text-white">{admin.lastLogin}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="border-t border-gray-700 pt-4">
                    <div className="grid gap-4 md:grid-cols-3 mb-4">
                      <div>
                        <Label className="text-gray-400">Created</Label>
                        <p className="text-white mt-1">{admin.createdDate}</p>
                        {admin.createdBy && (
                          <p className="text-xs text-gray-500 mt-1">by {admin.createdBy}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-gray-400">Status</Label>
                        <p className="text-white mt-1">{admin.status === 'active' ? '✅ Active' : '🔴 Inactive'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Account ID</Label>
                        <p className="text-white mt-1">{admin.id}</p>
                      </div>
                    </div>
                    
                    {admin.role !== 'super-admin' && (
                      <div className="flex gap-3">
                        <Button size="sm" variant="outline" className="gap-2 border-gray-600 text-gray-300">
                          <Edit className="h-4 w-4" />
                          Edit Permissions
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2 border-gray-600 text-gray-300">
                          <RefreshCw className="h-4 w-4" />
                          Reset Password
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="gap-2">
                              <Trash2 className="h-4 w-4" />
                              Delete Admin
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">Delete Administrator - {admin.name}</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                This action cannot be undone. This will permanently delete the admin account.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="bg-red-900/20 border border-red-600 p-4 rounded-lg">
                                <p className="text-red-200 text-sm">
                                  ⚠️ All actions performed by this admin will remain in the system logs.
                                </p>
                              </div>
                              <Button variant="destructive" className="w-full">
                                Confirm Delete
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                    {admin.role === 'super-admin' && (
                      <div className="bg-purple-900/20 border border-purple-600 p-3 rounded-lg">
                        <p className="text-purple-200 text-sm">
                          👑 Super Admin accounts cannot be modified or deleted
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
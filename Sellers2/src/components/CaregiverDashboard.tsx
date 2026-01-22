import React, { useState } from 'react';
import { Users, Activity, Package, MessageSquare, DollarSign, BarChart3, ChevronDown, UserCheck, Shield, Clock, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { CaregiverSidebar } from './CaregiverSidebar';
import { DashboardHeader } from './DashboardHeader';
import { ProductsPage } from './ProductsPage';
import { InquiriesPage } from './InquiriesPage';
import { NotificationsPage } from './NotificationsPage';
import { CaregiverProfilePage } from './CaregiverProfilePage';
import { SettingsPage } from './SettingsPage';

interface ManagedAccount {
  accountId: string;
  accountType: 'individual_seller' | 'student_seller';
  accountOwnerName: string;
  accountOwnerEmail: string;
  schoolName?: string;
  permissionLevel: string;
  permissions: {
    viewProfile: boolean;
    editProfile: boolean;
    viewProducts: boolean;
    manageProducts: boolean;
    respondToInquiries: boolean;
    viewFinancials: boolean;
    withdrawMoney: boolean;
    manageShipments: boolean;
    viewAnalytics: boolean;
    editBio: boolean;
    editStoreName: boolean;
  };
  status: 'active';
  stats: {
    totalProducts: number;
    totalSales: number;
    totalEarnings: number;
    pendingInquiries: number;
  };
}

interface CaregiverUser {
  fullName: string;
  email: string;
  relationshipType: string;
  managedAccounts: ManagedAccount[];
}

interface CaregiverDashboardProps {
  onLogout: () => void;
}

export function CaregiverDashboard({ onLogout }: CaregiverDashboardProps) {
  const [currentUser] = useState<CaregiverUser>({
    fullName: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    relationshipType: 'parent',
    managedAccounts: [
      {
        accountId: 'usr_001',
        accountType: 'individual_seller',
        accountOwnerName: 'John Smith',
        accountOwnerEmail: 'john.smith@email.com',
        permissionLevel: 'full',
        permissions: {
          viewProfile: true,
          editProfile: true,
          viewProducts: true,
          manageProducts: true,
          respondToInquiries: true,
          viewFinancials: true,
          withdrawMoney: true,
          manageShipments: true,
          viewAnalytics: true,
          editBio: true,
          editStoreName: true
        },
        status: 'active',
        stats: {
          totalProducts: 12,
          totalSales: 156,
          totalEarnings: 2450.00,
          pendingInquiries: 3
        }
      },
      {
        accountId: 'usr_002',
        accountType: 'student_seller',
        accountOwnerName: 'Sarah Johnson',
        accountOwnerEmail: 'sarah.j@school.edu',
        schoolName: 'Lincoln High School',
        permissionLevel: 'product_management',
        permissions: {
          viewProfile: true,
          editProfile: false,
          viewProducts: true,
          manageProducts: true,
          respondToInquiries: true,
          viewFinancials: false,
          withdrawMoney: false,
          manageShipments: true,
          viewAnalytics: true,
          editBio: true,
          editStoreName: false
        },
        status: 'active',
        stats: {
          totalProducts: 8,
          totalSales: 45,
          totalEarnings: 680.00,
          pendingInquiries: 1
        }
      }
    ]
  });

  const [selectedAccountId, setSelectedAccountId] = useState(currentUser.managedAccounts[0]?.accountId);
  const [currentPage, setCurrentPage] = useState('overview');

  const selectedAccount = currentUser.managedAccounts.find(acc => acc.accountId === selectedAccountId);

  const sidebarNavigation = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: Activity,
      description: 'Account summary and quick actions'
    },
    ...(selectedAccount?.permissions.viewProducts ? [{
      id: 'products',
      label: 'Products',
      icon: Package,
      description: 'Manage product listings',
      disabled: !selectedAccount?.permissions.manageProducts && !selectedAccount?.permissions.viewProducts
    }] : []),
    ...(selectedAccount?.permissions.respondToInquiries ? [{
      id: 'inquiries',
      label: 'Inquiries',
      icon: MessageSquare,
      description: 'Respond to buyer messages',
      badge: selectedAccount?.stats.pendingInquiries
    }] : []),
    ...(selectedAccount?.permissions.viewFinancials ? [{
      id: 'financials',
      label: 'Financials',
      icon: DollarSign,
      description: 'View earnings and transactions'
    }] : []),
    ...(selectedAccount?.permissions.viewAnalytics ? [{
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'View performance metrics'
    }] : []),
    {
      id: 'my-activity',
      label: 'My Activity',
      icon: Clock,
      description: 'Your action history'
    },
    {
      id: 'my-profile',
      label: 'My Profile',
      icon: UserCheck,
      description: 'Your caregiver profile'
    }
  ];

  const renderPage = () => {
    if (!selectedAccount) {
      return (
        <div className="p-6">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="size-4 text-amber-600" />
            <AlertDescription className="text-amber-900">
              Please select an account to manage from the dropdown above.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    switch (currentPage) {
      case 'overview':
        return <CaregiverOverviewPage account={selectedAccount} caregiver={currentUser} />;
      case 'products':
        return selectedAccount.permissions.viewProducts ? (
          <ProductsPage canManage={selectedAccount.permissions.manageProducts} />
        ) : null;
      case 'inquiries':
        return selectedAccount.permissions.respondToInquiries ? (
          <InquiriesPage canRespond={selectedAccount.permissions.respondToInquiries} />
        ) : null;
      case 'financials':
        return selectedAccount.permissions.viewFinancials ? (
          <FinancialsPage account={selectedAccount} />
        ) : null;
      case 'analytics':
        return selectedAccount.permissions.viewAnalytics ? (
          <AnalyticsPage account={selectedAccount} />
        ) : null;
      case 'my-activity':
        return <MyActivityPage caregiver={currentUser} />;
      case 'my-profile':
        return <CaregiverProfilePage />;
      default:
        return <CaregiverOverviewPage account={selectedAccount} caregiver={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        accountType="caregiver"
        userName={currentUser.fullName}
        onLogout={onLogout}
      />

      <div className="flex">
        <CaregiverSidebar
          navigation={sidebarNavigation}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />

        <main className="flex-1 p-6">
          {/* Account Selector */}
          <div className="mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Managing Account For:</Label>
                  <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                    <SelectTrigger className="w-80 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentUser.managedAccounts.map((account) => (
                        <SelectItem key={account.accountId} value={account.accountId}>
                          <div className="flex items-center gap-2">
                            <UserCheck className="size-4" />
                            <span className="font-medium">{account.accountOwnerName}</span>
                            <Badge variant="outline" className="text-xs">
                              {account.accountType === 'student_seller' ? 'Student' : 'Seller'}
                            </Badge>
                            {account.schoolName && (
                              <span className="text-xs text-gray-500">• {account.schoolName}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedAccount && (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Permission Level</div>
                      <Badge className="mt-1 capitalize">
                        <Shield className="size-3 mr-1" />
                        {selectedAccount.permissionLevel.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {selectedAccount && (
                <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                  <div className="text-sm text-gray-600 w-full mb-2">Your Permissions:</div>
                  {selectedAccount.permissions.manageProducts && (
                    <Badge variant="outline" className="text-xs">Manage Products</Badge>
                  )}
                  {selectedAccount.permissions.respondToInquiries && (
                    <Badge variant="outline" className="text-xs">Respond to Inquiries</Badge>
                  )}
                  {selectedAccount.permissions.viewFinancials && (
                    <Badge variant="outline" className="text-xs">View Financials</Badge>
                  )}
                  {selectedAccount.permissions.withdrawMoney && (
                    <Badge variant="outline" className="text-xs">Withdraw Money</Badge>
                  )}
                  {selectedAccount.permissions.manageShipments && (
                    <Badge variant="outline" className="text-xs">Manage Shipments</Badge>
                  )}
                  {selectedAccount.permissions.editProfile && (
                    <Badge variant="outline" className="text-xs">Edit Profile</Badge>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Page Content */}
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function CaregiverOverviewPage({ account, caregiver }: { account: ManagedAccount; caregiver: CaregiverUser }) {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {caregiver.fullName}
        </h1>
        <p className="text-purple-100">
          You're currently managing the account for <strong>{account.accountOwnerName}</strong>
          {account.schoolName && <span> at {account.schoolName}</span>}.
        </p>
      </Card>

      {/* Important Notice */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="size-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <strong>Accountability Notice:</strong> All actions you perform are logged and visible to {account.accountOwnerName}
          {account.accountType === 'student_seller' && ', their teacher, and school administrator'}.
        </AlertDescription>
      </Alert>

      {/* Account Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-3xl font-bold mt-1">{account.stats.totalProducts}</p>
            </div>
            <Package className="size-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-3xl font-bold mt-1">{account.stats.totalSales}</p>
            </div>
            <BarChart3 className="size-8 text-blue-500" />
          </div>
        </Card>

        {account.permissions.viewFinancials && (
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-3xl font-bold mt-1">${account.stats.totalEarnings.toFixed(2)}</p>
              </div>
              <DollarSign className="size-8 text-green-500" />
            </div>
          </Card>
        )}

        {account.permissions.respondToInquiries && (
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Inquiries</p>
                <p className="text-3xl font-bold mt-1">{account.stats.pendingInquiries}</p>
              </div>
              <MessageSquare className="size-8 text-orange-500" />
            </div>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {account.permissions.manageProducts && (
            <Button className="h-24 flex flex-col items-center justify-center gap-2">
              <Package className="size-6" />
              <span>Add New Product</span>
            </Button>
          )}
          {account.permissions.respondToInquiries && (
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
              <MessageSquare className="size-6" />
              <span>View Inquiries ({account.stats.pendingInquiries})</span>
            </Button>
          )}
          {account.permissions.viewFinancials && (
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
              <DollarSign className="size-6" />
              <span>View Financials</span>
            </Button>
          )}
        </div>
      </Card>

      {/* Permission Summary */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">What You Can Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(account.permissions).map(([key, value]) => (
            <div key={key} className="flex items-center gap-3">
              <div className={`size-6 rounded-full flex items-center justify-center ${value ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {value ? '✓' : '✗'}
              </div>
              <span className={`capitalize ${value ? 'text-gray-900' : 'text-gray-400'}`}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function FinancialsPage({ account }: { account: ManagedAccount }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Financials - {account.accountOwnerName}</h1>
        {account.permissions.withdrawMoney && (
          <Button>
            <DollarSign className="size-4 mr-2" />
            Request Withdrawal
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Available Balance</p>
          <p className="text-3xl font-bold mt-2">${account.stats.totalEarnings.toFixed(2)}</p>
          <p className="text-sm text-green-600 mt-2">+${(account.stats.totalEarnings * 0.15).toFixed(2)} this month</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-600">Total Withdrawn</p>
          <p className="text-3xl font-bold mt-2">$1,200.00</p>
          <p className="text-sm text-gray-600 mt-2">Last: 2 weeks ago</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-600">Pending Payments</p>
          <p className="text-3xl font-bold mt-2">$85.00</p>
          <p className="text-sm text-gray-600 mt-2">3 orders processing</p>
        </Card>
      </div>

      {!account.permissions.withdrawMoney && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="size-4 text-amber-600" />
          <AlertDescription className="text-amber-900">
            You can view financial information but cannot initiate withdrawals. Contact {account.accountOwnerName} to request withdrawal permissions.
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <p className="text-gray-600">Transaction details would appear here...</p>
      </Card>
    </div>
  );
}

function AnalyticsPage({ account }: { account: ManagedAccount }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics - {account.accountOwnerName}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
          <p className="text-gray-600">Sales charts would appear here...</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Product Performance</h3>
          <p className="text-gray-600">Product metrics would appear here...</p>
        </Card>
      </div>
    </div>
  );
}

function MyActivityPage({ caregiver }: { caregiver: CaregiverUser }) {
  const activities = [
    {
      id: '1',
      action: 'Edited product',
      details: 'Updated description and price for "Handmade Ceramic Bowl"',
      account: 'John Smith',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      action: 'Responded to inquiry',
      details: 'Answered buyer question about shipping',
      account: 'John Smith',
      timestamp: '5 hours ago'
    },
    {
      id: '3',
      action: 'Added product',
      details: 'Created new listing for "Bookmark Set"',
      account: 'Sarah Johnson',
      timestamp: '1 day ago'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Activity Log</h1>
      <p className="text-gray-600">All actions you've performed across managed accounts</p>

      <div className="space-y-3">
        {activities.map((activity) => (
          <Card key={activity.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{activity.action}</p>
                <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    <UserCheck className="size-3 mr-1" />
                    {activity.account}
                  </Badge>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <Clock className="size-3 inline mr-1" />
                {activity.timestamp}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}

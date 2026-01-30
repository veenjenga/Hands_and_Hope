import { useState, useEffect } from 'react';
import { Users, Shield, Activity, Eye, UserPlus, Search, Filter, AlertCircle, Clock, Edit, Trash2, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';

interface AccountWithCaregivers {
  userId: string;
  fullName: string;
  email: string;
  accountType: 'individual_seller' | 'student_seller';
  schoolName?: string;
  caregivers: Array<{
    caregiverId: string;
    caregiverName: string;
    caregiverEmail: string;
    relationshipType: string;
    permissionLevel: string;
    addedDate: string;
    status: 'active' | 'revoked';
    totalActions: number;
    lastActionDate?: string;
  }>;
  totalCaregivers: number;
}

interface Caregiver {
  caregiverId: string;
  caregiverName: string;
  caregiverEmail: string;
  phone?: string;
  relationshipType: string;
  joinDate: string;
  managedAccounts: Array<{
    accountId: string;
    accountOwnerName: string;
    accountOwnerEmail: string;
    accountType: string;
    permissionLevel: string;
    permissions: any;
    status: 'active' | 'revoked';
    addedDate: string;
  }>;
  totalManagedAccounts: number;
  activityLog: any[];
  status: string;
}

export function AdminCaregiverManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [showAddCaregiverModal, setShowAddCaregiverModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newCaregiver, setNewCaregiver] = useState({
    fullName: '',
    email: '',
    phone: '',
    relationshipType: 'caregiver'
  });
  const [assignmentData, setAssignmentData] = useState({
    caregiverId: '',
    accountId: '',
    permissionLevel: 'view_only' as string
  });

  useEffect(() => {
    loadCaregiverData();
  }, []);

  const loadCaregiverData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch caregivers data from the API
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/caregivers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch caregivers: ${response.statusText}`);
      }
      
      const caregiversData = await response.json();
      setCaregivers(caregiversData);
      
      // Transform the data to match our accounts format
      const transformedAccounts: AccountWithCaregivers[] = [];
      
      // Process each caregiver to group by managed accounts
      (caregiversData as Caregiver[]).forEach(caregiver => {
        caregiver.managedAccounts.forEach(account => {
          // Check if this account already exists in our list
          const existingAccountIndex = transformedAccounts.findIndex(acc => acc.userId === account.accountId);
          
          if (existingAccountIndex !== -1) {
            // Add caregiver to existing account
            transformedAccounts[existingAccountIndex].caregivers.push({
              caregiverId: caregiver.caregiverId,
              caregiverName: caregiver.caregiverName,
              caregiverEmail: caregiver.caregiverEmail,
              relationshipType: caregiver.relationshipType,
              permissionLevel: account.permissionLevel,
              addedDate: account.addedDate,
              status: account.status,
              totalActions: caregiver.activityLog ? caregiver.activityLog.length : 0,
              lastActionDate: caregiver.activityLog && caregiver.activityLog.length > 0 
                ? caregiver.activityLog[0].timestamp 
                : undefined,
            });
            transformedAccounts[existingAccountIndex].totalCaregivers += 1;
          } else {
            // Create new account entry
            transformedAccounts.push({
              userId: account.accountId,
              fullName: account.accountOwnerName,
              email: account.accountOwnerEmail,
              accountType: account.accountType === 'student_seller' ? 'student_seller' : 'individual_seller',
              schoolName: undefined, // Would need to fetch separately
              caregivers: [{
                caregiverId: caregiver.caregiverId,
                caregiverName: caregiver.caregiverName,
                caregiverEmail: caregiver.caregiverEmail,
                relationshipType: caregiver.relationshipType,
                permissionLevel: account.permissionLevel,
                addedDate: account.addedDate,
                status: account.status,
                totalActions: caregiver.activityLog ? caregiver.activityLog.length : 0,
                lastActionDate: caregiver.activityLog && caregiver.activityLog.length > 0 
                  ? caregiver.activityLog[0].timestamp 
                  : undefined,
              }],
              totalCaregivers: 1,
            });
          }
        });
      });
      
      setAccounts(transformedAccounts);
    } catch (err: any) {
      console.error('Error loading caregiver data:', err);
      setError(err?.message || 'Failed to load caregiver data');
      // Fallback to mock data if API fails
      const mockAccounts = [
        {
          userId: 'usr_001',
          fullName: 'John Smith',
          email: 'john.smith@email.com',
          accountType: 'individual_seller',
          caregivers: [
            {
              caregiverId: 'cgv_001',
              caregiverName: 'Maria Garcia',
              caregiverEmail: 'maria.garcia@email.com',
              relationshipType: 'parent',
              permissionLevel: 'full',
              addedDate: '2024-12-01',
              status: 'active' as const,
              totalActions: 45,
              lastActionDate: '2024-12-06'
            }
          ],
          totalCaregivers: 1
        },
        {
          userId: 'usr_002',
          fullName: 'Sarah Johnson',
          email: 'sarah.j@school.edu',
          accountType: 'student_seller',
          schoolName: 'Lincoln High School',
          caregivers: [
            {
              caregiverId: 'cgv_002',
              caregiverName: 'Robert Johnson',
              caregiverEmail: 'robert.j@example.com',
              relationshipType: 'guardian',
              permissionLevel: 'product_management',
              addedDate: '2024-11-20',
              status: 'active' as const,
              totalActions: 23,
              lastActionDate: '2024-12-05'
            }
          ],
          totalCaregivers: 1
        },
      ];
      setAccounts(mockAccounts);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCaregiver = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/caregivers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCaregiver)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create caregiver');
      }
      
      // Reset form and close modal
      setNewCaregiver({ fullName: '', email: '', phone: '', relationshipType: 'caregiver' });
      setShowAddCaregiverModal(false);
      
      // Reload data
      loadCaregiverData();
    } catch (err: any) {
      console.error('Error creating caregiver:', err);
      setError(err?.message || 'Failed to create caregiver');
    }
  };

  const handleAssignCaregiverToAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/caregivers/${assignmentData.caregiverId}/assign-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          accountId: assignmentData.accountId,
          permissionLevel: assignmentData.permissionLevel
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to assign caregiver to account');
      }
      
      // Reset form and close modal
      setAssignmentData({ caregiverId: '', accountId: '', permissionLevel: 'view_only' });
      setShowAssignModal(false);
      
      // Reload data
      loadCaregiverData();
    } catch (err: any) {
      console.error('Error assigning caregiver to account:', err);
      setError(err?.message || 'Failed to assign caregiver to account');
    }
  };

  const filteredAccounts = accounts.filter(account =>
    account.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading caregiver data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Caregiver Management</h1>
          <p className="text-gray-400 mt-1">Monitor and manage caregiver accounts and their access</p>
        </div>
        
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700"
          onClick={() => setShowAddCaregiverModal(true)}
        >
          <UserPlus className="h-4 w-4" />
          Add Caregiver
        </button>
      </div>

      <div className="flex gap-2 mt-4">
        <button 
          className="px-4 py-2 bg-purple-600 text-white rounded-md flex items-center gap-2 hover:bg-purple-700"
          onClick={() => {
            setAssignmentData({ caregiverId: '', accountId: '', permissionLevel: 'view_only' });
            setShowAssignModal(true);
          }}
        >
          <UserPlus className="h-4 w-4" />
          Assign Caregiver to Account
        </button>
      </div>

      {/* Add Caregiver Modal */}
      {showAddCaregiverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setShowAddCaregiverModal(false)}
          ></div>
          <div className="relative bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700 z-50 m-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Add New Caregiver</h3>
              <p className="text-gray-400 text-sm">
                Create a new caregiver account with appropriate permissions
              </p>
            </div>
            
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={newCaregiver.fullName}
                  onChange={(e) => setNewCaregiver({...newCaregiver, fullName: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCaregiver.email}
                  onChange={(e) => setNewCaregiver({...newCaregiver, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  value={newCaregiver.phone}
                  onChange={(e) => setNewCaregiver({...newCaregiver, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationshipType">Relationship Type</Label>
                <Select 
                  value={newCaregiver.relationshipType} 
                  onValueChange={(value) => setNewCaregiver({...newCaregiver, relationshipType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                    <SelectItem value="caregiver">Caregiver</SelectItem>
                    <SelectItem value="helper">Helper/Assistant</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button 
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700"
                onClick={() => setShowAddCaregiverModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleAddCaregiver}
              >
                Create Caregiver
              </button>
            </div>
            
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setShowAddCaregiverModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => {
              setShowAssignModal(false);
              setAssignmentData({ caregiverId: '', accountId: '', permissionLevel: 'view_only' });
            }}
          ></div>
          <div className="relative bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700 z-50 m-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Assign Caregiver to Account</h3>
              <p className="text-gray-400 text-sm">
                Assign a caregiver to manage a specific account with appropriate permissions
              </p>
            </div>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="caregiver">Select Caregiver</Label>
                <select
                  id="caregiver"
                  value={assignmentData.caregiverId}
                  onChange={(e) => setAssignmentData({...assignmentData, caregiverId: e.target.value})}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-900 text-white"
                >
                  <option value="">Choose a caregiver</option>
                  {caregivers.map(caregiver => (
                    <option key={caregiver.caregiverId} value={caregiver.caregiverId}>
                      {caregiver.caregiverName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="account">Select Account</Label>
                <select
                  id="account"
                  value={assignmentData.accountId}
                  onChange={(e) => setAssignmentData({...assignmentData, accountId: e.target.value})}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-900 text-white"
                >
                  <option value="">Choose an account</option>
                  {accounts.map(account => (
                    <option key={account.userId} value={account.userId}>
                      {account.fullName} ({account.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="permissionLevel">Permission Level</Label>
                <select
                  id="permissionLevel"
                  value={assignmentData.permissionLevel}
                  onChange={(e) => setAssignmentData({...assignmentData, permissionLevel: e.target.value})}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-900 text-white"
                >
                  <option value="view_only">View Only</option>
                  <option value="edit">Edit Products</option>
                  <option value="full_control">Full Control</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button 
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700"
                onClick={() => {
                  setShowAssignModal(false);
                  setAssignmentData({ caregiverId: '', accountId: '', permissionLevel: 'view_only' });
                }}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleAssignCaregiverToAccount}
              >
                Assign Caregiver
              </button>
            </div>
            
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => {
                  setShowAssignModal(false);
                  setAssignmentData({ caregiverId: '', accountId: '', permissionLevel: 'view_only' });
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50/10">
          <AlertCircle className="size-4 text-red-400" />
          <AlertDescription className="text-red-300">
            Error: {error}
          </AlertDescription>
        </Alert>
      )}

      <Alert className="border-blue-200 bg-blue-50/10">
        <AlertCircle className="size-4 text-blue-400" />
        <AlertDescription className="text-blue-300">
          All caregiver actions are logged for transparency and accountability. Monitor activity regularly.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="accounts">Accounts with Caregivers</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        {/* Accounts Tab */}
        <TabsContent value="accounts" className="space-y-4">
          {/* Filters */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="revoked">Revoked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Accounts List */}
          <div className="space-y-4">
            {filteredAccounts.map(account => (
              <Card key={account.userId} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        {account.fullName}
                        <Badge variant={account.accountType === 'student_seller' ? 'default' : 'secondary'}>
                          {account.accountType === 'student_seller' ? 'Student' : 'Seller'}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-400 mt-1">{account.email}</p>
                      {account.schoolName && (
                        <p className="text-sm text-gray-500">🏫 {account.schoolName}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-gray-300">
                      {account.totalCaregivers} caregiver{account.totalCaregivers !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {account.caregivers.map(caregiver => (
                      <div key={caregiver.caregiverId} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-white">{caregiver.caregiverName}</p>
                              <p className="text-sm text-gray-400">{caregiver.caregiverEmail}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge variant="outline" className="text-xs capitalize">
                              {caregiver.relationshipType}
                            </Badge>
                            <Badge variant={caregiver.status === 'active' ? 'default' : 'destructive'} className="text-xs">
                              {caregiver.status}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              {caregiver.permissionLevel}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Actions: <span className="text-white font-bold">{caregiver.totalActions}</span></p>
                          {caregiver.lastActionDate && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {caregiver.lastActionDate}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-gray-400">
              <Activity className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-center">Recent caregiver activity log - Coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
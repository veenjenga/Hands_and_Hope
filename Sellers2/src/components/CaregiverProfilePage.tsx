import React, { useState, useRef } from 'react';
import { Camera, Mail, Phone, MapPin, Calendar, User, Heart, Save, Edit2, Upload, Users, Clock, Bell, Shield, UserCheck, AlertCircle, Lock, Download, FileText, Filter, Search, X, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ManagedAccount {
  accountId: string;
  accountType: 'individual_seller' | 'student_seller';
  accountOwnerName: string;
  accountOwnerEmail: string;
  schoolName?: string;
  permissionLevel: string;
  status: 'active' | 'inactive';
  linkedDate: string;
}

interface CaregiverProfileData {
  caregiverId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  relationshipType: string;
  joinDate: string;
  profilePhoto: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notificationPreferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    activityAlerts: boolean;
    weeklyReports: boolean;
  };
  managedAccounts: ManagedAccount[];
}

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  account: string;
  timestamp: string;
  category: 'product' | 'inquiry' | 'financial' | 'profile' | 'shipment';
}

interface CaregiverProfilePageProps {
  caregiverData?: CaregiverProfileData;
}

export function CaregiverProfilePage({ caregiverData }: CaregiverProfilePageProps) {
  const [profileData, setProfileData] = useState<CaregiverProfileData>(caregiverData || {
    caregiverId: 'CG-2024-001',
    fullName: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1 (555) 987-6543',
    address: '456 Maple Drive, Los Angeles, CA 90001',
    relationshipType: 'Parent',
    joinDate: 'March 15, 2024',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mariagarcia',
    emergencyContact: {
      name: 'Carlos Garcia',
      phone: '+1 (555) 987-6544',
      relationship: 'Spouse'
    },
    notificationPreferences: {
      emailNotifications: true,
      smsNotifications: true,
      activityAlerts: true,
      weeklyReports: false
    },
    managedAccounts: [
      {
        accountId: 'usr_001',
        accountType: 'individual_seller',
        accountOwnerName: 'John Smith',
        accountOwnerEmail: 'john.smith@email.com',
        permissionLevel: 'Full Access',
        status: 'active',
        linkedDate: 'March 15, 2024'
      },
      {
        accountId: 'usr_002',
        accountType: 'student_seller',
        accountOwnerName: 'Sarah Johnson',
        accountOwnerEmail: 'sarah.j@school.edu',
        schoolName: 'Lincoln High School',
        permissionLevel: 'Product Management',
        status: 'active',
        linkedDate: 'April 2, 2024'
      }
    ]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(profileData.profilePhoto);
  const [notificationPrefs, setNotificationPrefs] = useState(profileData.notificationPreferences);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Activity filter states
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<string>('all');

  const recentActivities: ActivityLog[] = [
    {
      id: '1',
      action: 'Edited Product',
      details: 'Updated price and description for "Handmade Ceramic Bowl"',
      account: 'John Smith',
      timestamp: '2 hours ago',
      category: 'product'
    },
    {
      id: '2',
      action: 'Responded to Inquiry',
      details: 'Answered buyer question about shipping options',
      account: 'John Smith',
      timestamp: '5 hours ago',
      category: 'inquiry'
    },
    {
      id: '3',
      action: 'Added Product',
      details: 'Created new listing for "Handmade Bookmark Set"',
      account: 'Sarah Johnson',
      timestamp: '1 day ago',
      category: 'product'
    },
    {
      id: '4',
      action: 'Updated Shipment',
      details: 'Marked order #12345 as shipped with tracking',
      account: 'John Smith',
      timestamp: '2 days ago',
      category: 'shipment'
    },
    {
      id: '5',
      action: 'Viewed Financials',
      details: 'Accessed earnings dashboard',
      account: 'John Smith',
      timestamp: '3 days ago',
      category: 'financial'
    }
  ];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    setProfileData({
      ...profileData,
      notificationPreferences: notificationPrefs
    });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'product': return '📦';
      case 'inquiry': return '💬';
      case 'financial': return '💰';
      case 'profile': return '👤';
      case 'shipment': return '🚚';
      default: return '📝';
    }
  };

  // Password strength calculator
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 12.5;
    if (/[^a-zA-Z\d]/.test(password)) strength += 12.5;
    return Math.min(strength, 100);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setNewPassword(pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (passwordStrength < 50) {
      alert('Password is too weak. Please use a stronger password.');
      return;
    }
    // In real app, this would call backend API
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordStrength(0);
  };

  // Filter activities
  const filteredActivities = recentActivities.filter((activity) => {
    // Category filter
    if (activityFilter !== 'all' && activity.category !== activityFilter) {
      return false;
    }
    // Account filter
    if (accountFilter !== 'all' && activity.account !== accountFilter) {
      return false;
    }
    // Search filter
    if (searchQuery && !activity.action.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !activity.details.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Export activities as CSV
  const handleExportCSV = () => {
    const csvContent = [
      ['Date', 'Action', 'Details', 'Account', 'Category'].join(','),
      ...filteredActivities.map(a => 
        [a.timestamp, a.action, `"${a.details}"`, a.account, a.category].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caregiver-activity-log-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Export activities as PDF (simplified version)
  const handleExportPDF = () => {
    alert('PDF export would generate a formatted PDF document with your activity log. This feature requires a PDF library in production.');
    // In production, use a library like jsPDF or pdfmake
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500';
    if (passwordStrength < 50) return 'bg-orange-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-lg text-gray-600 mt-1">
            Manage your caregiver account information and preferences
          </p>
        </div>
        {!isEditing ? (
          <Button size="lg" onClick={() => setIsEditing(true)} className="gap-2">
            <Edit2 className="h-5 w-5" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button size="lg" onClick={handleSave} className="gap-2">
              <Save className="h-5 w-5" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Info Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="size-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <strong>Caregiver Account:</strong> You have been granted access to help manage seller accounts. All your actions are logged for transparency and accountability.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Photo & Quick Info Card */}
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Profile Photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-40 w-40 border-4 border-purple-100">
                  <AvatarImage src={profilePhoto} alt={`${profileData.fullName}'s profile photo`} />
                  <AvatarFallback className="text-4xl bg-purple-100 text-purple-700">
                    {profileData.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-transform hover:scale-110"
                    aria-label="Upload new photo"
                  >
                    <Camera className="h-6 w-6" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  aria-label="Upload profile photo"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">{profileData.fullName}</h3>
                <Badge variant="secondary" className="mt-2 gap-2 bg-purple-100 text-purple-700">
                  <Heart className="h-4 w-4" />
                  Caregiver
                </Badge>
              </div>
              {isEditing && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full gap-2"
                >
                  <Upload className="h-5 w-5" />
                  Upload New Photo
                </Button>
              )}
            </div>

            {/* Quick Stats */}
            <div className="space-y-3 border-t pt-6 border-gray-200">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Caregiver since</p>
                  <p className="font-semibold text-gray-900">{profileData.joinDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Relationship</p>
                  <p className="font-semibold text-gray-900">{profileData.relationshipType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Managing Accounts</p>
                  <p className="font-semibold text-gray-900">{profileData.managedAccounts.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Caregiver ID</p>
                  <p className="font-semibold text-gray-900">{profileData.caregiverId}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Information Card */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Account Information</CardTitle>
            <CardDescription>
              Update your personal details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-12">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="accounts">Accounts</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-6 pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="name"
                        defaultValue={profileData.fullName}
                        disabled={!isEditing}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship Type</Label>
                    <div className="relative">
                      <Heart className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="relationship"
                        defaultValue={profileData.relationshipType}
                        disabled={!isEditing}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        defaultValue={profileData.email}
                        disabled={!isEditing}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        defaultValue={profileData.phone}
                        disabled={!isEditing}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="address"
                        defaultValue={profileData.address}
                        disabled={!isEditing}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  {profileData.emergencyContact && (
                    <>
                      <div className="md:col-span-2 mt-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergency-name">Contact Name</Label>
                        <Input
                          id="emergency-name"
                          defaultValue={profileData.emergencyContact.name}
                          disabled={!isEditing}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergency-phone">Contact Phone</Label>
                        <Input
                          id="emergency-phone"
                          type="tel"
                          defaultValue={profileData.emergencyContact.phone}
                          disabled={!isEditing}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergency-relationship">Relationship</Label>
                        <Input
                          id="emergency-relationship"
                          defaultValue={profileData.emergencyContact.relationship}
                          disabled={!isEditing}
                          className="h-12"
                        />
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Managed Accounts Tab */}
              <TabsContent value="accounts" className="space-y-4 pt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Accounts You Manage</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    These are the seller accounts you have been granted access to help manage
                  </p>
                </div>
                <div className="space-y-3">
                  {profileData.managedAccounts.map((account) => (
                    <Card key={account.accountId} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                            {account.accountOwnerName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{account.accountOwnerName}</p>
                            <p className="text-sm text-gray-600">{account.accountOwnerEmail}</p>
                            {account.schoolName && (
                              <p className="text-sm text-gray-500 mt-1">🏫 {account.schoolName}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {account.accountType === 'student_seller' ? 'Student Seller' : 'Individual Seller'}
                              </Badge>
                              <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">
                                <Shield className="size-3 mr-1" />
                                {account.permissionLevel}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={account.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                            {account.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-2">Linked: {account.linkedDate}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Activity History Tab */}
              <TabsContent value="activity" className="space-y-4 pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Your complete action history across all managed accounts
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExportCSV}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export CSV
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExportPDF}
                      className="gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Export PDF
                    </Button>
                  </div>
                </div>

                {/* Filters */}
                <Card className="p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category-filter" className="text-sm font-medium">Category</Label>
                      <Select
                        value={activityFilter}
                        onValueChange={setActivityFilter}
                      >
                        <SelectTrigger id="category-filter" className="h-10">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="product">📦 Product</SelectItem>
                          <SelectItem value="inquiry">💬 Inquiry</SelectItem>
                          <SelectItem value="financial">💰 Financial</SelectItem>
                          <SelectItem value="profile">👤 Profile</SelectItem>
                          <SelectItem value="shipment">🚚 Shipment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="account-filter" className="text-sm font-medium">Account</Label>
                      <Select
                        value={accountFilter}
                        onValueChange={setAccountFilter}
                      >
                        <SelectTrigger id="account-filter" className="h-10">
                          <SelectValue placeholder="All Accounts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Accounts</SelectItem>
                          {profileData.managedAccounts.map(account => (
                            <SelectItem key={account.accountId} value={account.accountOwnerName}>
                              {account.accountOwnerName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date-filter" className="text-sm font-medium">Time Period</Label>
                      <Select
                        value={dateRange}
                        onValueChange={setDateRange}
                      >
                        <SelectTrigger id="date-filter" className="h-10">
                          <SelectValue placeholder="All Time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="search-activities" className="text-sm font-medium">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="search-activities"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search activities..."
                          className="pl-9 h-10"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  {(activityFilter !== 'all' || accountFilter !== 'all' || searchQuery || dateRange !== 'all') && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                      <span className="text-sm text-gray-600">Active filters:</span>
                      {activityFilter !== 'all' && (
                        <Badge variant="outline" className="gap-1">
                          {activityFilter}
                          <button onClick={() => setActivityFilter('all')}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {accountFilter !== 'all' && (
                        <Badge variant="outline" className="gap-1">
                          {accountFilter}
                          <button onClick={() => setAccountFilter('all')}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {dateRange !== 'all' && (
                        <Badge variant="outline" className="gap-1">
                          {dateRange}
                          <button onClick={() => setDateRange('all')}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {searchQuery && (
                        <Badge variant="outline" className="gap-1">
                          "{searchQuery}"
                          <button onClick={() => setSearchQuery('')}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setActivityFilter('all');
                          setAccountFilter('all');
                          setSearchQuery('');
                          setDateRange('all');
                        }}
                        className="text-xs"
                      >
                        Clear all
                      </Button>
                    </div>
                  )}
                </Card>

                {/* Activity List */}
                <div className="space-y-3">
                  {filteredActivities.length > 0 ? (
                    filteredActivities.map((activity) => (
                      <Card key={activity.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl" role="img" aria-label={activity.category}>
                              {getCategoryIcon(activity.category)}
                            </span>
                            <div>
                              <p className="font-semibold text-gray-900">{activity.action}</p>
                              <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  <UserCheck className="size-3 mr-1" />
                                  {activity.account}
                                </Badge>
                                <Badge variant="secondary" className="text-xs capitalize">
                                  {activity.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="size-3" />
                            {activity.timestamp}
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-8">
                      <div className="text-center text-gray-500">
                        <Filter className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p className="font-medium">No activities found</p>
                        <p className="text-sm mt-1">Try adjusting your filters or search query</p>
                      </div>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6 pt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage how you receive updates about managed accounts
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-gray-600 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationPrefs.emailNotifications}
                      onCheckedChange={(checked) => setNotificationPrefs({
                        ...notificationPrefs,
                        emailNotifications: checked
                      })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-gray-600 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">SMS Notifications</p>
                        <p className="text-sm text-gray-600">Receive text message alerts</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationPrefs.smsNotifications}
                      onCheckedChange={(checked) => setNotificationPrefs({
                        ...notificationPrefs,
                        smsNotifications: checked
                      })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <Bell className="h-5 w-5 text-gray-600 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Activity Alerts</p>
                        <p className="text-sm text-gray-600">Get notified when actions are performed on accounts you manage</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationPrefs.activityAlerts}
                      onCheckedChange={(checked) => setNotificationPrefs({
                        ...notificationPrefs,
                        activityAlerts: checked
                      })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-600 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Weekly Reports</p>
                        <p className="text-sm text-gray-600">Receive weekly summary of all activities</p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationPrefs.weeklyReports}
                      onCheckedChange={(checked) => setNotificationPrefs({
                        ...notificationPrefs,
                        weeklyReports: checked
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="size-4 text-amber-600" />
                    <AlertDescription className="text-amber-900">
                      Remember to click "Save Changes" at the top to apply your notification preferences.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Update your account password
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={!isEditing}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={handlePasswordChange}
                      disabled={!isEditing}
                      className="h-12"
                    />
                    {newPassword && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Password Strength:</span>
                          <span className={`font-medium ${
                            passwordStrength < 25 ? 'text-red-600' :
                            passwordStrength < 50 ? 'text-orange-600' :
                            passwordStrength < 75 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={!isEditing}
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    size="sm"
                    onClick={handleChangePassword}
                    className="gap-2"
                  >
                    <Lock className="h-5 w-5" />
                    Change Password
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

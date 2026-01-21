import React, { useState } from 'react';
import { Users, Shield, Activity, Eye, UserPlus, Search, Filter, AlertCircle, Clock, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';

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

export function AdminCaregiverManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'revoked'>('all');

  const [accounts] = useState<AccountWithCaregivers[]>([
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
          status: 'active',
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
          caregiverId: 'cgv_001',
          caregiverName: 'Maria Garcia',
          caregiverEmail: 'maria.garcia@email.com',
          relationshipType: 'parent',
          permissionLevel: 'product_management',
          addedDate: '2024-11-20',
          status: 'active',
          totalActions: 23,
          lastActionDate: '2024-12-05'
        }
      ],
      totalCaregivers: 1
    },
  ]);

  const filteredAccounts = accounts.filter(account =>
    account.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Caregiver Management</h1>
          <p className="text-gray-400 mt-1">Monitor and manage caregiver accounts and their access</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Caregiver
        </Button>
      </div>

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

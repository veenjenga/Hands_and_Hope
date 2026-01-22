import React, { useState } from 'react';
import { Users, Plus, Shield, Trash2, Edit, Eye, AlertCircle, Clock, Activity, Check, X, UserPlus, Mail, Lock } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';

interface Caregiver {
  userId: string;
  fullName: string;
  email: string;
  relationshipType: string;
  relationshipDetails?: string;
  addedDate: string;
  lastLogin?: string;
  status: 'active' | 'pending' | 'revoked';
  permissionLevel: 'full' | 'financial_only' | 'product_management' | 'view_only' | 'custom';
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
  totalActions: number;
  lastActionDate?: string;
}

interface CaregiverActivity {
  activityId: string;
  caregiverName: string;
  action: string;
  actionDetails: string;
  timestamp: string;
  resourceType: string;
  resourceName?: string;
}

export function CaregiverManagementPage() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([
    {
      userId: 'cgv_001',
      fullName: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      relationshipType: 'parent',
      relationshipDetails: 'Mother',
      addedDate: '2024-12-01T10:00:00Z',
      lastLogin: '2024-12-06T14:30:00Z',
      status: 'active',
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
      totalActions: 45,
      lastActionDate: '2024-12-06T14:00:00Z'
    },
    {
      userId: 'cgv_002',
      fullName: 'Robert Johnson',
      email: 'robert.j@email.com',
      relationshipType: 'caregiver',
      relationshipDetails: 'Professional Caregiver',
      addedDate: '2024-11-20T09:00:00Z',
      lastLogin: '2024-12-05T16:00:00Z',
      status: 'active',
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
        editBio: false,
        editStoreName: false
      },
      totalActions: 23,
      lastActionDate: '2024-12-05T15:30:00Z'
    }
  ]);

  const [activities, setActivities] = useState<CaregiverActivity[]>([
    {
      activityId: 'cga_001',
      caregiverName: 'Maria Garcia',
      action: 'edited_product',
      actionDetails: 'Updated product description and price',
      timestamp: '2024-12-06T14:30:00Z',
      resourceType: 'product',
      resourceName: 'Handmade Ceramic Bowl'
    },
    {
      activityId: 'cga_002',
      caregiverName: 'Maria Garcia',
      action: 'responded_to_inquiry',
      actionDetails: 'Responded to buyer inquiry about shipping',
      timestamp: '2024-12-06T13:15:00Z',
      resourceType: 'message',
      resourceName: 'Inquiry #456'
    },
    {
      activityId: 'cga_003',
      caregiverName: 'Robert Johnson',
      action: 'added_product',
      actionDetails: 'Added new product',
      timestamp: '2024-12-05T15:30:00Z',
      resourceType: 'product',
      resourceName: 'Handmade Bookmark Set'
    }
  ]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [viewActivityDialogOpen, setViewActivityDialogOpen] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);

  const [newCaregiver, setNewCaregiver] = useState({
    fullName: '',
    email: '',
    relationshipType: 'parent',
    relationshipDetails: '',
    permissionLevel: 'full' as const
  });

  const [customPermissions, setCustomPermissions] = useState({
    viewProfile: true,
    editProfile: false,
    viewProducts: true,
    manageProducts: false,
    respondToInquiries: false,
    viewFinancials: true,
    withdrawMoney: false,
    manageShipments: false,
    viewAnalytics: true,
    editBio: false,
    editStoreName: false
  });

  const permissionPresets = {
    full: {
      label: 'Full Access',
      description: 'Complete access to all account features except personal info changes',
      icon: Shield,
      color: 'text-green-600'
    },
    financial_only: {
      label: 'Financial Management',
      description: 'View and manage financial aspects only',
      icon: Users,
      color: 'text-blue-600'
    },
    product_management: {
      label: 'Product Management',
      description: 'Manage products, inquiries, and shipments',
      icon: Activity,
      color: 'text-purple-600'
    },
    view_only: {
      label: 'View Only',
      description: 'Can view account information but cannot make changes',
      icon: Eye,
      color: 'text-gray-600'
    }
  };

  const handleAddCaregiver = () => {
    if (!newCaregiver.fullName || !newCaregiver.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Generate temporary password
    const tempPassword = generateSecurePassword();

    // Create new caregiver
    const caregiver: Caregiver = {
      userId: `cgv_${Date.now()}`,
      fullName: newCaregiver.fullName,
      email: newCaregiver.email,
      relationshipType: newCaregiver.relationshipType,
      relationshipDetails: newCaregiver.relationshipDetails,
      addedDate: new Date().toISOString(),
      status: 'pending',
      permissionLevel: newCaregiver.permissionLevel,
      permissions: getPermissionsForLevel(newCaregiver.permissionLevel),
      totalActions: 0
    };

    setCaregivers([...caregivers, caregiver]);
    setAddDialogOpen(false);
    
    // Reset form
    setNewCaregiver({
      fullName: '',
      email: '',
      relationshipType: 'parent',
      relationshipDetails: '',
      permissionLevel: 'full'
    });

    toast.success(
      'Caregiver added successfully!',
      {
        description: `An email with login credentials has been sent to ${newCaregiver.email}. Temporary password: ${tempPassword}`
      }
    );
  };

  const handleUpdatePermissions = () => {
    if (!selectedCaregiver) return;

    setCaregivers(caregivers.map(c => 
      c.userId === selectedCaregiver.userId 
        ? { ...c, permissions: customPermissions, permissionLevel: 'custom' }
        : c
    ));

    setEditDialogOpen(false);
    toast.success('Permissions updated successfully');
  };

  const handleRemoveCaregiver = () => {
    if (!selectedCaregiver) return;

    setCaregivers(caregivers.filter(c => c.userId !== selectedCaregiver.userId));
    setRemoveDialogOpen(false);
    toast.success(`${selectedCaregiver.fullName} has been removed`);
    setSelectedCaregiver(null);
  };

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const getPermissionsForLevel = (level: string) => {
    const presets: Record<string, typeof customPermissions> = {
      full: {
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
      financial_only: {
        viewProfile: true,
        editProfile: false,
        viewProducts: false,
        manageProducts: false,
        respondToInquiries: false,
        viewFinancials: true,
        withdrawMoney: true,
        manageShipments: false,
        viewAnalytics: true,
        editBio: false,
        editStoreName: false
      },
      product_management: {
        viewProfile: true,
        editProfile: false,
        viewProducts: true,
        manageProducts: true,
        respondToInquiries: true,
        viewFinancials: false,
        withdrawMoney: false,
        manageShipments: true,
        viewAnalytics: true,
        editBio: false,
        editStoreName: false
      },
      view_only: {
        viewProfile: true,
        editProfile: false,
        viewProducts: true,
        manageProducts: false,
        respondToInquiries: false,
        viewFinancials: true,
        withdrawMoney: false,
        manageShipments: false,
        viewAnalytics: true,
        editBio: false,
        editStoreName: false
      }
    };

    return presets[level] || presets.full;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'edited_product':
        return <Edit className="size-4" />;
      case 'added_product':
        return <Plus className="size-4" />;
      case 'responded_to_inquiry':
        return <Mail className="size-4" />;
      case 'withdrew_funds':
        return <Activity className="size-4" />;
      default:
        return <Activity className="size-4" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Caregiver Management</h1>
            <p className="text-gray-600">
              Manage caregivers, parents, guardians, and helpers who can assist with your account
            </p>
          </div>
          <Button 
            onClick={() => setAddDialogOpen(true)}
            className="flex items-center gap-2"
            aria-label="Add new caregiver or helper"
          >
            <UserPlus className="size-5" />
            Add Caregiver/Helper
          </Button>
        </div>
      </div>

      {/* Info Alert */}
      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <AlertCircle className="size-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <strong>What are caregivers?</strong> Caregivers are people you trust to help manage your account. 
          You can set exactly what they can do, and all their actions are logged for your review.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="caregivers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="caregivers" aria-label="View and manage caregivers">
            <Users className="size-4 mr-2" />
            Caregivers ({caregivers.length})
          </TabsTrigger>
          <TabsTrigger value="activity" aria-label="View caregiver activity log">
            <Activity className="size-4 mr-2" />
            Activity Log ({activities.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="caregivers" className="space-y-4">
          {caregivers.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="size-12 mx-auto mb-4 text-gray-400" />
              <h3 className="mb-2">No Caregivers Added</h3>
              <p className="text-gray-600 mb-4">
                You haven't added any caregivers yet. Add someone you trust to help manage your account.
              </p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <UserPlus className="size-4 mr-2" />
                Add Your First Caregiver
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {caregivers.map((caregiver) => (
                <Card key={caregiver.userId} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="size-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                          {caregiver.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{caregiver.fullName}</h3>
                          <p className="text-sm text-gray-600">{caregiver.email}</p>
                        </div>
                        <Badge variant={caregiver.status === 'active' ? 'default' : 'secondary'}>
                          {caregiver.status === 'active' && <Check className="size-3 mr-1" />}
                          {caregiver.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div>
                          <span className="text-gray-600">Relationship:</span>
                          <p className="font-medium capitalize">
                            {caregiver.relationshipType}
                            {caregiver.relationshipDetails && ` - ${caregiver.relationshipDetails}`}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Permission Level:</span>
                          <p className="font-medium capitalize">{caregiver.permissionLevel.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Added:</span>
                          <p className="font-medium">{formatDate(caregiver.addedDate)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Active:</span>
                          <p className="font-medium">
                            {caregiver.lastLogin ? formatDate(caregiver.lastLogin) : 'Never'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                        <Activity className="size-4" />
                        <span>{caregiver.totalActions} actions performed</span>
                        {caregiver.lastActionDate && (
                          <>
                            <span>•</span>
                            <Clock className="size-4" />
                            <span>Last action: {formatDate(caregiver.lastActionDate)}</span>
                          </>
                        )}
                      </div>

                      {/* Permission Summary */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {caregiver.permissions.manageProducts && (
                          <Badge variant="outline" className="text-xs">
                            <Edit className="size-3 mr-1" />
                            Manage Products
                          </Badge>
                        )}
                        {caregiver.permissions.respondToInquiries && (
                          <Badge variant="outline" className="text-xs">
                            <Mail className="size-3 mr-1" />
                            Respond to Inquiries
                          </Badge>
                        )}
                        {caregiver.permissions.withdrawMoney && (
                          <Badge variant="outline" className="text-xs">
                            <Activity className="size-3 mr-1" />
                            Withdraw Money
                          </Badge>
                        )}
                        {caregiver.permissions.manageShipments && (
                          <Badge variant="outline" className="text-xs">
                            Manage Shipments
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCaregiver(caregiver);
                          setCustomPermissions(caregiver.permissions);
                          setEditDialogOpen(true);
                        }}
                        aria-label={`Edit permissions for ${caregiver.fullName}`}
                      >
                        <Edit className="size-4 mr-2" />
                        Edit Permissions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCaregiver(caregiver);
                          setViewActivityDialogOpen(true);
                        }}
                        aria-label={`View activity log for ${caregiver.fullName}`}
                      >
                        <Eye className="size-4 mr-2" />
                        View Activity
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedCaregiver(caregiver);
                          setRemoveDialogOpen(true);
                        }}
                        aria-label={`Remove ${caregiver.fullName} as caregiver`}
                      >
                        <Trash2 className="size-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          {activities.length === 0 ? (
            <Card className="p-12 text-center">
              <Activity className="size-12 mx-auto mb-4 text-gray-400" />
              <h3 className="mb-2">No Activity Yet</h3>
              <p className="text-gray-600">
                When caregivers perform actions on your account, they'll appear here.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <Card key={activity.activityId} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                      {getActionIcon(activity.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{activity.caregiverName}</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.actionDetails}</p>
                          {activity.resourceName && (
                            <p className="text-sm text-gray-500 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {activity.resourceType}: {activity.resourceName}
                              </Badge>
                            </p>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 text-right">
                          <Clock className="size-3 inline mr-1" />
                          {formatDate(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Caregiver Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Caregiver/Helper</DialogTitle>
            <DialogDescription>
              Add someone you trust to help manage your account. They'll receive an email with login credentials.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={newCaregiver.fullName}
                onChange={(e) => setNewCaregiver({ ...newCaregiver, fullName: e.target.value })}
                placeholder="Enter caregiver's full name"
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={newCaregiver.email}
                onChange={(e) => setNewCaregiver({ ...newCaregiver, email: e.target.value })}
                placeholder="Enter email address"
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship *</Label>
              <Select
                value={newCaregiver.relationshipType}
                onValueChange={(value) => setNewCaregiver({ ...newCaregiver, relationshipType: value })}
              >
                <SelectTrigger id="relationship">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="guardian">Legal Guardian</SelectItem>
                  <SelectItem value="caregiver">Professional Caregiver</SelectItem>
                  <SelectItem value="helper">Helper/Assistant</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Relationship Details (Optional)</Label>
              <Input
                id="details"
                value={newCaregiver.relationshipDetails}
                onChange={(e) => setNewCaregiver({ ...newCaregiver, relationshipDetails: e.target.value })}
                placeholder="e.g., Mother, Father, Professional Aide"
              />
            </div>

            <div className="space-y-3">
              <Label>Permission Level *</Label>
              <div className="grid gap-3">
                {(Object.keys(permissionPresets) as Array<keyof typeof permissionPresets>).map((preset) => {
                  const Icon = permissionPresets[preset].icon;
                  return (
                    <Card
                      key={preset}
                      className={`p-4 cursor-pointer transition-all ${
                        newCaregiver.permissionLevel === preset
                          ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                          : 'hover:border-gray-400'
                      }`}
                      onClick={() => setNewCaregiver({ ...newCaregiver, permissionLevel: preset as any })}
                      role="radio"
                      aria-checked={newCaregiver.permissionLevel === preset}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setNewCaregiver({ ...newCaregiver, permissionLevel: preset as any });
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`size-5 ${permissionPresets[preset].color} flex-shrink-0`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{permissionPresets[preset].label}</h4>
                            {newCaregiver.permissionLevel === preset && (
                              <Check className="size-5 text-purple-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {permissionPresets[preset].description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            <Alert className="border-amber-200 bg-amber-50">
              <Lock className="size-4 text-amber-600" />
              <AlertDescription className="text-amber-900 text-sm">
                <strong>Security Notice:</strong> A temporary password will be auto-generated and sent to the caregiver's email. 
                They must change it on first login. All their actions will be logged.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCaregiver}>
              <UserPlus className="size-4 mr-2" />
              Add Caregiver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Permissions Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Permissions - {selectedCaregiver?.fullName}</DialogTitle>
            <DialogDescription>
              Customize what {selectedCaregiver?.fullName} can do with your account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              {Object.entries(customPermissions).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <Label htmlFor={key} className="font-medium capitalize cursor-pointer">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {getPermissionDescription(key)}
                    </p>
                  </div>
                  <Switch
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) =>
                      setCustomPermissions({ ...customPermissions, [key]: checked })
                    }
                    aria-label={`Toggle ${key.replace(/([A-Z])/g, ' $1').trim()} permission`}
                  />
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePermissions}>
              <Check className="size-4 mr-2" />
              Save Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Caregiver Dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Caregiver</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedCaregiver?.fullName}? They will immediately lose access to your account.
            </DialogDescription>
          </DialogHeader>

          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="size-4 text-red-600" />
            <AlertDescription className="text-red-900">
              <strong>This action is permanent.</strong> {selectedCaregiver?.fullName} will no longer be able to access or manage your account. 
              Their historical activity will remain visible for accountability.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveCaregiver}>
              <Trash2 className="size-4 mr-2" />
              Remove Caregiver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Activity Dialog */}
      <Dialog open={viewActivityDialogOpen} onOpenChange={setViewActivityDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Activity Log - {selectedCaregiver?.fullName}</DialogTitle>
            <DialogDescription>
              All actions performed by {selectedCaregiver?.fullName} on your account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {activities
              .filter((a) => a.caregiverName === selectedCaregiver?.fullName)
              .map((activity) => (
                <Card key={activity.activityId} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                      {getActionIcon(activity.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium capitalize">{activity.action.replace('_', ' ')}</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.actionDetails}</p>
                          {activity.resourceName && (
                            <p className="text-sm text-gray-500 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {activity.resourceType}: {activity.resourceName}
                              </Badge>
                            </p>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 text-right">
                          <Clock className="size-3 inline mr-1" />
                          {formatDate(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>

          <DialogFooter>
            <Button onClick={() => setViewActivityDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getPermissionDescription(key: string): string {
  const descriptions: Record<string, string> = {
    viewProfile: 'View your profile information',
    editProfile: 'Edit your profile (except name, email, password)',
    viewProducts: 'View your product listings',
    manageProducts: 'Add, edit, and delete products',
    respondToInquiries: 'Respond to buyer messages and inquiries',
    viewFinancials: 'View earnings and transaction history',
    withdrawMoney: 'Initiate money withdrawals',
    manageShipments: 'Update shipping and tracking information',
    viewAnalytics: 'View sales and performance analytics',
    editBio: 'Edit your biography and store description',
    editStoreName: 'Change your store name'
  };

  return descriptions[key] || 'Permission description';
}

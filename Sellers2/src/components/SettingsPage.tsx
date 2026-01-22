import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Bell, Lock, User, Globe, Shield, Save } from 'lucide-react';

interface SettingsPageProps {
  userRole: 'seller' | 'teacher' | 'student' | 'school';
  highContrast: boolean;
}

export function SettingsPage({ userRole, highContrast }: SettingsPageProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [inquiryNotifications, setInquiryNotifications] = useState(true);
  const [productApprovals, setProductApprovals] = useState(true);
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC-5');

  return (
    <div className="space-y-8">
      <div>
        <h1>Settings</h1>
        <p className={`mt-2 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
          Manage your account preferences and settings
        </p>
      </div>

      {/* Account Settings */}
      <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="John Doe" className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john@school.com" className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="(123) 456-7890" className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="school">School/Institution</Label>
              <Input id="school" placeholder="Lincoln High School" className="h-12" disabled={userRole === 'teacher'} />
            </div>
          </div>
          <Button size="lg">
            <Save className="h-5 w-5 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-4">
            <div>
              <Label htmlFor="email-notifications" className="cursor-pointer text-base">
                Email Notifications
              </Label>
              <p className={`mt-1 text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between space-x-4">
            <div>
              <Label htmlFor="push-notifications" className="cursor-pointer text-base">
                Push Notifications
              </Label>
              <p className={`mt-1 text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                Receive push notifications in browser
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          {userRole === 'teacher' && (
            <>
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <Label htmlFor="inquiry-notifications" className="cursor-pointer text-base">
                    Student Inquiry Alerts
                  </Label>
                  <p className={`mt-1 text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                    Get notified of unresponded student inquiries
                  </p>
                </div>
                <Switch
                  id="inquiry-notifications"
                  checked={inquiryNotifications}
                  onCheckedChange={setInquiryNotifications}
                />
              </div>

              <div className="flex items-center justify-between space-x-4">
                <div>
                  <Label htmlFor="product-approvals" className="cursor-pointer text-base">
                    Product Approval Requests
                  </Label>
                  <p className={`mt-1 text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                    Get notified when products need approval
                  </p>
                </div>
                <Switch
                  id="product-approvals"
                  checked={productApprovals}
                  onCheckedChange={setProductApprovals}
                />
              </div>
            </>
          )}

          <Button size="lg">
            <Save className="h-5 w-5 mr-2" />
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" className="h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" className="h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" className="h-12" />
          </div>
          <Button size="lg">
            <Lock className="h-5 w-5 mr-2" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Regional Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language" className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger id="timezone" className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                  <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                  <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                  <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button size="lg">
            <Save className="h-5 w-5 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      {userRole === 'teacher' && (
        <Card className={highContrast ? 'border-2 border-blue-500 bg-black' : 'bg-blue-50 border-blue-200'}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Data Privacy Notice</h4>
                <p className="text-sm text-blue-800">
                  As a teacher, your actions are logged and reported to your institution for compliance and transparency. 
                  Student data is protected under school privacy policies. For more information, see our Privacy Policy.
                </p>
                <Button variant="outline" className="mt-4" size="sm">
                  View Privacy Policy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

# Admin Dashboard Missing Pages - Add Before Line 965

Copy and paste this code **BEFORE** the `</main>` closing tag at line 965 in `/components/AdminDashboard.tsx`:

```tsx
          {/* LOCATIONS PAGE */}
          {currentPage === 'locations' && (
            <div className="space-y-6">
              <p className="text-gray-400">Geographic distribution of users across all locations</p>

              {MOCK_LOCATION_DATA.map((location) => (
                <Card key={location.location} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-xl">{location.location}</h3>
                          <p className="text-sm text-gray-400">Complete breakdown of all users</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2 border-gray-600 text-gray-300">
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-5">
                      <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                        <p className="text-sm text-blue-400">Schools</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{location.schools}</h3>
                      </div>
                      <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4">
                        <p className="text-sm text-purple-400">Teachers</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{location.teachers}</h3>
                      </div>
                      <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
                        <p className="text-sm text-green-400">Students</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{location.students}</h3>
                      </div>
                      <div className="bg-orange-600/10 border border-orange-600/30 rounded-lg p-4">
                        <p className="text-sm text-orange-400">Individuals</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{location.individuals}</h3>
                      </div>
                      <div className="bg-pink-600/10 border border-pink-600/30 rounded-lg p-4">
                        <p className="text-sm text-pink-400">Buyers</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{location.buyers}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* SCHOOL HIERARCHY PAGE */}
          {currentPage === 'hierarchy' && (
            <div className="space-y-6">
              <p className="text-gray-400">View school organizational structure and hierarchy</p>

              {MOCK_ALL_USERS.filter(u => u.type === 'school').map((school) => (
                <Card key={school.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                          <School className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">{school.name}</h3>
                          <p className="text-sm text-gray-400">{school.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Total Members</p>
                        <p className="text-2xl font-bold text-white">{(school.teachers || 0) + (school.students || 0)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="border-t border-gray-700 pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 bg-purple-600/10 border border-purple-600/30 rounded-lg p-4">
                        <GraduationCap className="h-8 w-8 text-purple-400" />
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">Teachers</h4>
                          <p className="text-sm text-gray-400">Educators managing students</p>
                        </div>
                        <Badge variant="outline" className="text-purple-400 border-purple-400">{school.teachers || 0} Teachers</Badge>
                      </div>
                      <div className="flex items-center gap-4 bg-green-600/10 border border-green-600/30 rounded-lg p-4">
                        <Users className="h-8 w-8 text-green-400" />
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">Students</h4>
                          <p className="text-sm text-gray-400">Students selling products</p>
                        </div>
                        <Badge variant="outline" className="text-green-400 border-green-400">{school.students || 0} Students</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* REPORTS PAGE */}
          {currentPage === 'reports' && (
            <div className="space-y-6">
              <p className="text-gray-400">Misconduct reports from users</p>

              <Tabs defaultValue="pending">
                <TabsList>
                  <TabsTrigger value="pending">Pending ({MOCK_REPORTS.filter(r => r.status === 'pending').length})</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved ({MOCK_REPORTS.filter(r => r.status === 'resolved').length})</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4 mt-6">
                  {MOCK_REPORTS.filter(r => r.status === 'pending').map((report) => (
                    <Card key={report.id} className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-semibold">Report against {report.reportedUser}</h3>
                            <p className="text-sm text-gray-400">Reported by {report.reporterName} on {report.date}</p>
                          </div>
                          <Badge variant="destructive">Pending Review</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 border-t border-gray-700 pt-4">
                        <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4">
                          <Label className="text-red-400">Reason for Report:</Label>
                          <p className="text-white mt-2">{report.reason}</p>
                        </div>
                        <div className="flex gap-3">
                          <Button className="flex-1 bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Investigate & Resolve
                          </Button>
                          <Button variant="outline" className="flex-1 border-gray-600 text-gray-300">
                            <Eye className="h-4 w-4 mr-2" />
                            View User Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="resolved" className="space-y-4 mt-6">
                  {MOCK_REPORTS.filter(r => r.status === 'resolved').map((report) => (
                    <Card key={report.id} className="bg-gray-800 border-gray-700 border-green-600/30">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-semibold">Report against {report.reportedUser}</h3>
                            <p className="text-sm text-gray-400">Reported by {report.reporterName} on {report.date}</p>
                          </div>
                          <Badge variant="outline" className="text-green-400 border-green-400">Resolved</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="border-t border-gray-700 pt-4">
                        <p className="text-gray-400">{report.reason}</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* DEACTIVATED ACCOUNTS PAGE */}
          {currentPage === 'deactivated' && (
            <div className="space-y-6">
              <p className="text-gray-400">Banned and deactivated user accounts</p>

              {MOCK_ALL_USERS.filter(u => u.status === 'banned').map((user) => (
                <Card key={user.id} className="bg-gray-800 border-gray-700 border-red-600/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 bg-red-600">
                          <AvatarFallback className="text-white">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-white font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-400">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{user.type}</Badge>
                            <Badge variant="destructive">Banned</Badge>
                          </div>
                        </div>
                      </div>
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleActivateUser(user.id)}
                      >
                        <Unlock className="h-4 w-4 mr-2" />
                        Reactivate Account
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="border-t border-gray-700 pt-4">
                    <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4">
                      <Label className="text-red-400">Ban Reason:</Label>
                      <p className="text-white mt-2">{user.banReason}</p>
                      <p className="text-sm text-gray-400 mt-2">Banned on: {user.bannedDate}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {MOCK_ALL_USERS.filter(u => u.status === 'banned').length === 0 && (
                <Card className="bg-gray-800 border-gray-700 p-12 text-center">
                  <CheckCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white">No Deactivated Accounts</h3>
                  <p className="text-gray-400 mt-2">All users are active</p>
                </Card>
              )}
            </div>
          )}

          {/* ADMIN MANAGEMENT PAGE - Super Admin Only */}
          {currentPage === 'admins' && adminRole === 'super-admin' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-400">Manage administrator accounts</p>
                <Dialog open={showCreateAdmin} onOpenChange={setShowCreateAdmin}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4" />
                      Create New Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Create New Administrator</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Add a new admin with auto-generated credentials
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Full Name *</Label>
                        <Input id="adminFullName" placeholder="Enter full name" className="h-12 bg-gray-900 border-gray-700 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Email Address *</Label>
                        <Input id="adminEmail" type="email" placeholder="admin@handsandhope.com" className="h-12 bg-gray-900 border-gray-700 text-white" />
                      </div>
                      <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                        <p className="text-sm text-blue-400 mb-2">Auto-Generated Password:</p>
                        <p className="text-white font-mono text-lg">{generatePassword()}</p>
                        <p className="text-xs text-gray-400 mt-2">Admin can change this password after first login</p>
                      </div>
                      <Button className="w-full" onClick={() => {
                        alert('Admin account created successfully!');
                        setShowCreateAdmin(false);
                      }}>
                        <UserCog className="h-4 w-4 mr-2" />
                        Create Admin Account
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {MOCK_ADMINS.map((admin) => (
                <Card key={admin.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 bg-gradient-to-br from-blue-600 to-purple-600">
                          <AvatarFallback className="text-white">{admin.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-white font-semibold">{admin.name}</h3>
                          <p className="text-sm text-gray-400">{admin.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={admin.role === 'super-admin' ? 'default' : 'secondary'}>
                              {admin.role === 'super-admin' ? 'Super Admin' : 'Admin'}
                            </Badge>
                            <Badge variant="outline" className="text-green-400 border-green-400">{admin.status}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="border-t border-gray-700 pt-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label className="text-gray-400">Created Date</Label>
                        <p className="text-white mt-1">{admin.createdDate}</p>
                      </div>
                      <div>
                        <Label className="text-gray-400">Last Login</Label>
                        <p className="text-white mt-1">{admin.lastLogin}</p>
                      </div>
                      {admin.createdBy && (
                        <div>
                          <Label className="text-gray-400">Created By</Label>
                          <p className="text-white mt-1">{admin.createdBy}</p>
                        </div>
                      )}
                    </div>
                    {admin.role !== 'super-admin' && (
                      <div className="flex gap-3 mt-4">
                        <Button size="sm" variant="outline" className="gap-2 border-gray-600 text-gray-300">
                          <Edit className="h-4 w-4" />
                          Edit Admin
                        </Button>
                        <Button size="sm" variant="destructive" className="gap-2">
                          <Trash2 className="h-4 w-4" />
                          Remove Admin
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* NOTIFICATIONS PAGE */}
          {currentPage === 'notifications' && (
            <div className="space-y-6">
              <p className="text-gray-400">System notifications and alerts</p>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: 1, type: 'new-account', message: '2 new account requests pending approval', time: '10 minutes ago', unread: true },
                      { id: 2, type: 'product', message: 'New product submitted for review', time: '1 hour ago', unread: true },
                      { id: 3, type: 'report', message: 'Misconduct report filed against user', time: '2 hours ago', unread: true },
                      { id: 4, type: 'transaction', message: 'High-value transaction completed', time: '5 hours ago', unread: false },
                    ].map((notification) => (
                      <div key={notification.id} className={`flex items-start gap-4 p-4 rounded-lg ${notification.unread ? 'bg-blue-600/10 border border-blue-600/30' : 'bg-gray-700/50'}`}>
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <Bell className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white">{notification.message}</p>
                          <p className="text-sm text-gray-400 mt-1">{notification.time}</p>
                        </div>
                        {notification.unread && (
                          <Badge variant="default" className="text-xs">New</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PROFILE PAGE */}
          {currentPage === 'profile' && (
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Admin Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24 bg-gradient-to-br from-blue-600 to-purple-600">
                      <AvatarFallback className="text-white text-3xl">
                        {adminRole === 'super-admin' ? 'SA' : 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-white text-2xl font-bold">
                        {adminRole === 'super-admin' ? 'Super Admin' : 'Admin'}
                      </h2>
                      <p className="text-gray-400">
                        {adminRole === 'super-admin' ? 'superadmin@handsandhope.com' : 'admin@handsandhope.com'}
                      </p>
                      <Badge variant="default" className="mt-2">
                        {adminRole === 'super-admin' ? 'Super Administrator' : 'Administrator'}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Full Name</Label>
                      <Input 
                        defaultValue={adminRole === 'super-admin' ? 'Super Admin' : 'Admin'} 
                        className="h-12 bg-gray-900 border-gray-700 text-white" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Email Address</Label>
                      <Input 
                        defaultValue={adminRole === 'super-admin' ? 'superadmin@handsandhope.com' : 'admin@handsandhope.com'} 
                        className="h-12 bg-gray-900 border-gray-700 text-white" 
                      />
                    </div>
                  </div>

                  <div className="bg-orange-600/10 border border-orange-600/30 rounded-lg p-4">
                    <p className="text-sm text-orange-400">
                      <strong>Note:</strong> Password changes are disabled for security. Contact system administrator to reset your password.
                    </p>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => alert('Profile updated successfully!')}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* SETTINGS PAGE */}
          {currentPage === 'settings' && (
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">System Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div>
                        <h4 className="text-white font-semibold">Email Notifications</h4>
                        <p className="text-sm text-gray-400">Receive email alerts for important events</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-6 h-6" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div>
                        <h4 className="text-white font-semibold">Auto-approve Verified Schools</h4>
                        <p className="text-sm text-gray-400">Automatically approve schools with valid registration</p>
                      </div>
                      <input type="checkbox" className="w-6 h-6" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div>
                        <h4 className="text-white font-semibold">Weekly Analytics Report</h4>
                        <p className="text-sm text-gray-400">Receive weekly summary of platform analytics</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-6 h-6" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div>
                        <h4 className="text-white font-semibold">Security Logs</h4>
                        <p className="text-sm text-gray-400">Enable detailed security and access logging</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-6 h-6" />
                    </div>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => alert('Settings saved!')}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-red-400">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4">
                    <h4 className="text-red-400 font-semibold">Export All Platform Data</h4>
                    <p className="text-sm text-gray-400 mt-1">Download complete database backup</p>
                    <Button variant="destructive" className="mt-3" onClick={() => handleExportData('database')}>
                      <Database className="h-4 w-4 mr-2" />
                      Export Database
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
```

## Instructions:
1. Open `/components/AdminDashboard.tsx`
2. Find line 964 where it says `)}`
3. Add ALL of the above code RIGHT BEFORE the `</main>` tag
4. Save the file

All pages will then be functional!

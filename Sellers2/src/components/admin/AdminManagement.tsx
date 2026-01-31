import { useState, useEffect } from 'react';
import { Users, Shield, Mail, UserPlus, Search, Filter, AlertCircle, Clock, Edit, Trash2, Plus, X, Copy, Check, Send } from 'lucide-react';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super-admin';
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive';
}

export function AdminManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admins, setAdmins] = useState([]);

  const [addingAdmin, setAddingAdmin] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [activeTab, setActiveTab] = useState('admins');
  const [notifications, setNotifications] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'admin' as 'admin' | 'super-admin'
  });
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'admin' as 'admin' | 'super-admin'
  });
  const [copiedPassword, setCopiedPassword] = useState({});
  const [generatedPasswords, setGeneratedPasswords] = useState({});

  useEffect(() => {
    loadAdminData();
    loadNotifications();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch admins data from the API
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/admins`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch admins: ${response.statusText}`);
      }
      
      const data = await response.json();
      // Ensure admins have proper ID fields
      const adminsData = data.admins.map((admin: any) => ({
        ...admin,
        id: admin._id || admin.id
      }));
      setAdmins(adminsData as Admin[]);
    } catch (err: any) {
      console.error('Error loading admin data:', err);
      setError(err?.message || 'Failed to load admin data' as string | null);
      // Fallback to mock data if API fails
      const mockAdmins: Admin[] = [
        {
          id: 'adm_001',
          name: 'John Smith',
          email: 'john.smith@admin.com',
          role: 'super-admin',
          createdAt: '2024-01-15',
          lastLogin: '2024-12-06',
          status: 'active'
        },
        {
          id: 'adm_002',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@admin.com',
          role: 'admin',
          createdAt: '2024-02-20',
          lastLogin: '2024-12-05',
          status: 'active'
        },
      ];
      setAdmins(mockAdmins as Admin[]);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
      // Fallback to mock notifications
      setNotifications([
        {
          id: '1',
          title: 'Admin Account Created',
          message: 'New admin account created for John Smith',
          type: 'success',
          timestamp: new Date().toISOString(),
          read: false
        },
        {
          id: '2',
          title: 'Password Changed',
          message: 'Password updated for admin Sarah Johnson',
          type: 'info',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: true
        },
        {
          id: '3',
          title: 'Account Deleted',
          message: 'Admin account deleted for former user',
          type: 'warning',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: true
        }
      ]);
    }
  };

  const handleAddAdmin = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/create-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAdmin)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create admin');
      }
      
      const result = await response.json();
      
      // Set the temporary password received from the backend
      setGeneratedPasswords(prev => ({
        ...prev,
        [result.user._id || result.user.id]: result.tempPassword
      } as Record<string, string>));
      
      // Reset form
      setNewAdmin({ name: '', email: '', role: 'admin' });
      
      // Reload data
      loadAdminData();
    } catch (err: any) {
      console.error('Error creating admin:', err);
      setError(err?.message || 'Failed to create admin' as string | null);
    }
  };

  const copyToClipboard = async (text: string, adminId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPassword(prev => ({ ...prev, [adminId]: true } as Record<string, boolean>));
      setTimeout(() => {
        setCopiedPassword(prev => ({ ...prev, [adminId]: false } as Record<string, boolean>));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };
  
  const handleEditAdmin = async () => {
    if (!editingAdmin) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${editingAdmin.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update admin');
      }
      
      // Reload data
      loadAdminData();
      
      // Close the edit modal
      setEditingAdmin(null);
    } catch (err: any) {
      console.error('Error updating admin:', err);
      setError(err?.message || 'Failed to update admin' as string | null);
    }
  };
  
  const handleDeleteAdmin = async (adminId: string) => {
    if (!window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete admin');
      }
      
      // Reload data
      loadAdminData();
    } catch (err: any) {
      console.error('Error deleting admin:', err);
      setError(err?.message || 'Failed to delete admin' as string | null);
    }
  };
  
  const handleChangePassword = async () => {
    if (!editingAdmin || !newPassword) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${editingAdmin.id}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
      }
      
      // Reset password field and close modal
      setNewPassword('');
      setChangingPassword(false);
      
      // Show success message
      setError('Password changed successfully!' as string | null);
      setTimeout(() => setError(null), 3000);
    } catch (err: any) {
      console.error('Error changing password:', err);
      setError(err?.message || 'Failed to change password' as string | null);
    }
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Management</h1>
          <p className="text-gray-400 mt-1">Manage admin accounts and their permissions</p>
        </div>
        
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700"
          onClick={() => {
            setAddingAdmin(true);
            setNewAdmin({ name: '', email: '', role: 'admin' });
          }}
        >
          <UserPlus className="h-4 w-4" />
          Add Admin
        </button>
      </div>
      
      {/* Dynamic Add Admin Form */}
      {addingAdmin && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mt-4">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Admin
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <input
                  id="fullName"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                  placeholder="Enter full name"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  placeholder="Enter email address"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                  Role
                </label>
                <select 
                  id="role"
                  value={newAdmin.role} 
                  onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value as 'admin' | 'super-admin'})}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <button 
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700"
                onClick={() => setAddingAdmin(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleAddAdmin}
              >
                Create Admin
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Admin Modal */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setEditingAdmin(null)}
          ></div>
          <div className="relative bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700 z-50 m-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Edit Admin</h3>
              <p className="text-gray-400 text-sm">
                Update admin account information
              </p>
            </div>
            
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="editFullName" className="block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <input
                  id="editFullName"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="editEmail" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  id="editEmail"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="editRole" className="block text-sm font-medium text-gray-300">
                  Role
                </label>
                <select 
                  id="editRole"
                  value={editForm.role} 
                  onChange={(e) => setEditForm({...editForm, role: e.target.value as 'admin' | 'super-admin'})}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button 
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700"
                onClick={() => setEditingAdmin(null)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleEditAdmin}
              >
                Save Changes
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <button 
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white"
                onClick={() => setChangingPassword(true)}
              >
                Change Password
              </button>
            </div>
            
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setEditingAdmin(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Change Password Modal */}
      {changingPassword && editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => {
              setChangingPassword(false);
              setNewPassword('');
            }}
          ></div>
          <div className="relative bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700 z-50 m-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Change Password</h3>
              <p className="text-gray-400 text-sm">
                Set new password for {editingAdmin.name}
              </p>
            </div>
            
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button 
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700"
                onClick={() => {
                  setChangingPassword(false);
                  setNewPassword('');
                }}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                onClick={handleChangePassword}
                disabled={!newPassword}
              >
                Change Password
              </button>
            </div>
            
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => {
                  setChangingPassword(false);
                  setNewPassword('');
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
        <div className="border border-red-200 bg-red-50/10 rounded-md p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 text-red-400" />
            <p className="text-red-300">
              Error: {error}
            </p>
          </div>
        </div>
      )}

      <div className="border border-blue-200 bg-blue-50/10 rounded-md p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-4 text-blue-400" />
          <p className="text-blue-300">
            Super admins have full system access. Admins have limited access based on assigned permissions.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Tabs */}
        <div className="bg-gray-800 border border-gray-700 rounded-t-lg flex">
          <button 
            className={`px-4 py-2 rounded-t-lg ${activeTab === 'admins' ? 'text-white bg-gray-700' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('admins')}
          >
            Admin Accounts
          </button>
          <button 
            className={`px-4 py-2 rounded-t-lg ${activeTab === 'activity' ? 'text-white bg-gray-700' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('activity')}
          >
            Recent Activity
          </button>
        </div>

        {/* Admins Tab */}
        {activeTab === 'admins' && (
          <div className="space-y-4">
          {/* Filters */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg">
            <div className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 bg-gray-900 border border-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-40 bg-gray-900 border border-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Admins List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAdmins.map((admin, index) => (
              <div key={admin._id || admin.id || index} className="bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors">
                <div className="p-4 pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white flex items-center gap-2">
                        {admin.name}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          admin.role === 'super-admin' 
                            ? 'bg-blue-900 text-blue-200' 
                            : 'bg-purple-900 text-purple-200'
                        }`}>
                          {admin.role === 'super-admin' ? 'Super Admin' : 'Admin'}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {admin.email}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        className="h-8 w-8 text-gray-400 hover:text-white flex items-center justify-center"
                        onClick={() => {
                          setEditingAdmin({...admin, _id: admin._id || admin.id});
                          setEditForm({
                            name: admin.name,
                            email: admin.email,
                            role: admin.role
                          });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="h-8 w-8 text-gray-400 hover:text-red-500 flex items-center justify-center"
                        onClick={() => handleDeleteAdmin(admin._id || admin.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Created:</span>
                      <span className="text-gray-300">{new Date(admin.createdAt).toLocaleDateString()}</span>
                    </div>
                    {admin.lastLogin && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Last Login:</span>
                        <span className="text-gray-300">{new Date(admin.lastLogin).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        admin.status === 'active' 
                          ? 'bg-green-900 text-green-200' 
                          : 'bg-red-900 text-red-200'
                      }`}>
                        {admin.status}
                      </span>
                    </div>
                  </div>
                  
                  {generatedPasswords[admin._id || admin.id] && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Temp Password:</span>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-900 px-2 py-1 rounded text-yellow-400">
                            {generatedPasswords[admin._id || admin.id]}
                          </code>
                          <button
                            className="h-6 w-6 text-gray-400 hover:text-white flex items-center justify-center"
                            onClick={() => copyToClipboard(generatedPasswords[admin._id || admin.id], admin._id || admin.id)}
                          >
                            {copiedPassword[admin._id || admin.id] ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <button 
                        className="mt-2 w-full text-xs border border-gray-600 text-gray-300 hover:bg-gray-700 py-2 rounded-md flex items-center justify-center gap-1"
                      >
                        <Send className="h-3 w-3" />
                        Send Invitation
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-white text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  <Clock className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                  <p>No recent activity found</p>
                </div>
              ) : (
                notifications.slice(0, 10).map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      notification.type === 'error' ? 'border-l-red-500 bg-red-500/10' :
                      notification.type === 'success' ? 'border-l-green-500 bg-green-500/10' :
                      notification.type === 'warning' ? 'border-l-yellow-500 bg-yellow-500/10' :
                      notification.type === 'info' ? 'border-l-blue-500 bg-blue-500/10' :
                      'border-l-gray-500 bg-gray-500/10'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-medium">{notification.title}</h4>
                        <p className="text-gray-300 text-sm mt-1">{notification.message}</p>
                        <p className="text-gray-500 text-xs mt-2">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 ml-2 flex-shrink-0"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
    </div>
  );
}
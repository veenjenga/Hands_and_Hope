// Admin API Service
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Define TypeScript interfaces
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  banned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  status: string;
  sellerId: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: string;
  amount: number;
  date: string;
  status: string;
}

interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  status: string;
  createdAt: string;
}

interface FundOnHold {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  reason: string;
  status: string;
  holdDate: string;
}

interface DashboardStats {
  totalUsers: number;
  pendingAccounts: number;
  activeUsers: number;
  bannedUsers: number;
  totalProducts: number;
  pendingProducts: number;
  totalOrders: number;
  totalSchools: number;
  totalTeachers: number;
  totalStudents: number;
  recentSignups: number;
  recentOrders: number;
}

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super-admin';
  status: string;
  createdDate: string;
  lastLogin: string;
  createdBy?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface UsersResponse {
  users: User[];
  pagination: Pagination;
}

class AdminApiService {
  token: string | null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data as T;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request('/admin/stats');
  }

  // User Management
  async getAllUsers(params: Record<string, string> = {}): Promise<ApiResponse<UsersResponse>> {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`/admin/users?${queryParams}`);
  }

  async banUser(userId: string, reason: string): Promise<ApiResponse<User>> {
    return this.request(`/admin/users/${userId}/ban`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    });
  }

  async unbanUser(userId: string): Promise<ApiResponse<User>> {
    return this.request(`/admin/users/${userId}/unban`, {
      method: 'PUT'
    });
  }

  async approveUser(userId: string): Promise<ApiResponse<User>> {
    return this.request(`/admin/users/${userId}/approve`, {
      method: 'PUT'
    });
  }

  async deleteUser(userId: string): Promise<ApiResponse<User>> {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE'
    });
  }

  // Pending Accounts
  async getPendingAccounts(): Promise<ApiResponse<{ pendingAccounts: User[] }>> {
    return this.request('/admin/pending-accounts');
  }

  async approveAccount(userId: string): Promise<ApiResponse<User>> {
    return this.request(`/admin/users/${userId}/approve`, {
      method: 'PUT'
    });
  }

  async declineAccount(userId: string, reason: string): Promise<ApiResponse<User>> {
    return this.request(`/admin/users/${userId}/decline`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    });
  }

  // Product Management
  async getPendingProducts(): Promise<ApiResponse<{ pendingProducts: Product[] }>> {
    return this.request('/admin/pending-products');
  }

  async approveProduct(productId: string): Promise<ApiResponse<Product>> {
    return this.request(`/admin/products/${productId}/approve`, {
      method: 'PUT'
    });
  }

  async declineProduct(productId: string, reason: string): Promise<ApiResponse<Product>> {
    return this.request(`/admin/products/${productId}/decline`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    });
  }

  // Reports Management
  async getReports(status: string = 'all'): Promise<ApiResponse<{ reports: Report[] }>> {
    return this.request(`/admin/reports?status=${status}`);
  }

  async updateReportStatus(reportId: string, status: string, resolutionNotes: string = ''): Promise<ApiResponse<Report>> {
    return this.request(`/admin/reports/${reportId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, resolutionNotes })
    });
  }

  // Transactions
  async getTransactions(params: Record<string, string> = {}): Promise<ApiResponse<{ transactions: Transaction[], pagination: Pagination }>> {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`/admin/transactions?${queryParams}`);
  }

  // Analytics
  async getAnalytics(timeframe: string = 'monthly'): Promise<ApiResponse<any>> {
    return this.request(`/admin/analytics?timeframe=${timeframe}`);
  }

  // Admin Management (Super Admin only)
  async createAdmin(userData: Partial<Admin>): Promise<ApiResponse<{ user: Admin }>> {
    return this.request('/admin/create-admin', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getAdmins(): Promise<ApiResponse<{ admins: Admin[] }>> {
    return this.request('/admin/admins');
  }

  // Funds on Hold
  async getFundsOnHold(status: string = 'all'): Promise<ApiResponse<{ funds: FundOnHold[] }>> {
    return this.request(`/admin/funds-on-hold?status=${status}`);
  }

  async updateFundHoldStatus(fundId: string, status: string, notes: string = ''): Promise<ApiResponse<FundOnHold>> {
    return this.request(`/admin/funds-on-hold/${fundId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    });
  }

  // Location Analytics
  async getLocationAnalytics(): Promise<ApiResponse<{ counties: any[], countries: any[] }>> {
    return this.request('/admin/location-analytics');
  }
}

export default new AdminApiService();
// Admin API Service
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AdminApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Dashboard Stats
  async getDashboardStats() {
    return this.request('/admin/stats');
  }

  // User Management
  async getAllUsers(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`/admin/users?${queryParams}`);
  }

  async banUser(userId, reason) {
    return this.request(`/admin/users/${userId}/ban`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    });
  }

  async unbanUser(userId) {
    return this.request(`/admin/users/${userId}/unban`, {
      method: 'PUT'
    });
  }

  async approveUser(userId) {
    return this.request(`/admin/users/${userId}/approve`, {
      method: 'PUT'
    });
  }

  async deleteUser(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE'
    });
  }

  // Pending Accounts
  async getPendingAccounts() {
    return this.request('/admin/pending-accounts');
  }

  async approveAccount(userId) {
    return this.request(`/admin/users/${userId}/approve`, {
      method: 'PUT'
    });
  }

  async declineAccount(userId, reason) {
    return this.request(`/admin/users/${userId}/decline`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    });
  }

  // Product Management
  async getPendingProducts() {
    return this.request('/admin/pending-products');
  }

  async approveProduct(productId) {
    return this.request(`/admin/products/${productId}/approve`, {
      method: 'PUT'
    });
  }

  async declineProduct(productId, reason) {
    return this.request(`/admin/products/${productId}/decline`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    });
  }

  // Reports Management
  async getReports(status = 'all') {
    return this.request(`/admin/reports?status=${status}`);
  }

  async updateReportStatus(reportId, status, resolutionNotes = '') {
    return this.request(`/admin/reports/${reportId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, resolutionNotes })
    });
  }

  // Transactions
  async getTransactions(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`/admin/transactions?${queryParams}`);
  }

  // Analytics
  async getAnalytics(timeframe = 'monthly') {
    return this.request(`/admin/analytics?timeframe=${timeframe}`);
  }

  // Admin Management (Super Admin only)
  async createAdmin(userData) {
    return this.request('/admin/create-admin', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getAdmins() {
    return this.request('/admin/admins');
  }

  // Funds on Hold
  async getFundsOnHold(status = 'all') {
    return this.request(`/admin/funds-on-hold?status=${status}`);
  }

  async updateFundHoldStatus(fundId, status, notes = '') {
    return this.request(`/admin/funds-on-hold/${fundId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    });
  }
}

export default new AdminApiService();
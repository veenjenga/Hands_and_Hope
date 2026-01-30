// Admin API Service for Sellers2 Frontend
// This service handles all admin-related API calls

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AdminApiService {
  constructor() {
    this.token = localStorage.getItem('adminToken');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('adminToken', token);
  }

  // Clear authentication
  clearAuth() {
    this.token = null;
    localStorage.removeItem('adminToken');
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error.message);
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (data.token && (data.user.role === 'admin' || data.user.role === 'super-admin')) {
      this.setToken(data.token);
      return data;
    } else {
      throw new Error('Invalid admin credentials');
    }
  }

  async logout() {
    this.clearAuth();
  }

  // Dashboard Statistics
  async getDashboardStats() {
    return this.request('/admin/stats');
  }

  // User Management
  async getAllUsers(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/admin/users?${params}`);
  }

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

  async deleteUser(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE'
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

  // Transaction Management
  async getTransactions(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/admin/transactions?${params}`);
  }

  // Analytics
  async getAnalytics(timeframe = 'monthly') {
    return this.request(`/admin/analytics?timeframe=${timeframe}`);
  }

  // Admin Management (Super Admin only)
  async getAdmins() {
    return this.request('/admin/admins');
  }

  async createAdmin(adminData) {
    return this.request('/admin/create-admin', {
      method: 'POST',
      body: JSON.stringify(adminData)
    });
  }

  // Commission Management
  async getCommissionStats(timeframe = 'monthly') {
    return this.request(`/admin/commission-stats?timeframe=${timeframe}`);
  }

  async getCommissionReports(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/admin/commission-reports?${params}`);
  }

  async updateCommissionRates(rates) {
    return this.request('/admin/commission-rates', {
      method: 'PUT',
      body: JSON.stringify(rates)
    });
  }

  // Funds Management
  async getFundsOnHold(status = 'all') {
    return this.request(`/admin/funds-on-hold?status=${status}`);
  }

  async updateFundHoldStatus(fundId, status, notes) {
    return this.request(`/admin/funds/${fundId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    });
  }

  // Location Analytics
  async getLocationAnalytics() {
    return this.request('/admin/location-analytics');
  }

  // Export Data
  async exportUsers() {
    return this.request('/admin/export/users');
  }

  async exportTransactions() {
    return this.request('/admin/export/transactions');
  }

  async exportReports() {
    return this.request('/admin/export/reports');
  }
}

// Create singleton instance
const adminApi = new AdminApiService();

export default adminApi;
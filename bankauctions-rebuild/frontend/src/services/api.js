const API_BASE = '/api/v1';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('ba_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: 'The server could not complete your request. Please try again.' };
    }

    if (!response.ok) {
      const error = new Error(data.message || 'API request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (!err.status) {
      console.error('API Network failure on:', endpoint, err);
      const networkErr = new Error('Cannot connect to BankAuctions backend server. Please ensure backend is running on port 5000.');
      networkErr.original = err;
      throw networkErr;
    }
    throw err;
  }
}

export const api = {
  preparePropertyPurchase: (id) => request(`/payments/property/${id}`, {method:'POST'}),
  getPurchases: () => request('/payments'),
  getPurchase: (id) => request(`/payments/${id}`),
  management: (path, options = {}) => request(`/management${path}`, options),
  admin: (path, options = {}) => request(`/admin${path}`, options),
  workflow: (path, options = {}) => request(`/workflow${path}`, options),
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // Auctions
  getAuctions: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    return request(`/auctions?${query.toString()}`);
  },
  getBanks: () => request('/auctions/banks'),
  exportAuctions: (params) => request(`/auctions/export?${new URLSearchParams(params)}`),
  getFeaturedAuctions: () => request('/auctions/featured'),
  getAuctionById: (id) => request(`/auctions/${id}`),
  unlockAuction: (id) => request(`/auctions/unlock/${id}`, { method: 'POST' }),
  saveAuction: (id) => request(`/auctions/save/${id}`, { method: 'POST' }),

  // Categories
  getCategories: (city) => request(`/categories${city ? `?city=${city}` : ''}`),
  getCategoryBySlug: (slug) => request(`/categories/${slug}`),

  // Buyer / Me
  getSavedProperties: () => request('/me/saved'),
  getUnlockedProperties: () => request('/me/unlocked'),
  updateProfile: (profile) => request('/me/profile', { method: 'PUT', body: JSON.stringify(profile) }),

  // Checker
  getCheckerQueue: (params = {}) => {
    const query = new URLSearchParams(params);
    return request(`/checker/queue?${query.toString()}`);
  },
  claimLot: (id) => request(`/checker/claim/${id}`, { method: 'POST' }),
  getReviewDetails: (id) => request(`/checker/reviews/${id}`),
  submitReview: (id, payload) => request(`/checker/reviews/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  getCheckerHistory: () => request('/checker/history'),

  // Engineer
  getEngineerAssignments: (status) => request(`/engineer/assignments${status ? `?status=${status}` : ''}`),
  getAssignmentDetails: (id) => request(`/engineer/assignments/${id}`),
  scheduleVisit: (id, payload) => request(`/engineer/assignments/${id}/schedule`, { method: 'POST', body: JSON.stringify(payload) }),
  submitInspection: (id, payload) => request(`/engineer/assignments/${id}/submit`, { method: 'POST', body: JSON.stringify(payload) }),

  // Admin
  getAdminOverview: () => request('/admin/overview'),
  getAdminAuctions: (params = {}) => {
    const query = new URLSearchParams(params);
    return request(`/admin/auctions?${query.toString()}`);
  },
  publishAuction: (id) => request(`/admin/auctions/${id}/publish`, { method: 'POST' }),
  unpublishAuction: (id) => request(`/admin/auctions/${id}/unpublish`, { method: 'POST' }),
  assignEngineer: (payload) => request('/admin/engineers/assign', { method: 'POST', body: JSON.stringify(payload) }),
  approveInspection: (id, payload) => request(`/admin/approvals/${id}`, { method: 'POST', body: JSON.stringify(payload) }),
  importBatch: (payload) => request('/admin/imports', { method: 'POST', body: JSON.stringify(payload) }),
  getUsers: (role) => request(`/admin/users${role ? `?role=${role}` : ''}`),
  giftUnlocks: (id, count) => request(`/admin/users/${id}/gift-unlocks`, { method: 'POST', body: JSON.stringify({ count }) }),
  toggleUserStatus: (id) => request(`/admin/users/${id}/toggle-status`, { method: 'POST' }),
  createStaff: (payload) => request('/admin/staff', { method: 'POST', body: JSON.stringify(payload) }),
  getAuditLogs: () => request('/admin/audit-logs'),
  getSettings: () => request('/admin/settings'),
  updateSettings: (payload) => request('/admin/settings', { method: 'PUT', body: JSON.stringify(payload) }),

  // Config
  getPlans: () => request('/config/plans')
};

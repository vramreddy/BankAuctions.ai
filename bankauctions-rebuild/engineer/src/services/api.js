const API_BASE = '/api/v1';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('ba_engineer_token') || localStorage.getItem('ba_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || `Request failed (${res.status})`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const api = {
  get: (url) => request(url, { method: 'GET' }),
  post: (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),
  patch: (url, body) => request(url, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (url) => request(url, { method: 'DELETE' }),

  workflow: (endpoint, options = {}) => request(`/workflow${endpoint}`, options),

  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ ...credentials, portal: 'ENGINEER' })
  }),
  getMe: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' })
};

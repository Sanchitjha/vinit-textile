let rawBase = import.meta.env.VITE_API_URL || '/api/v1';
if (rawBase.startsWith('http') && !rawBase.includes('/api/v1')) {
  rawBase = rawBase.replace(/\/$/, '') + '/api/v1';
}
const BASE_URL = rawBase;

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// A single in-flight refresh is shared by every request that 401s at the same
// time, so we hit /auth/refresh once, not once per pending call.
let refreshPromise = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // send the httpOnly refreshToken cookie
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('refresh failed');
        const body = await res.json();
        const token = body?.data?.accessToken;
        if (!token) throw new Error('no accessToken in refresh response');
        localStorage.setItem('accessToken', token);
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function fetchWithAuth(url, options = {}, retried = false) {
  const token = localStorage.getItem('accessToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  // Access token expired (15 min TTL) — rotate it once via the refresh cookie
  // and retry the original request, so an admin session doesn't die mid-task.
  const isAuthCall = url.startsWith('/auth/refresh') || url.startsWith('/auth/login');
  if (response.status === 401 && !retried && !isAuthCall) {
    try {
      await refreshAccessToken();
      return fetchWithAuth(url, options, true);
    } catch (e) {
      localStorage.removeItem('accessToken');
      // fall through and let the 401 surface
    }
  }

  if (!response.ok) {
    throw new ApiError(data?.message || 'Something went wrong', response.status, data);
  }

  return data;
}

export const apiClient = {
  get: (url, options) => fetchWithAuth(url, { method: 'GET', ...options }),
  post: (url, body, options) => fetchWithAuth(url, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (url, body, options) => fetchWithAuth(url, { method: 'PUT', body: JSON.stringify(body), ...options }),
  patch: (url, body, options) => fetchWithAuth(url, { method: 'PATCH', body: JSON.stringify(body), ...options }),
  delete: (url, options) => fetchWithAuth(url, { method: 'DELETE', ...options }),
};

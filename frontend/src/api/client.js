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
  let token = localStorage.getItem('accessToken');

  // If no accessToken is stored yet, but a Clerk session is active in the window, sync once
  // (Only for customer storefront flows, not when accessing admin panel)
  const storedUserRaw = localStorage.getItem('user');
  let isAdminSession = false;
  try {
    isAdminSession = storedUserRaw && JSON.parse(storedUserRaw)?.role === 'ADMIN';
  } catch {}

  const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

  if (!token && !isAdminSession && !isAdminPath && window.Clerk?.user?.primaryEmailAddress?.emailAddress && !url.startsWith('/auth/')) {
    try {
      const syncRes = await fetch(`${BASE_URL}/auth/clerk-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: window.Clerk.user.primaryEmailAddress.emailAddress,
          name: window.Clerk.user.fullName || window.Clerk.user.firstName,
          phone: window.Clerk.user.primaryPhoneNumber?.phoneNumber,
        }),
      });
      const syncData = await syncRes.json();
      if (syncData?.data?.accessToken) {
        token = syncData.data.accessToken;
        localStorage.setItem('accessToken', token);
      }
    } catch {
      // Proceed without token if sync fails
    }
  }

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

  // Access token expired (15 min TTL) — rotate it once or re-sync with Clerk for shoppers
  const isAuthCall = url.startsWith('/auth/refresh') || url.startsWith('/auth/login') || url.startsWith('/auth/clerk-sync');
  if (response.status === 401 && !retried && !isAuthCall) {
    if (!isAdminSession && !isAdminPath && window.Clerk?.user?.primaryEmailAddress?.emailAddress) {
      try {
        const syncRes = await fetch(`${BASE_URL}/auth/clerk-sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: window.Clerk.user.primaryEmailAddress.emailAddress,
            name: window.Clerk.user.fullName || window.Clerk.user.firstName,
            phone: window.Clerk.user.primaryPhoneNumber?.phoneNumber,
          }),
        });
        const syncData = await syncRes.json();
        if (syncData?.data?.accessToken) {
          localStorage.setItem('accessToken', syncData.data.accessToken);
          return fetchWithAuth(url, options, true);
        }
      } catch {
        // Fall through to standard refresh
      }
    }
    try {
      await refreshAccessToken();
      return fetchWithAuth(url, options, true);
    } catch (e) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
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

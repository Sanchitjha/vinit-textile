let rawBase = import.meta.env.VITE_API_URL || '/api/v1';
if (rawBase.startsWith('http') && !rawBase.includes('/api/v1')) {
  rawBase = rawBase.replace(/\/$/, '') + '/api/v1';
}
const BASE_URL = rawBase;

// Two independent sessions can live in one browser: the shopper (Clerk) and the admin (password login).
// They are stored under separate keys so one can never be mistaken for the other.
export const sessionKeys = {
  customer: { token: 'accessToken', user: 'user' },
  admin: { token: 'adminAccessToken', user: 'adminUser' },
};

// Admin pages use the admin session, everything else the shopper session.
export function scopeForPath() {
  return typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') ? 'admin' : 'customer';
}

export function clearSession(scope) {
  try {
    localStorage.removeItem(sessionKeys[scope].token);
    localStorage.removeItem(sessionKeys[scope].user);
  } catch {
    // storage unavailable
  }
}

// Only used to route a token to the right session; the server still enforces every permission.
function tokenRole(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload)).role ?? null;
  } catch {
    return null;
  }
}

// Older builds kept the admin session under the shopper keys, which made the admin's name, email,
// addresses and orders show up for whoever signed in as a shopper in the same browser.
(function migrateLegacyAdminSession() {
  try {
    const token = localStorage.getItem(sessionKeys.customer.token);
    const rawUser = localStorage.getItem(sessionKeys.customer.user);
    const isAdmin = (token && tokenRole(token) === 'ADMIN') || (rawUser && JSON.parse(rawUser)?.role === 'ADMIN');
    if (!isAdmin) return;
    if (token && tokenRole(token) === 'ADMIN') localStorage.setItem(sessionKeys.admin.token, token);
    if (rawUser && JSON.parse(rawUser)?.role === 'ADMIN') localStorage.setItem(sessionKeys.admin.user, rawUser);
    clearSession('customer');
  } catch {
    // ignore: worst case the user signs in again
  }
})();

// Exchanges the active Clerk session for our own API access token. The server verifies the Clerk
// session JWT itself and reads the (verified) email from Clerk, so only the session token is sent.
export async function syncClerkSession() {
  const sessionToken = await window.Clerk?.session?.getToken();
  if (!sessionToken) return null;
  const res = await fetch(`${BASE_URL}/auth/clerk-sync`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionToken}` },
    body: '{}',
  });
  if (!res.ok) return null;
  const body = await res.json();
  return body?.data ?? null;
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// A single in-flight refresh per session is shared by every request that 401s at the same
// time, so we hit /auth/refresh once, not once per pending call.
const refreshPromises = { customer: null, admin: null };

async function refreshAccessToken(scope) {
  if (!refreshPromises[scope]) {
    refreshPromises[scope] = fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // send the httpOnly refreshToken cookie
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('refresh failed');
        const body = await res.json();
        const token = body?.data?.accessToken;
        if (!token) throw new Error('no accessToken in refresh response');
        // The refresh cookie belongs to whoever signed in last; never let an admin token become the shopper's
        // session (or the other way round).
        if ((tokenRole(token) === 'ADMIN') !== (scope === 'admin')) throw new Error('refresh returned the other session');
        localStorage.setItem(sessionKeys[scope].token, token);
        return token;
      })
      .finally(() => {
        refreshPromises[scope] = null;
      });
  }
  return refreshPromises[scope];
}

async function fetchWithAuth(url, rawOptions = {}, retried = false) {
  const { scope: scopeOverride, ...options } = rawOptions;
  const scope = scopeOverride || scopeForPath();
  let token = localStorage.getItem(sessionKeys[scope].token);

  // If no shopper token is stored yet, but a Clerk session is active in the window, sync once
  if (scope === 'customer' && !token && window.Clerk?.session && !url.startsWith('/auth/')) {
    try {
      const synced = await syncClerkSession();
      if (synced?.accessToken) {
        token = synced.accessToken;
        localStorage.setItem(sessionKeys.customer.token, token);
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
    if (scope === 'customer' && window.Clerk?.session) {
      try {
        const synced = await syncClerkSession();
        if (synced?.accessToken) {
          localStorage.setItem(sessionKeys.customer.token, synced.accessToken);
          return fetchWithAuth(url, rawOptions, true);
        }
      } catch {
        // Fall through to standard refresh
      }
    }
    try {
      await refreshAccessToken(scope);
      return fetchWithAuth(url, rawOptions, true);
    } catch (e) {
      clearSession(scope);
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

const BASE_URL = '/api/v1';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('accessToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${url}`, config);
  
  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message || 'Something went wrong',
      response.status,
      data
    );
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

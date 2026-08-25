import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await apiClient.get('/users/me');
          setUser(res.data);
        } catch (error) {
          console.error('Failed to load user', error);
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
  };

  const register = async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

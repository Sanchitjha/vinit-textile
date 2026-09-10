import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await apiClient.get('/auth/me');
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

  // No fake-admin fallback: if the backend rejects the credentials, that error
  // must surface. A synthetic "logged in" state only works for public GETs and
  // then fails every real admin action with "Invalid or expired token".
  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
  };

  const sendOtp = async (email) => {
    await apiClient.post('/auth/otp/send', { email });
  };

  const verifyOtp = async (email, code, name) => {
    const res = await apiClient.post('/auth/otp/verify', { email, code, name });
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        sendOtp,
        verifyOtp,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

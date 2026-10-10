import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useUser, useClerk } from '@clerk/react';
import { apiClient } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [customUser, setCustomUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const { isSignedIn, isLoaded: clerkLoaded, user: clerkUser } = useUser();
  const { openSignIn, openSignUp, signOut: clerkSignOut } = useClerk();

  const openAuthModal = (mode) => {
    if (isSignedIn) return;
    if (openSignIn) {
      if (mode === 'signup') {
        openSignUp?.();
      } else {
        openSignIn?.();
      }
    } else {
      setAuthModalOpen(true);
    }
  };

  const closeAuthModal = () => setAuthModalOpen(false);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await apiClient.get('/auth/me');
          const userData = res.data?.user || res.data;
          setCustomUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('Failed to load user', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          setCustomUser(null);
        }
      } else {
        setCustomUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  // Sync Clerk authenticated user with backend to issue/maintain active accessToken & Mongo User record
  useEffect(() => {
    async function syncClerkUser() {
      if (!isSignedIn || !clerkUser) return;
      // Do NOT overwrite an active admin session with Clerk customer sync
      if (customUser?.role === 'ADMIN') return;
      const email = clerkUser.primaryEmailAddress?.emailAddress;
      if (!email) return;

      try {
        const res = await apiClient.post('/auth/clerk-sync', {
          email,
          name: clerkUser.fullName || clerkUser.firstName || email.split('@')[0],
          phone: clerkUser.primaryPhoneNumber?.phoneNumber || undefined,
        });
        if (res?.data?.accessToken && customUser?.role !== 'ADMIN') {
          localStorage.setItem('accessToken', res.data.accessToken);
          if (res.data.user) {
            setCustomUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        }
      } catch (err) {
        console.error('Failed to sync Clerk user with backend:', err);
      }
    }
    syncClerkUser();
  }, [isSignedIn, clerkUser, customUser?.role]);

  // Sync active user: recognize Admin, Clerk authenticated user, or fallback to custom backend user
  const user = useMemo(() => {
    // 1. If customUser is ADMIN, admin identity takes absolute precedence!
    if (customUser?.role === 'ADMIN') {
      return {
        ...customUser,
        id: customUser._id || customUser.id,
        role: 'ADMIN',
      };
    }

    // 2. If signed in via Clerk
    if (isSignedIn && clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress || '';
      const name =
        clerkUser.fullName ||
        clerkUser.firstName ||
        (email ? email.split('@')[0] : 'User');
      const phone = clerkUser.primaryPhoneNumber?.phoneNumber || '';
      return {
        id: customUser?._id || customUser?.id || clerkUser.id,
        _id: customUser?._id || customUser?.id || clerkUser.id,
        name: customUser?.name || name,
        email: customUser?.email || email,
        phone: customUser?.phone || phone,
        addresses: customUser?.addresses || [],
        imageUrl: clerkUser.imageUrl,
        role: customUser?.role || 'CUSTOMER',
        isClerk: true,
      };
    }

    // 3. Fallback to custom backend user (if any)
    if (customUser) {
      return {
        ...customUser,
        id: customUser._id || customUser.id,
        role: customUser.role || 'CUSTOMER',
      };
    }

    return null;
  }, [isSignedIn, clerkUser, customUser]);

  // If user is already authenticated, close old OTP auth modal
  useEffect(() => {
    if (user && authModalOpen) {
      setAuthModalOpen(false);
    }
  }, [user, authModalOpen]);

  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    const accessToken = res.data?.accessToken;
    const userData = res.data?.user || res.data;
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setCustomUser(userData);
    }
    return userData;
  };

  const register = async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    const accessToken = res.data?.accessToken;
    const userObj = res.data?.user || res.data;
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (userObj) {
      localStorage.setItem('user', JSON.stringify(userObj));
      setCustomUser(userObj);
    }
    return userObj;
  };

  const sendOtp = async (email) => {
    await apiClient.post('/auth/otp/send', { email });
  };

  const verifyOtp = async (email, code, name) => {
    const res = await apiClient.post('/auth/otp/verify', { email, code, name });
    const accessToken = res.data?.accessToken;
    const userObj = res.data?.user || res.data;
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (userObj) {
      localStorage.setItem('user', JSON.stringify(userObj));
      setCustomUser(userObj);
    }
    return userObj;
  };

  const logout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setCustomUser(null);
    if (isSignedIn && clerkSignOut) {
      try {
        await clerkSignOut();
      } catch (err) {
        console.error('Error signing out of Clerk:', err);
      }
    }
  };

  const isCustomerLoggedIn = Boolean(isSignedIn || (user && user.role !== 'ADMIN'));

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: loading || !clerkLoaded,
        isSignedIn: Boolean(isSignedIn),
        isCustomerLoggedIn,
        login,
        register,
        logout,
        sendOtp,
        verifyOtp,
        authModalOpen: authModalOpen && !user,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

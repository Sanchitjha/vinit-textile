import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/react';
import { apiClient, syncClerkSession, sessionKeys, clearSession } from '../api/client';

const AuthContext = createContext();

const readStoredUser = (scope) => {
  try {
    const saved = localStorage.getItem(sessionKeys[scope].user);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const storeSession = (scope, accessToken, userObj) => {
  try {
    if (accessToken) localStorage.setItem(sessionKeys[scope].token, accessToken);
    if (userObj) localStorage.setItem(sessionKeys[scope].user, JSON.stringify(userObj));
  } catch {
    // storage unavailable: the in-memory state still works for this page view
  }
};

const sameEmail = (a, b) => Boolean(a && b) && a.toLowerCase() === b.toLowerCase();

export function AuthProvider({ children }) {
  // Two separate sessions: the shopper (Clerk, or OTP/password for customers) and the admin (password).
  // The storefront only ever shows the shopper; /admin only ever shows the admin.
  const [customUser, setCustomUser] = useState(() => readStoredUser('customer'));
  const [adminUser, setAdminUser] = useState(() => readStoredUser('admin'));
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const onAdminPath = useLocation().pathname.startsWith('/admin');

  const { isSignedIn, isLoaded: clerkLoaded, user: clerkUser } = useUser();
  const { openSignIn, openSignUp, signOut: clerkSignOut } = useClerk();

  const openAuthModal = (mode) => {
    if (isSignedIn) return;
    try {
      if (mode === 'signup' && typeof openSignUp === 'function') {
        openSignUp({});
        return;
      }
      if (typeof openSignIn === 'function') {
        openSignIn({});
        return;
      }
    } catch (err) {
      console.warn('Clerk modal trigger error, falling back to auth modal:', err);
    }
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => setAuthModalOpen(false);

  useEffect(() => {
    async function loadScope(scope, setUser) {
      if (!localStorage.getItem(sessionKeys[scope].token)) {
        setUser(null);
        clearSession(scope);
        return;
      }
      try {
        const res = await apiClient.get('/auth/me', { scope });
        const userData = res.data?.user || res.data;
        // A token must only ever sit in the session that matches its role
        if ((userData?.role === 'ADMIN') !== (scope === 'admin')) throw new Error('session role mismatch');
        setUser(userData);
        storeSession(scope, null, userData);
      } catch (error) {
        console.error('Failed to load user', error);
        clearSession(scope);
        setUser(null);
      }
    }
    Promise.all([loadScope('customer', setCustomUser), loadScope('admin', setAdminUser)]).finally(() =>
      setLoading(false)
    );
  }, []);

  // Sync the Clerk user with the backend to issue/maintain the shopper's accessToken & Mongo User record
  useEffect(() => {
    async function syncClerkUser() {
      if (!isSignedIn || !clerkUser) return;
      const email = clerkUser.primaryEmailAddress?.emailAddress;
      if (!email) return;

      if (customUser && !sameEmail(customUser.email, email)) {
        // A stored shopper session that belongs to someone else must never be used for this Clerk user
        clearSession('customer');
      } else if (customUser && localStorage.getItem(sessionKeys.customer.token)) {
        return; // already synced for this user
      }

      try {
        const synced = await syncClerkSession();
        if (synced?.accessToken) {
          storeSession('customer', synced.accessToken, synced.user);
          if (synced.user) setCustomUser(synced.user);
        }
      } catch (err) {
        console.error('Failed to sync Clerk user with backend:', err);
      }
    }
    syncClerkUser();
  }, [isSignedIn, clerkUser, customUser?.email]);

  // Active user: on /admin the admin; everywhere else the signed-in shopper (Clerk first, then OTP/password)
  const user = useMemo(() => {
    if (onAdminPath) {
      return adminUser ? { ...adminUser, id: adminUser._id || adminUser.id, role: 'ADMIN' } : null;
    }

    if (isSignedIn && clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress || '';
      const name =
        clerkUser.fullName ||
        clerkUser.firstName ||
        (email ? email.split('@')[0] : 'User');
      const phone = clerkUser.primaryPhoneNumber?.phoneNumber || '';
      // Only borrow backend details (saved phone, role) if they belong to this very Clerk user
      const own = customUser && sameEmail(customUser.email, email) ? customUser : null;
      return {
        id: own?._id || own?.id || clerkUser.id,
        _id: own?._id || own?.id || clerkUser.id,
        name: own?.name || name,
        email: own?.email || email,
        phone: own?.phone || phone,
        addresses: own?.addresses || [],
        imageUrl: clerkUser.imageUrl,
        createdAt: own?.createdAt || clerkUser.createdAt,
        role: own?.role || 'CUSTOMER',
        isClerk: true,
      };
    }

    if (customUser) {
      return {
        ...customUser,
        id: customUser._id || customUser.id,
        role: customUser.role || 'CUSTOMER',
      };
    }

    return null;
  }, [onAdminPath, adminUser, isSignedIn, clerkUser, customUser]);

  // If user is already authenticated, close old OTP auth modal
  useEffect(() => {
    if (user && authModalOpen) {
      setAuthModalOpen(false);
    }
  }, [user, authModalOpen]);

  // Files the session under admin or shopper depending on who actually signed in
  const applySession = (userObj, accessToken) => {
    if (!userObj) return;
    const scope = userObj.role === 'ADMIN' ? 'admin' : 'customer';
    storeSession(scope, accessToken, userObj);
    if (scope === 'admin') setAdminUser(userObj);
    else setCustomUser(userObj);
  };

  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    const userData = res.data?.user || res.data;
    applySession(userData, res.data?.accessToken);
    return userData;
  };

  const register = async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    const userObj = res.data?.user || res.data;
    applySession(userObj, res.data?.accessToken);
    return userObj;
  };

  // Saves name / phone for the signed-in shopper and refreshes what the rest of the site shows
  const updateProfile = async (fields) => {
    const res = await apiClient.patch('/users/me', fields, { scope: 'customer' });
    const updated = res.data?.user || res.data;
    if (updated && updated.role !== 'ADMIN') {
      storeSession('customer', null, updated);
      setCustomUser(updated);
    }
    return updated;
  };

  const sendOtp = async (email) => {
    await apiClient.post('/auth/otp/send', { email });
  };

  const verifyOtp = async (email, code, name) => {
    const res = await apiClient.post('/auth/otp/verify', { email, code, name });
    const userObj = res.data?.user || res.data;
    applySession(userObj, res.data?.accessToken);
    return userObj;
  };

  const logout = async () => {
    if (onAdminPath) {
      clearSession('admin');
      setAdminUser(null);
      return;
    }
    clearSession('customer');
    setCustomUser(null);
    if (isSignedIn && clerkSignOut) {
      try {
        await clerkSignOut();
      } catch (err) {
        console.error('Error signing out of Clerk:', err);
      }
    }
  };

  const isCustomerLoggedIn = Boolean(isSignedIn || customUser);

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
        updateProfile,
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

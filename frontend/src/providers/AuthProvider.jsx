import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [memberProfile, setMemberProfile] = useState(() => {
    const stored = localStorage.getItem('member');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (memberProfile) {
      localStorage.setItem('member', JSON.stringify(memberProfile));
    } else {
      localStorage.removeItem('member');
    }
  }, [memberProfile]);

  const value = useMemo(() => ({
    token,
    user,
    member: memberProfile,
    isAuthenticated: Boolean(token),
    login(data) {
      setToken(data.token);
      setUser(data.user);
      setMemberProfile(data.member || null);
    },
    logout() {
      setToken(null);
      setUser(null);
      setMemberProfile(null);
    }
  }), [token, user, memberProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import api, { getCsrfCookie } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (loginId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken && storedUser !== 'undefined' && storedUser !== 'null') {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && typeof parsed === 'object' && parsed.id) {
          setUser(parsed);
          setToken(storedToken);
        } else {
          // Corrupt data — clear it
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch {
        // Invalid JSON — clear localStorage to recover
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else if (storedUser === 'undefined' || storedUser === 'null') {
      // Clean up invalid entries left by previous bugs
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    setIsLoading(false);

    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  const login = async (login: string, password: string) => {
    await getCsrfCookie();
    const response = await api.post('/login', { login, password });
    const { user, access_token } = response.data;

    setUser(user);
    setToken(access_token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', access_token);
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

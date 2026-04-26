import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import api, { getCsrfCookie } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (loginId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setIsLoading(false);
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

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, isLoading }}>
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

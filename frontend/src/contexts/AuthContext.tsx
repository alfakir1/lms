import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';
import { RolePermissions } from '../utils/permissions';

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await authService.getCurrentUser();
        localStorage.setItem('user', JSON.stringify(me));
        setUser(me);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const isAuthenticated = useMemo(() => !!user, [user]);

  const hasPermission = (permission: any) => {
    if (!user) return false;
    return RolePermissions[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

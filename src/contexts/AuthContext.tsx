import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
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
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = JSON.parse(localStorage.getItem('user') || 'null');
      return decodedUser;
    }
    return null;
  });

  const login = (token: string) => {
    localStorage.setItem('token', token);
    // Decode and set user
    // Placeholder
    const decodedUser: User = { id: 1, name: 'User', email: 'user@example.com', role: 'student', created_at: '', updated_at: '' };
    setUser(decodedUser);
    localStorage.setItem('user', JSON.stringify(decodedUser));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';
import { mockUsers } from '../utils/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
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

  const login = (identifier: string, password: string): boolean => {
    const foundUser = mockUsers.find(u => 
      (u.email === identifier || u.student_id === identifier) && u.password === password
    );
    
    if (foundUser) {
      const { password: _, ...userData } = foundUser;
      localStorage.setItem('token', 'fake-token-' + userData.id);
      setUser(userData as User);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
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
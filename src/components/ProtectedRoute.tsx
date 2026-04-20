import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && user && !roles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
    if (user.role === 'instructor') return <Navigate to="/instructor/dashboard" />;
    if (user.role === 'reception') return <Navigate to="/reception/dashboard" />;
    return <Navigate to="/student/dashboard" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
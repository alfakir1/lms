import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const { pathname } = window.location;

  if (roles && user) {
    const hasRole = roles.includes(user.role) || (user.role === 'super_admin' && roles.includes('admin'));
    
    if (!hasRole) {
      // Redirect to their relevant dashboard based on actual role
      if ((user.role === 'admin' || user.role === 'super_admin') && !pathname.startsWith('/admin')) return <Navigate to="/admin/dashboard" />;
      if (user.role === 'instructor' && !pathname.startsWith('/instructor')) return <Navigate to="/instructor/dashboard" />;
      if (user.role === 'student' && !pathname.startsWith('/student')) return <Navigate to="/student/dashboard" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

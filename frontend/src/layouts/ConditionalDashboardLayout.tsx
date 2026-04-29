import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import PublicLayout from './PublicLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ConditionalDashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  
  if (isAuthenticated) {
    return <DashboardLayout />;
  }
  
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
};

export default ConditionalDashboardLayout;

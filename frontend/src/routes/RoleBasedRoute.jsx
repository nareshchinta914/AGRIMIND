import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const userRole = (user?.role || 'FARMER').toUpperCase();
  const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());
  const isUnauthorized = isAuthenticated && user && normalizedAllowed.length > 0 && !normalizedAllowed.includes(userRole);

  useEffect(() => {
    if (isUnauthorized) {
      toast.info(`Access restricted: Redirected to your ${userRole} Dashboard.`);
    }
  }, [isUnauthorized, userRole, toast]);

  if (loading) {
    return <LoadingSpinner message="Verifying account credentials..." fullScreen />;
  }

  // 1. Unauthenticated users CANNOT access any role dashboard directly — must login first
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          requireLoginMsg: '🔒 Login required: Please log in with your credentials to access this dashboard.'
        }}
        replace
      />
    );
  }

  // 2. If authenticated user tries to access a dashboard of another role, route to their own dashboard
  if (isUnauthorized) {
    if (userRole === 'MERCHANT') {
      return <Navigate to="/merchant/dashboard" replace />;
    } else if (userRole === 'CUSTOMER') {
      return <Navigate to="/customer/dashboard" replace />;
    } else {
      return <Navigate to="/farmer/dashboard" replace />;
    }
  }

  return children;
};

export default RoleBasedRoute;

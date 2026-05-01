import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  if (!isAuthenticated || role !== 'admin') return <Navigate to="/login" replace />;
  return children;
};

export const AuthLandingRedirect = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

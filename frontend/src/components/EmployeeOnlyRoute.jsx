// src/components/EmployeeOnlyRoute.jsx
// Single responsibility: Restrict employee access to only their dashboard

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function EmployeeOnlyRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // For employees, only allow access to their personal dashboard and profile-related routes
  if (user?.role === 'EMPLOYE') {
    const allowedPaths = ['/mon-dashboard', '/dashboard'];
    const isAllowedPath = allowedPaths.some(path => location.pathname === path || location.pathname.startsWith(path + '/'));

    if (!isAllowedPath) {
      // Redirect employee to their dashboard if they try to access unauthorized routes
      return <Navigate to="/mon-dashboard" replace />;
    }
  }

  return children;
}
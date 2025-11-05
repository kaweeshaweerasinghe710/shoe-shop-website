// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While Supabase checks session, show loading (prevents flicker)
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  // If not logged in -> send to /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in -> render children
  return children;
};

export default ProtectedRoute;

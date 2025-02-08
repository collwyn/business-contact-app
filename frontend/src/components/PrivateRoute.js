import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // If there's no authenticated user, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user is authenticated, render the protected component
  return children;
};

export default PrivateRoute;
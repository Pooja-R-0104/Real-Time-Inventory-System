import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // If the user is not logged in, redirect them to the /login page
    return <Navigate to="/login" />;
  }

  return children; // If the user is logged in, show the page they requested
};

export default ProtectedRoute;
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const PrivateRoute = ({ children }) => {
  const { token } = useUser();

  // Check localStorage as fallback
  const storedToken = localStorage.getItem('authToken');

  if (!token && !storedToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

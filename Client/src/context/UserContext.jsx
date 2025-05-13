// src/context/UserContext.js
import React, { createContext, useState, useContext } from 'react';

// Create context for user authentication
const UserContext = createContext();

// UserProvider component to wrap your app and provide context
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [role , setrole] = useState(localStorage.getItem('role') || null);

  const login = (userData, authToken , role) => {
    setUser(userData);
    setToken(authToken);
    setrole(role)
    localStorage.setItem('authToken', authToken); // Store token in localStorage
    localStorage.setItem('role', role); // Store token in localStorage
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setrole(null)
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout , role }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the user context
export const useUser = () => {
  return useContext(UserContext);
};

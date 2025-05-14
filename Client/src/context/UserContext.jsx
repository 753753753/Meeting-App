// src/context/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [teamMembers, setTeamMembers] = useState([]); // ✅ NEW

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Optionally auto-fetch team members if admin is logged in
    if (role === 'admin' && token) {
      fetchTeamMembers();
    }
  }, [role, token]);

  // ✅ Fetch team members from backend
  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/adminroutes/team', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!data.error) {
        setTeamMembers(data); // set fetched members
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  };

  const login = (userData, authToken, userRole) => {
    setUser(userData);
    setToken(authToken);
    setRole(userRole);

    localStorage.setItem('authToken', authToken);
    localStorage.setItem('role', userRole);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    setTeamMembers([]); // ✅ Clear on logout

    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        role,
        login,
        logout,
        teamMembers,
        setTeamMembers,
        fetchTeamMembers, // ✅ Optional helper
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

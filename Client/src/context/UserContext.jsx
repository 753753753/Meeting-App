// src/context/UserContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { fetchTeamMembers as fetchTeamMembersAPI } from '../utils/api'; // ✅ import from api

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [teamMembers, setTeamMembers] = useState([]);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Auto-fetch team members if admin and token are present
  useEffect(() => {
    if (role === 'admin' && token) {
      loadTeamMembers();
    }
  }, [role, token]);

  // ✅ Use centralized API call
  const loadTeamMembers = async () => {
    try {
      const members = await fetchTeamMembersAPI();
      setTeamMembers(members);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      setTeamMembers([]); // clear on error
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
    setTeamMembers([]);

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
        fetchTeamMembers: loadTeamMembers, // ✅ expose centralized fetch
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

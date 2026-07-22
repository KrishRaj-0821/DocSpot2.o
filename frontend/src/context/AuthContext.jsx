import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('purnia_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on mount
    const savedUser = localStorage.getItem('purnia_user');
    if (savedUser && savedUser !== 'undefined' && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user from localStorage", e);
        localStorage.removeItem('purnia_user');
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { token: jwtToken, user: userData } = response.data;
      
      localStorage.setItem('purnia_token', jwtToken);
      localStorage.setItem('purnia_user', JSON.stringify(userData));
      
      setToken(jwtToken);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const msg = error?.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    // Mock registration: defaults to a patient role
    await new Promise((resolve) => setTimeout(resolve, 800));
    const fullUser = {
      ...userData,
      id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      role: userData.role || 'patient',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    };
    
    localStorage.setItem('purnia_token', 'mock-register-token');
    localStorage.setItem('purnia_user', JSON.stringify(fullUser));
    setToken('mock-register-token');
    setUser(fullUser);
    return { success: true, user: fullUser };
  };

  const logout = () => {
    localStorage.removeItem('purnia_token');
    localStorage.removeItem('purnia_user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updatedFields) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const updatedUser = { ...user, ...updatedFields };
    localStorage.setItem('purnia_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return { success: true, user: updatedUser };
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

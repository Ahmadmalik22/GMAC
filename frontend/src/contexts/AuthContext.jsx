import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Create the Auth Context
const AuthContext = createContext();

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'https://gmac-two.vercel.app/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Add token to requests if available
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Auth Context Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token and get user data
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      const res = await axios.get('/auth/me');
      setUser(res.data.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });

      const { user, token } = res.data.data;

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Set user state
      setUser(user);
      setIsAuthenticated(true);

      toast.success(`Welcome back, ${user.firstName}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Register function (for admin registering teachers)
  const register = async (userData) => {
    try {
      const res = await axios.post('/auth/register', userData);

      toast.success('User registered successfully!');
      return { success: true, data: res.data.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      // Even if logout API fails, clear local data
    }

    // Clear local storage
    localStorage.removeItem('token');

    // Clear axios headers
    delete axios.defaults.headers.common['Authorization'];

    // Clear user state
    setUser(null);
    setIsAuthenticated(false);

    toast.success('Logged out successfully');
  };

  // Update user details
  const updateDetails = async (userData) => {
    try {
      const res = await axios.put('/auth/updatedetails', userData);

      setUser(res.data.data.user);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      const res = await axios.put('/auth/updatepassword', passwordData);

      toast.success('Password updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Password update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Deactivate account
  const deactivateAccount = async () => {
    try {
      await axios.delete('/auth/deactivate');
      await logout();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Account deactivation failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Context value
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateDetails,
    updatePassword,
    deactivateAccount,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
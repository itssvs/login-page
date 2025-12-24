
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  login as apiLogin,
  signup as apiSignup,
  setToken,
  getToken,
  removeToken,
  isAuthenticated as checkAuth,
  authFetch,
  verifyToken
} from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (checkAuth()) {
        // Verify token and get user data
        const data = await verifyToken();
        if (data && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear it
          removeToken();
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      removeToken();
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      
      if (data && data.token) {
        setToken(data.token);
        setUser(data.user || { email });
        setIsAuthenticated(true);
        return { success: true, data };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {// if api call fails 
      return { success: false, message: error.message || 'Cannot connect to server' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const data = await apiSignup(name, email, password);
      
      if (data && data.token) {
        setToken(data.token);
        setUser(data.user || { name, email });
        setIsAuthenticated(true);
        return { success: true, data };
      } else {
        return { success: false, message: data.message || 'Signup failed' };
      }
    } catch (error) {
      return { success: false, message: error.message || 'Cannot connect to server' };
    }
  };

  const logout = () => {
    removeToken();
    setUser(null); // clear user data from state
    setIsAuthenticated(false);
  };

  const updateUser = async () => {
    try {
      const data = await authFetch('/dashboard');
      if (data && data.user) {
        setUser(data.user); //  update user data in state
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const value = {  // this is what components will access when useAuth() is called
    user,
    login,
    signup,
    logout,
    isAuthenticated,
    loading,
    updateUser,
    authFetch, // Expose authFetch for authenticated API calls
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
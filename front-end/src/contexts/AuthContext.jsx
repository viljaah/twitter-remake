import React, { createContext, useState, useEffect, useContext } from 'react';
import { validateToken, getCurrentUserFromStorage } from '../service/authService';

// Create context
const AuthContext = createContext(null);

/**
 * AuthProvider component for managing authentication state
 */
export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load auth state on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have token and user data in localStorage
        const storedUser = getCurrentUserFromStorage();
        
        if (storedUser) {
          // Validate token with backend
          const isValid = await validateToken();
          
          if (isValid) {
            // If valid, set the auth user
            setAuthUser(storedUser);
          } else {
            // If invalid, clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = (userData, token) => {
    // Store auth data in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setAuthUser(userData);
  };

  // Logout function
  const logout = () => {
    // Clear auth data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthUser(null);
  };

  // Context value
  const value = {
    authUser,
    setAuthUser,
    loading,
    login,
    logout,
    isAuthenticated: !!authUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for using auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
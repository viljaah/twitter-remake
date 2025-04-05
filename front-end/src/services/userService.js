/**
 * User Service - Functions for interacting with user-related API endpoints
 */

const API_URL = 'http://localhost:8000/api';

/**
 * Get the current authenticated user's profile
 * @returns {Promise<Object>} User data
 */
export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch user profile');
  }
  
  return await response.json();
};



/**
 * Delete a user account
 * @param {number} userId - The ID of the user to delete
 * @returns {Promise<Object>} Success message
 */
export const deleteUser = async (userId) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to delete user account');
  }
  
  return await response.json();
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Newly created user
 */
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Registration failed');
  }
  
  return await response.json();
};

/**
 * Search for a user by username
 * @param {string} username - Username to search for
 * @returns {Promise<Object>} User data
 */
export const searchUserByUsername = async (username) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(username)}`, {
    method: 'GET',
    headers: token ? {
      'Authorization': `Bearer ${token}`
    } : {}
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'User not found');
  }
  
  return await response.json();
};
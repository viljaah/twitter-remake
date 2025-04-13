/**
 * Service for managing authentication
 * All API calls related to authentication are centralized here
 */

const API_URL = 'https://twitter-remake-backend.onrender.com';

// Login user
export const loginUser = async (username, password) => {
  try {
    // Create FormData for OAuth2 compatibility
    const formBody = new URLSearchParams();
    formBody.append('username', username);
    formBody.append('password', password);

    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      credentials: 'include',  // Important for cross-origin requests
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Login failed');
    }

    const data = await response.json();
    
    // Store authentication token and user data
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      username: data.username,
      display_name: data.display_name,
      email: data.email,
      bio: data.bio
    }));

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      // Handle validation errors from Pydantic
      if (errorData && errorData.detail) {
        if (Array.isArray(errorData.detail)) {
          // This is a Pydantic validation error array
          const validationErrors = errorData.detail
            .map((err) => {
              return `${err.loc.slice(1).join('.')}: ${err.msg}`;
            })
            .join('; ');
          throw new Error(validationErrors);
        } else {
          // This is a simple error message
          throw new Error(errorData.detail);
        }
      }

      throw new Error('Failed to create account. Please try again.');
    }

    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('token');
    
    // Only make the logout API call if we have a token
    if (token) {
      try {
        // Notify the backend about logout to invalidate the token
        await fetch(`${API_URL}/api/users/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (apiError) {
        console.error('API logout failed, continuing with client logout', apiError);
      }
    }
  
    // Always clean up client-side storage to complete the logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return { success: true };
  } catch (error) {
    console.error('Logout failed', error);
    
    // Still clear local storage even if the API call fails
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    throw error;
  }
};

// Check if user is logged in
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Get current user from local storage
export const getCurrentUserFromStorage = () => {
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

// Validate token by making a check request
export const validateToken = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const response = await fetch(`${API_URL}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};
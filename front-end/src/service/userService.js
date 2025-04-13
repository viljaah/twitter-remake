const API_URL = 'https://twitter-remake-backend.onrender.com/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No authentication token found');
    throw new Error('Authentication required');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Get current user from token
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found in getCurrentUser');
      return null;
    }

    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch current user: ${response.status}`);
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }
      throw new Error('Failed to fetch current user');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

// Get the user by username
export const getUserByUsername = async (username) => {
  try {
    const response = await fetch(`${API_URL}/users/search?q=${username}`);
    if (!response.ok) throw new Error("Failed to fetch user data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// Get user tweets
export const getUserTweets = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/tweets`);
    if (!response.ok) throw new Error("Failed to fetch user tweets");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user tweets:", error);
    throw error;
  }
};

// Get followers count
export const getFollowersCount = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/followers/count`);
    if (!response.ok) {
      console.warn(`Failed to fetch followers count: ${response.status}`);
      return { count: 0 };
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching followers count:', error);
    return { count: 0 };
  }
};

// Get following count
export const getFollowingCount = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/following/count`);
    if (!response.ok) {
      console.warn(`Failed to fetch following count: ${response.status}`);
      return { count: 0 };
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching following count:', error);
    return { count: 0 };
  }
};

// Get users being followed by current user
export const getFollowing = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found in getFollowing');
      return { following: [] };
    }

    const response = await fetch(`${API_URL}/users/following`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch following list: ${response.status}`);
      return { following: [] };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching following users:', error);
    return { following: [] };
  }
};

// Get users following the current user
export const getFollowers = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found in getFollowers');
      return { followers: [] };
    }

    const response = await fetch(`${API_URL}/users/followers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch followers list: ${response.status}`);
      return { followers: [] };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching followers:', error);
    return { followers: [] };
  }
};

// Follow a user
export const followUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found in followUser');
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/users/follow/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to follow user');
    return await response.json();
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};

// Unfollow a user
export const unfollowUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found in unfollowUser');
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/users/follow/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to unfollow user');
    return await response.json();
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
};
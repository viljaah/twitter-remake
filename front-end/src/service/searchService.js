/**
 * Service for searching
 * All API calls related to search functionality are centralized here
 */

const API_URL = 'https://twitter-remake-backend.onrender.com/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  return {
    'Content-Type': 'application/json'
  };
};

/**
 * Search for tweets
 * @param {string} query - Search query
 * @returns {Promise<Array>} - List of tweets matching the query
 */
export const searchTweets = async (query) => {
  try {
    const response = await fetch(`${API_URL}/tweets/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching tweets:', error);
    return [];
  }
};

/**
 * Search for hashtags
 * @param {string} query - Search query
 * @returns {Promise<Array>} - List of hashtags matching the query
 */
export const searchHashtags = async (query) => {
  try {
    const response = await fetch(`${API_URL}/tweets/hashtag/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching hashtags:', error);
    return [];
  }
};

/**
 * Search for users
 * @param {string} query - Search query
 * @returns {Promise<Object|null>} - User object if found, null otherwise
 */
export const searchUsers = async (query) => {
  try {
    const response = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    // If we have a user and we're logged in, check if we're following them
    if (data.user && localStorage.getItem('token')) {
      try {
        const followingData = await fetch(
          `${API_URL}/users/following`,
          {
            headers: getAuthHeaders()
          }
        );
        
        if (followingData.ok) {
          const followingList = await followingData.json();
          data.user.is_following = followingList.following?.some(u => u.id === data.user.id) || false;
        }
      } catch (followError) {
        console.error('Error checking follow status:', followError);
        data.user.is_following = false;
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error searching users:', error);
    return null;
  }
};

/**
 * Search functionality that supports all types
 * @param {string} query - Search query
 * @param {string} filter - Filter type: 'tweets', 'users', or 'hashtags'
 * @returns {Promise<Object>} - Search results
 */
export const search = async (query, filter) => {
  switch(filter) {
    case 'tweets':
      return { tweets: await searchTweets(query) };
    case 'hashtags':
      return { hashtags: await searchHashtags(query) };
    case 'users':
      return await searchUsers(query);
    default:
      throw new Error(`Invalid search filter: ${filter}`);
  }
};
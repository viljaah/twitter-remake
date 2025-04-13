/**
 * Service for managing tweets
 * All API calls related to tweets are centralized here
 */

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

// Get all tweets
export const getAllTweets = async () => {
  try {
    const response = await fetch(`${API_URL}/tweets`);
    if (!response.ok) {
      throw new Error('Failed to fetch tweets');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tweets:', error);
    throw error;
  }
};

// Get tweets by user ID
export const getUserTweets = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/tweets`);
    if (!response.ok) {
      throw new Error('Failed to fetch user tweets');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user tweets:', error);
    throw error;
  }
};

// Create a new tweet
export const createTweet = async (content) => {
  try {
    const response = await fetch(`${API_URL}/tweets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create tweet');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating tweet:', error);
    throw error;
  }
};

// Update a tweet
export const updateTweet = async (tweetId, content) => {
  try {
    const response = await fetch(`${API_URL}/tweets/${tweetId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update tweet');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating tweet:', error);
    throw error;
  }
};

// Delete a tweet
export const deleteTweet = async (tweetId) => {
  try {
    const response = await fetch(`${API_URL}/tweets/${tweetId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete tweet');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting tweet:', error);
    throw error;
  }
};

// Search tweets
export const searchTweets = async (query) => {
  try {
    const response = await fetch(`${API_URL}/tweets/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search tweets');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching tweets:', error);
    throw error;
  }
};

// Search hashtags
export const searchHashtags = async (query) => {
  try {
    const response = await fetch(`${API_URL}/tweets/hashtag/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search hashtags');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching hashtags:', error);
    throw error;
  }
};
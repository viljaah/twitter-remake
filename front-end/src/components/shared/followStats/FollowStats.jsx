import { useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from "../../ui/Button.jsx"
import { getFollowersCount, getFollowingCount, getFollowing, followUser, unfollowUser } from '../../../service/userService.js';

// This component displays follower/following counts and a follow/unfollow button
// It receives three props:
// - userId: the ID of the user whose stats we're displaying
// - styles: CSS styles object from the parent component
// - onFollowStatusChange: callback function to notify parent when follow status changes

const FollowStats = ({ userId, styles, onFollowStatusChange}) => {
    // State variables to track component data
    const [followingCount, setFollowingCount] = useState(0); // How many users this profile follows
    const [followersCount, setFollowersCount] = useState(0); // How many followers this profile has
    const [isFollowing, setIsFollowing] = useState(false);   // Whether current user follows this profile
    const [isLoading, setIsLoading] = useState(true);        // Loading state for initial data fetch
    const [error, setError] = useState(null);                // Error state if API calls fail

// First useEffect: Fetch the follower and following counts when component mounts
// or when userId changes
    useEffect(() => {
        // Don't do anything if we don't have a userId
        if (!userId) return;

        const fetchFollowCounts = async () => {
            setIsLoading(true); // Show loading state
            try {
                // usign here the serivce functions where i fetch API calls to backend
                // Make two API calls in parallel using Promise.all for efficiency
                // These functions come from userService.js
                const [followersData, followingData] = await Promise.all([
                    getFollowersCount(userId), // Get number of followers
                    getFollowingCount(userId) // Get number of accounts being followed
                ]);
                 // Update state with the counts from the API
                setFollowersCount(followersData.count);
                setFollowingCount(followingData.count);
                setIsLoading(false); // Hide loading state
            } catch (error) {
                console.error("Error fetching follow counts:", error);
                setError("Couldn't load follow statistics");
                setIsLoading(false);
            }
        };

        fetchFollowCounts(); // calling the fucntion
    }, [userId]); // This effect runs when userId changes

    
    // Second useEffect: Check if the current logged-in user is following this profile
    useEffect(() => {
        if (!userId) return;

        const checkFollowStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log("No token available, skipping follow status check");
                    return;
                }
                // Get list of users that the current user is following
                const data = await getFollowing();
                const followingList = data.following || [];

                // Check if this profile's userId exists in the list of followed users
                const isFollowingUser = followingList.some(user => user.id === userId);
                setIsFollowing(isFollowingUser);

                // then notify parent component (i htink the profile.jsx) of follow status
                if (onFollowStatusChange) {
                    onFollowStatusChange(isFollowingUser);
                }
            } catch (error) {
                console.error('Error checking follow status:', error);
            }
        };
        checkFollowStatus();
    }, [userId, onFollowStatusChange]); // This effect runs when userId or onFollowStatusChange changes

    // Function to handle when user clicks the follow/unfollow button
    const handleFollowToggle = async () => {
        // Get the current user from localStorage
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return; // Exit if no user is logged in

        const currentUser = JSON.parse(storedUser);
        // dont allow following yourself 
        if (currentUser.id === userId) return;

        try {
            if (isFollowing) {
                // If already following, unfollow the user
                await unfollowUser(userId);
            } else {
                await followUser(userId);
            }

            // toggle the follwoing state action
            setIsFollowing(!isFollowing);
            //update the followers count
            setFollowersCount(prevCount => isFollowing ? prevCount -1 : prevCount +1);
            // Notify parent component of follow status change
            if (onFollowStatusChange) {
                onFollowStatusChange(!isFollowing);
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
        }
    };
    
     // Show loading indicator while data is being fetched
    if (isLoading) return <div>Loading stats...</div>;
    if (error) return <div>{error}</div>;
  
  // Get current user from localStorage to check if this is the user's own profile
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
   // Check if this profile belongs to the current user
  const isOwnProfile = currentUser && currentUser.id === userId;
  
  return (
    <div className={styles.followStatsContainer}>
      {/* Stats display */}
      <div className={styles.statsContainer}>
        {/* Following count */}
        <button className={styles.followBtn}>
          <strong>{followingCount}</strong> Following
        </button>
         {/* Followers count */}
        <button className={styles.followBtn}>
          <strong>{followersCount}</strong> Followers
        </button>
      </div>
      
      {/* Follow/Unfollow button - only shown if not viewing own profile */}
        {!isOwnProfile && (
        <Button 
            variant={isFollowing ? "danger" : "primary"}
            size="sm"
            onClick={handleFollowToggle}
            className={styles.followButtonPosition}
        >
            {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
        )}
    </div>
  );
};

// PropTypes for type checking the component props
FollowStats.propTypes = {
    userId: PropTypes.number.isRequired,  // User ID must be a number and is required
    styles: PropTypes.object.isRequired,  // Styles must be an object and is required
    onFollowStatusChange: PropTypes.func   // Optional callback function
};

export default FollowStats;

/*

What this component does:

Displays follower and following counts for a user profile
Shows a follow/unfollow button if viewing someone else's profile
Updates counts in real-time when follow/unfollow actions happen

Key functionality:

First useEffect: Fetches the follower and following counts from the API
Second useEffect: Checks if the current user is following this profile
handleFollowToggle: Handles follow/unfollow button clicks
Conditional rendering: Shows different UI based on whether it's your own profile

How it connects to other components:

It's designed to be imported by your ProfilePage.jsx
It uses API functions from your userService.js
It notifies the parent component of follow status changes via onFollowStatusChange*/
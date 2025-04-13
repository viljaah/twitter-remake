import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from "./FollowersList.module.css";
import Button from '../../ui/Button.jsx';
import { getFollowing, followUser, unfollowUser } from '../../../service/userService.js';

const FollowersList = ({ type }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        // Determine which endpoint to call based on the type prop
        const endpoint = type === 'followers' 
          ? 'https://twitter-remake-backend.onrender.com/api/users/followers'
          : 'https://twitter-remake-backend.onrender.com/api/users/following';

        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ${type}`);
        }

        const data = await response.json();
        setUsers(data[type] || []);

        // If we're showing followers, we need to know which ones we're already following
        if (type === 'followers') {
          const followingData = await getFollowing();
          const followingIds = followingData.following.map(user => user.id);
          setFollowing(followingIds);
        } else {
          // If showing following, mark all as followed already
          setFollowing(data.following.map(user => user.id));
        }

      } catch (err) {
        console.error(`Error fetching ${type}:`, err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [type]);

  const handleToggleFollow = async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      return;
    }

    try {
      if (following.includes(userId)) {
        await unfollowUser(userId);
        setFollowing(prev => prev.filter(id => id !== userId));
        
        // If we're on the following page, remove the user from the list
        if (type === 'following') {
          setUsers(prev => prev.filter(user => user.id !== userId));
        }
      } else {
        await followUser(userId);
        setFollowing(prev => [...prev, userId]);
      }
    } catch (err) {
      console.error('Error toggling follow status:', err);
      setError('Failed to update follow status');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading {type}...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.followersList}>
      <h2 className={styles.heading}>
        {type === 'followers' ? 'People who follow you' : 'People you follow'}
      </h2>
      
      {users.length === 0 ? (
        <div className={styles.emptyState}>
          {type === 'followers' 
            ? "You don't have any followers yet." 
            : "You're not following anyone yet."}
        </div>
      ) : (
        <ul className={styles.userList}>
          {users.map((user) => (
            <li key={user.id} className={styles.userItem}>
              <Link to={`/profile/${user.username}`} className={styles.userLink}>
                <img
                  src="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
                  alt={`${user.username}'s avatar`}
                  className={styles.avatar}
                />
                <div className={styles.userInfo}>
                  <span className={styles.username}>{user.username}</span>
                  {user.display_name && (
                    <span className={styles.displayName}>{user.display_name}</span>
                  )}
                  {user.bio && (
                    <span className={styles.bio}>{user.bio}</span>
                  )}
                </div>
              </Link>
              
              {type === 'followers' && (
                <Button
                  variant={following.includes(user.id) ? "danger" : "primary"}
                  size="sm"
                  onClick={() => handleToggleFollow(user.id)}
                  className={styles.followBtnPosition}
                >
                  {following.includes(user.id) ? 'Unfollow' : 'Follow'}
               </Button>
              )}
              
              {type === 'following' && (
                <Button
                  variant={following.includes(user.id) ? "danger" : "primary"}
                  size="sm"
                  onClick={() => handleToggleFollow(user.id)}
                  className={styles.followBtnPosition}
                >
                  {following.includes(user.id) ? 'Unfollow' : 'Follow'}
              </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowersList;
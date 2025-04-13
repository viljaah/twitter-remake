import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from "../../ui/Button.jsx";
import styles from './ListUsers.module.css';
import { getFollowing, followUser, unfollowUser } from '../../../service/userService.js';

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]); // array of followed user IDs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://twitter-remake-backend.onrender.com/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
    
        // Parse the current user's data from localStorage
        const storedUser = localStorage.getItem("user");
        const currentUser = storedUser ? JSON.parse(storedUser) : null;
    
        if (currentUser && currentUser.id) {
          // Filter out the current user from the list
          const filteredUsers = data.users.filter(
            (user) => user.id !== currentUser.id
          );
          setUsers(filteredUsers);
        } else {
          setUsers(data.users);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Something went wrong');
      }
    };

    fetchUsers();
  }, []);

  // Fetch the list of users the current user is following in a separate useEffect
  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        // Check if there's a token before attempting to fetch following
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No auth token, skipping following fetch');
          setLoading(false);
          return;
        }

        const data = await getFollowing(); // this is coming form the userService
        // Extract the followed user IDs
        const followingIds = data.following.map(u => u.id);
        setFollowing(followingIds);
      } catch (err) {
        console.error('Error fetching following:', err);
        // Don't set error - just log it, we'll show users anyway
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);

  // Handle follow/unfollow button click
  const handleToggleFollow = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No auth token found");
      setError("Please log in to follow users");
      return;
    }
    
    try {
      if (following.includes(userId)) {
        // Already following; attempt to unfollow
        await unfollowUser(userId); // fucntion extracted from userService
        // On success, remove this user's ID from following state
        setFollowing(prev => prev.filter(id => id !== userId));
      } else {
        // Not following; attempt to follow
        await followUser(userId); // funciton extracted from userService
        // On success, add this user's ID to following state
        setFollowing(prev => [...prev, userId]);
      }
    } catch (err) {
      console.error('Error toggling follow status:', err);
      setError("Failed to update follow status");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading users...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.listUsers}>
      <h2 className={styles.heading}>Who to follow</h2>
      <ul className={styles.userList}>
        {users.map((user) => (
          <li key={user.id} className={styles.userItem}>
            <Link to={`/profile/${user.username}`} className={styles.userLink}>
              <img
                src="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
                alt="User Avatar"
                className={styles.avatar}
              />
              <div className={styles.userInfo}>
                <span className={styles.username}>{user.username}</span>
                {user.display_name && (
                  <span className={styles.displayName}>{user.display_name}</span>
                )}
              </div>
            </Link>
              <Button
                variant={following.includes(user.id) ? "unfollow" : "follow"}
                size="sm"
                onClick={() => handleToggleFollow(user.id)}
                className={styles.followBtnPosition}
              >
                {following.includes(user.id) ? 'Unfollow' : 'Follow'}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListUsers;

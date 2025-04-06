import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ListUsers.module.css';
import { getFollowing, followUser, unfollowUser} from '../../service/userService.js';

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]); // array of followed user IDs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users');
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
        setError(err.message || 'Something went wrong');
      }
    };

    // Fetch the list of users the current user is following
    /*const fetchFollowing = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users/following'); //issue here
        if (!response.ok) {
          throw new Error('Failed to fetch following list');
        }
        const data = await response.json();
        // Extract the followed user IDs
        const followingIds = data.following.map(u => u.id);
        setFollowing(followingIds);
      } catch (err) {
        console.error(err); // getting error message that failed ot fetch follwoing list
      }
    };*/
    /* putted this new */
    // Use the getFollowing function from userService
    const fetchFollowing = async () => {
      try {
        const data = await getFollowing();
        // Extract the followed user IDs
        const followingIds = data.following.map(u => u.id);
        setFollowing(followingIds);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchAll = async () => {
      await Promise.all([fetchUsers(), fetchFollowing()]); // issue here
      setLoading(false);
    };

    fetchAll(); // issue here
  }, []);

  // Handle follow/unfollow button click
  const handleToggleFollow = async (userId) => {
    const token = localStorage.getItem("token"); // Make sure this exists and is valid
    if (!token) {
      console.error("No auth token found");
      return;
    }
    
    if (following.includes(userId)) {
      // Already following; attempt to unfollow
      try {
        const response = await fetch(`http://localhost:8000/api/users/follow/${userId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to unfollow user");
        }
        // On success, remove this user's ID from following state
        setFollowing(prev => prev.filter(id => id !== userId));
      } catch (err) {
        console.error(err);
      }
    } else {
      // Not following; attempt to follow
      try {
        const response = await fetch(`http://localhost:8000/api/users/follow/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to follow user");
        }
        // On success, add this user's ID to following state
        setFollowing(prev => [...prev, userId]);
      } catch (err) {
        console.error(err);
      }
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
            {/* Wrap avatar and info in a Link to the user's profile */}
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
            <button
              className={styles.followBtn}
              onClick={() => handleToggleFollow(user.id)}
            >
              {following.includes(user.id) ? 'Unfollow' : 'Follow'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListUsers;

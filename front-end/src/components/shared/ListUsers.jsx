import React, { useState, useEffect } from 'react';
import styles from './ListUsers.module.css';

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data.users);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
            <button className={styles.followBtn}>Follow</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListUsers;

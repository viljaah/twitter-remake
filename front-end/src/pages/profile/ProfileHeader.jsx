import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import styles from './ProfilePage.module.css';

/**
 * Profile page header component
 * 
 * @param {Object} props
 * @param {Object} props.userData - User profile data
 * @param {number} props.tweetsCount - Number of tweets
 * @param {string} props.activeTab - Currently active tab
 */
const ProfileHeader = ({ userData, tweetsCount, activeTab }) => {
  if (!userData) {
    return null;
  }
  
  return (
    <div className={styles.header}>
      <Link to="/" className={styles.backButton}>
        <FaArrowLeft />
      </Link>
      <div className={styles.headerInfo}>
        <h2 className={styles.headerName}>
          {userData?.display_name || userData?.username}
        </h2>
        {activeTab === "posts" && (
          <span className={styles.postCount}>{tweetsCount} posts</span>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
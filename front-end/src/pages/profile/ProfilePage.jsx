import { useState } from "react"; // react hooks for handling side effects and state
import { Link } from "react-router-dom"; // react router hooks to access URL parameters (like username)
import { FaArrowLeft } from "react-icons/fa6"; // back button
import { IoCalendarOutline } from "react-icons/io5"; //for join data
import styles from './ProfilePage.module.css';
import {useParams} from 'react-router-dom';

const ProfilePage = () => {
    const { username } = useParams();
    console.log("Username parameter:", username);
  // just some placeholder data for now
  // my profile page and state logic will otherways go here
  const profileData = {
    name: "mode tr",
    username: "modetr15430",
    joinDate: "march 2025",
    following: 0,
    followers: 0,
    posts: 0
  }

  return (
    <div className={styles.mainContent}>
      {/*1. header section (top nav with back arrow and "Mode Tr" / "0 posts")*/}
      <div className={styles.header}>
        <Link to="/" className={styles.backButton}>
          <FaArrowLeft />
        </Link>
        <div className={styles.headerInfo}>
          <h2 className={styles.headerName}>{profileData.name}</h2>
          <span className={styles.postCount}>{profileData.posts} posts</span>
        </div>
      </div>
      
      {/* Profile content container */}
      <div className={styles.profileContent}>
        {/* 2. Cover Photo Section (large light gray area)*/}
        <div className={styles.coverPhoto}>
          {/*this is where user's cover image will go*/}
        </div>
        
        {/* 3. Profile information section*/}
        <div className={styles.profileInfo}>
          {/* Profile picture - positioned to overlap the cover photo */}
          <div className={styles.profilePictureContainer}>
            <img
              src="/path/to/profile-picture.jpg"
              alt="Profile"
              className={styles.profilePicture}
            />
          </div>
          
          {/* Edit profile button */}
          <div className={styles.editProfileContainer}>
            <button className={styles.editProfileButton}>
              Edit profile
            </button>
          </div>
          
          {/*profile details*/}
          <div className={styles.profileDetails}>
            <h1 className={styles.displayName}>{profileData.name}</h1>
            <p className={styles.username}>@{profileData.username}</p>
            
            {/* Join date */}
            <div className={styles.joinDateContainer}>
              <IoCalendarOutline className={styles.calendarIcon} />
              <span>Joined {profileData.joinDate}</span>
            </div>
            
            {/* Following/Followers */}
            <div className={styles.statsContainer}>
              <span className={styles.statItem}>
                <strong>{profileData.following}</strong> Following
              </span>
              <span className={styles.statItem}>
                <strong>{profileData.followers}</strong> Followers
              </span>
            </div>
          </div>
        </div>
        
        {/* 4. Navigation Tabs */}
        <div className={styles.navTabs}>
          <div className={`${styles.tab} ${styles.activeTab}`}>Posts</div>
        </div>
      </div>
    </div>
   );
  }

  export default ProfilePage;
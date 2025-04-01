import { useState, useEffect } from "react"; // react hooks for handling side effects and state
import { useParams, Link } from "react-router-dom"; // react router hooks to access URL parameters (like username)
import { FaArrowLeft } from "react-icons/fa6"; // back button
import { IoCalendarOutline } from "react-icons/io5"; //for join data
import styles from './ProfilePage.module.css';


const ProfilePage = () => {
  // get the username from the URL parameter
  const { username } = useParams();
  // state to store user data
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // effect to fetch user data when component mounts or username changes
  // ask about hsi arrow function, why this arrow function?
  useEffect(() => {
    //define the fetch function
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // make API request to your backend
        const response = await fetch(`http://loclahost:8000/api/users/search?q=${username}`);

        // check if request was successful
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        //parse JSON response
        const data = await response.json();
        setUserData(data.user);
        setLoading(false);
      } catch (error) {
        console.log('error fetching user data:', err);
        setError('Could not load user profile');
        setLoading(false);
      }
    };

    // call the fetch function
    fetchUserData();
  }, [username]); // this dependecy array means this effect runs when username changes

    // show loading state
    if (loading) {
      return <div className={styles.loadingState}>Loading user profile...</div>
    }

    // show error state
    if (error) {
      return <div className={styles.errorState}>{error}</div>;
    }
  
  // show user profile when data is laoded -> the jsx 
  return (
    <div className={styles.mainContent}>
      {/*1. header section (top nav with back arrow and "Mode Tr" / "0 posts")*/}
      <div className={styles.header}>
        <Link to="/" className={styles.backButton}>
          <FaArrowLeft />
        </Link>
        <div className={styles.headerInfo}>
          <h2 className={styles.headerName}>{userData?.display_name || userData?.username}</h2>
          <span className={styles.postCount}> 0 posts</span>
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
            <h1 className={styles.displayName}>{userData?.display_name || userData?.username}</h1>
            <p className={styles.username}>@{userData?.username}</p>
            
            {userData?.bio && (
              <p className={styles.bio}>{userData.bio}</p>
            )}
            
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
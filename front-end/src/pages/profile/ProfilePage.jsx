import { useState, useEffect } from "react"; // react hooks for handling side effects and state
import { useParams, Link } from "react-router-dom"; // react router hooks to access URL parameters (like username)
import { FaArrowLeft } from "react-icons/fa6"; // back button
import { IoCalendarOutline } from "react-icons/io5"; //for join data
import styles from "./ProfilePage.module.css";
import TweetItem from "./TweetItem";

const ProfilePage = () => {
  // get the username from the URL parameter
  const { username } = useParams();
  // state to store user data
  const [userData, setUserData] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [userTweets, setUserTweets] = useState([]); // store the user's tweets # added later to get the users tweets
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);


  // Fetch current user's data
useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
      console.log("Fetching current user data...");
      
      // Get the token from localStorage (or wherever you store it)
      const token = localStorage.getItem('token'); // Adjust this based on your storage method
      
      if (!token) {
        console.log("No authentication token found");
        return;
      }
      
      const response = await fetch('http://localhost:8000/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Current user data received:", data);
        setCurrentUserData(data);
      } else {
        console.log("Failed to fetch current user, status:", response.status);
      }
    } catch (error) {
      console.log('Error fetching current user:', error);
    }
  };
  
  fetchCurrentUser();
}, []);

  // effect to fetch user data when component mounts or username changes
  // ask about hsi arrow function, why this arrow function?
  useEffect(() => {
    // Log the actual username from the URL to debug
    console.log("Current username parameter:", username);

    //define the fetch function
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // make API request to your backend
        const response = await fetch(
          `http://localhost:8000/api/users/search?q=${username}`
        );

        // check if request was successful
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        //parse JSON response
        const data = await response.json();
        setUserData(data.user);
        setLoading(false);
      } catch (error) {
        console.log("error fetching user data:", error);
        setError("Could not load user profile");
        setLoading(false);
      }
    };

    // call the fetch function
    fetchUserData();
  }, [username]); // this dependecy array means this effect runs when username changes

  // once we have userData, fetch the user’s tweets by their ID # added later to get the users tweets
  useEffect(() => {
    if (userData?.id) {
      const fetchUserTweets = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/users/${userData.id}/tweets`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch user tweets");
          }
          const data = await response.json();
          // data should be in the shape: { tweets: [...] }
          setUserTweets(data.tweets);
        } catch (err) {
          console.log("Error fetching user tweets:", err);
        }
      };
      fetchUserTweets();
    }
  }, [userData]);

  // Check if current user is following this profile
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (userData?.id && currentUserData?.id) {
        try {
          const response = await fetch('/api/users/following');
          if (response.ok) {
            const followingUsers = await response.json();
            const isCurrentlyFollowing = followingUsers.some(
              (followedUser) => followedUser.id === userData.id
            );
            setIsFollowing(isCurrentlyFollowing);
          }
        } catch (error) {
          console.error('Error checking follow status:', error);
        }
      }
    };

    checkFollowStatus();
  }, [userData, currentUserData]);

 // Handle follow/unfollow action
 const handleFollowToggle = async () => {
  if (!currentUserData) {
    // Redirect to login or show login modal
    return;
  }

  try {
    const endpoint = isFollowing 
      ? `/api/users/follow/${userData.id}` 
      : `/api/users/follow/${userData.id}`;
    
    const method = isFollowing ? 'DELETE' : 'POST';
    
    const response = await fetch(endpoint, { method });
    
    if (response.ok) {
      setIsFollowing(!isFollowing);
      // Update followers count
      setFollowersCount(prevCount => 
        isFollowing ? prevCount - 1 : prevCount + 1
      );
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
  }
};

  // show loading state
  if (loading) {
    return <div className={styles.loadingState}>Loading user profile...</div>;
  }

  // show error state
  if (error) {
    return <div className={styles.errorState}>{error}</div>;
  }
  
   // Determine if this is the current user's own profile
   const isOwnProfile = currentUserData?.username === username;


  // show user profile when data is laoded -> the jsx
  return (
    <div className={styles.mainContent}>
      {/*1. header section (top nav with back arrow and "Mode Tr" / "0 posts")*/}
      <div className={styles.header}>
        <Link to="/" className={styles.backButton}>
          <FaArrowLeft />
        </Link>
        <div className={styles.headerInfo}>
          <h2 className={styles.headerName}>
            {userData?.display_name || userData?.username}
          </h2>
          <span className={styles.postCount}> {userTweets.length}</span>
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
              src="https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg"
              className={styles.profilePicture}
            />
          </div>

          {/* Edit profile button */}
          <div className={styles.editProfileContainer}>
            {isOwnProfile ? (
              <button className={styles.editProfileButton}>Edit profile</button>
            ) : (
              <button 
                className={`${styles.editProfileButton} ${isFollowing ? styles.unfollowButton : ''}`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>

          {/*profile details*/}
          <div className={styles.profileDetails}>
            <h1 className={styles.displayName}>
              {userData?.display_name || userData?.username}
            </h1>
            <p className={styles.username}>@{userData?.username}</p>

            {userData?.bio && <p className={styles.bio}>{userData.bio}</p>}

            {/* Join date */}
            <div className={styles.joinDateContainer}>
              <IoCalendarOutline className={styles.calendarIcon} />
              <span>Joined {userData.joinDate}</span>
            </div>

            {/* Following/Followers */}
            <div className={styles.statsContainer}>
              <button className={styles.followBtn}>
                <strong>{userData.following}</strong> Following
              </button>
              <button className={styles.followBtn}>
                <strong>{followersCount}</strong> Followers
              </button>
            </div>
          </div>
        </div>

        {/* 4. Navigation Tabs */}
        <div className={styles.navTabs}>
          <div className={`${styles.tab} ${styles.activeTab}`}>Posts</div>
        </div>
        {/* 5. Display User Tweets # added later to get the users tweets */}
        <div className={styles.tweetsSection}>
          {userTweets.length > 0 ? (
            userTweets.map((tweet) => (
              <TweetItem
                key={tweet.id}
                tweet={tweet}
                onTweetUpdated={(updatedTweet) => {
                  setUserTweets((prevTweets) =>
                    prevTweets.map((t) => (t.id === updatedTweet.id ? updatedTweet : t))
                  );
                }}
                onTweetDeleted={(deletedTweetId) => {
                  setUserTweets((prevTweets) =>
                    prevTweets.filter((t) => t.id !== deletedTweetId)
                  );
                }}
              />
            ))
          ) : (
            <div className={styles.noTweets}>No tweets found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

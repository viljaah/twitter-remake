/*import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import styles from "./ProfilePage.module.css";
import TweetItem from "./TweetItem";
import FollowStats from "../../components/shared/followStats/FollowStats";
import FollowersList from "../../components/shared/profileFollowerList/FollowerList";

const ProfilePage = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [userTweets, setUserTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  const handleTabChange = (tab) => {
    console.log(`Switching to tab: ${tab}`);
    setActiveTab(tab);
  };

  useEffect(() => {
    const authToken = localStorage.getItem('token');
    const storedUserData = localStorage.getItem('user');
    console.log("Current auth token:", authToken);
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setCurrentUserData(userData);
        console.log("Using stored user data:", userData);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    console.log("Current username parameter:", username);
    
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/users/search?q=${username}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        
        const data = await response.json();
        setUserData(data.user);
        setLoading(false);
      } catch (error) {
        console.log("error fetching user data:", error);
        setError("Could not load user profile");
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [username]);

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
          setUserTweets(data.tweets);
        } catch (err) {
          console.log("Error fetching user tweets:", err);
        }
      };
      fetchUserTweets();
    }
  }, [userData]);

  const handleFollowStatusChange = (status) => {
    setIsFollowing(status);
  };

  // Determine if this is the current user's own profile
  // Note: We're using localStorage.getItem('user') directly as a backup
  const storedUser = localStorage.getItem('user');
  const parsedStoredUser = storedUser ? JSON.parse(storedUser) : null;
  const isOwnProfile = (currentUserData?.username === username) || 
                      (parsedStoredUser?.username === username);

  console.log("Is own profile:", isOwnProfile);
  console.log("Current active tab:", activeTab);

  if (loading) {
    return <div className={styles.loadingState}>Loading user profile...</div>;
  }

  if (error) {
    return <div className={styles.errorState}>{error}</div>;
  }

  return (
    <div className={styles.mainContent}>
      {/* Header section 
      <div className={styles.header}>
        <Link to="/" className={styles.backButton}>
          <FaArrowLeft />
        </Link>
        <div className={styles.headerInfo}>
          <h2 className={styles.headerName}>
            {userData?.display_name || userData?.username}
          </h2>
          {activeTab === "posts" && <span className={styles.postCount}>{userTweets.length}</span>}
        </div>
      </div>

      {/* Profile content container *
      <div className={styles.profileContent}>
        {/* Cover Photo Section *
        <div className={styles.coverPhoto}>
          {/*this is where user's cover image will go*
        </div>

        {/* Profile information section *
        <div className={styles.profileInfo}>
          {/* Profile picture *
          <div className={styles.profilePictureContainer}>
            <img
              src="https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg"
              className={styles.profilePicture}
              alt="Profile"
            />
          </div>

          {/* Edit profile button - only shown on own profile *
          <div className={styles.editProfileContainer}>
            {isOwnProfile && (
              <button className={styles.editProfileButton}>Edit profile</button>
            )}
          </div>

          {/* Profile details *
          <div className={styles.profileDetails}>
            <h1 className={styles.displayName}>
              {userData?.display_name || userData?.username}
            </h1>
            <p className={styles.username}>@{userData?.username}</p>

            {userData?.bio && <p className={styles.bio}>{userData.bio}</p>}

            {/* Join date *
            <div className={styles.joinDateContainer}>
              <IoCalendarOutline className={styles.calendarIcon} />
              <span>Joined {userData?.joinDate || 'April 2023'}</span>
            </div>

            {/* Follow Stats *
            {userData?.id && (
              <FollowStats
                userId={userData.id}
                styles={styles}
                onFollowStatusChange={handleFollowStatusChange}
              />
            )}
          </div>
        </div>

        {/* Navigation Tabs *
        <div className={styles.navTabs}>
          <div 
            className={`${styles.tab} ${activeTab === "posts" ? styles.activeTab : ""}`}
            onClick={() => handleTabChange("posts")}
          >
            Posts
          </div>
          {isOwnProfile && (
            <>
              <div 
                className={`${styles.tab} ${activeTab === "followers" ? styles.activeTab : ""}`}
                onClick={() => handleTabChange("followers")}
              >
                Followers
              </div>
              <div 
                className={`${styles.tab} ${activeTab === "following" ? styles.activeTab : ""}`}
                onClick={() => handleTabChange("following")}
              >
                Following
              </div>
            </>
          )}
        </div>

        {/* Content based on active tab *
        {activeTab === "posts" && (
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
        )}

        {/* Followers tab *
        {activeTab === "followers" && isOwnProfile && (
          <FollowersList type="followers" />
        )}

        {/* Following tab *
        {activeTab === "following" && isOwnProfile && (
          <FollowersList type="following" />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;*/

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
//import { FaArrowLeft } from "react-icons/fa6";
import styles from "./ProfilePage.module.css";
import TweetList from "../../components/shared/tweets/TweetList";
import FollowStats from "../../components/shared/followStats/FollowStats";
import FollowersList from "../../components/shared/profileFollowerList/FollowerList";
import { getUserByUsername, getUserTweets } from "../../service/userService";
import ProfileHeader from "./ProfileHeader";
import { useAuth } from "../../contexts/AuthContext";

const ProfilePage = () => {
  const { username } = useParams();
  const { authUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [userTweets, setUserTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  // Determine if this is the current user's own profile
  const isOwnProfile = authUser?.username === username;

  // Handler for tab changes
  const handleTabChange = (tab) => {
    console.log(`Switching to tab: ${tab}`);
    setActiveTab(tab);
  };

  // Fetch user data when username changes
  useEffect(() => {
    console.log("Current username parameter:", username);
    
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const data = await getUserByUsername(username);
        setUserData(data.user);
        setError(null);
      } catch (error) {
        console.log("Error fetching user data:", error);
        setError("Could not load user profile");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [username]);

  // Fetch user tweets when user data changes
  useEffect(() => {
    if (userData?.id) {
      const fetchUserTweets = async () => {
        try {
          const data = await getUserTweets(userData.id);
          setUserTweets(data.tweets);
        } catch (err) {
          console.log("Error fetching user tweets:", err);
        }
      };
      fetchUserTweets();
    }
  }, [userData]);

  // Handler for follow status changes
  const handleFollowStatusChange = (status) => {
    setIsFollowing(status);
  };

  // Loading state
  if (loading) {
    return <div className={styles.loadingState}>Loading user profile...</div>;
  }

  // Error state
  if (error) {
    return <div className={styles.errorState}>{error}</div>;
  }

  return (
    <div className={styles.mainContent}>
      {/* Profile Header Component */}
      <ProfileHeader
        userData={userData}
        tweetsCount={userTweets.length}
        activeTab={activeTab}
      />

      {/* Profile Content */}
      <div className={styles.profileContent}>
        {/* Cover Photo */}
        <div className={styles.coverPhoto}></div>

        {/* Profile Information */}
        <div className={styles.profileInfo}>
          {/* Profile Picture */}
          <div className={styles.profilePictureContainer}>
            <img
              src="https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg"
              className={styles.profilePicture}
              alt="Profile"
            />
          </div>

          {/* Edit Profile Button - only for own profile */}
          <div className={styles.editProfileContainer}>
            {isOwnProfile && (
              <button className={styles.editProfileButton}>Edit profile</button>
            )}
          </div>

          {/* Profile Details */}
          <div className={styles.profileDetails}>
            <h1 className={styles.displayName}>
              {userData?.display_name || userData?.username}
            </h1>
            <p className={styles.username}>@{userData?.username}</p>

            {userData?.bio && <p className={styles.bio}>{userData.bio}</p>}

            {/* Follow Stats Component */}
            {userData?.id && (
              <FollowStats
                userId={userData.id}
                styles={styles}
                onFollowStatusChange={handleFollowStatusChange}
              />
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.navTabs}>
          <div 
            className={`${styles.tab} ${activeTab === "posts" ? styles.activeTab : ""}`}
            onClick={() => handleTabChange("posts")}
          >
            Posts
          </div>
          {isOwnProfile && (
            <>
              <div 
                className={`${styles.tab} ${activeTab === "followers" ? styles.activeTab : ""}`}
                onClick={() => handleTabChange("followers")}
              >
                Followers
              </div>
              <div 
                className={`${styles.tab} ${activeTab === "following" ? styles.activeTab : ""}`}
                onClick={() => handleTabChange("following")}
              >
                Following
              </div>
            </>
          )}
        </div>

        {/* Content based on active tab */}
        {activeTab === "posts" && (
          <TweetList 
            tweets={userTweets} 
            onTweetUpdated={() => {
              // Refetch tweets when one is updated or deleted
              if (userData?.id) {
                getUserTweets(userData.id).then(data => {
                  setUserTweets(data.tweets);
                });
              }
            }} 
          />
        )}

        {/* Followers tab */}
        {activeTab === "followers" && isOwnProfile && (
          <FollowersList type="followers" />
        )}

        {/* Following tab */}
        {activeTab === "following" && isOwnProfile && (
          <FollowersList type="following" />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
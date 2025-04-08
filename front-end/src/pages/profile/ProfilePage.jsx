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
import Button from "../../components/ui/Button.jsx";

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
              <Button 
              variant="outline"
              size="md"
              className={styles.editProfileButtonPosition}
            >
              Edit profile
            </Button>
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
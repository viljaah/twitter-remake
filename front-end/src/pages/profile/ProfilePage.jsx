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
  const [userTweets, setUserTweets] = useState([]); // store the user's tweets # added later to get the users tweets
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // show loading state
  if (loading) {
    return <div className={styles.loadingState}>Loading user profile...</div>;
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
          <h2 className={styles.headerName}>
            {userData?.display_name || userData?.username}
          </h2>
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
              src="https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg"
              className={styles.profilePicture}
            />
          </div>

          {/* Edit profile button */}
          <div className={styles.editProfileContainer}>
            <button className={styles.editProfileButton}>Edit profile</button>
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
                <strong>{userData.followers}</strong> Followers
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

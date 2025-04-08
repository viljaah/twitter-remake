/*import React, { useState, useEffect } from "react";
import styles from "./HomePage.module.css";
import PostHome from "../../components/shared/postContainers/PostHome";
import SearchBar from "../../components/shared/searchBar/SearchBar";
import { GoHeart } from "react-icons/go";

function HomePage() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/tweets");
        if (!response.ok) {
          throw new Error("Failed to get tweets");
        }
        const data = await response.json();
        setTweets(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTweets();
  }, []);

  return (
    <div className={styles.parentDiv}>
      <SearchBar />

      <PostHome />

      {tweets.map((tweet) => (
        <div key={tweet.id} className={styles.tweetCard}>
          <div className={styles.tweetHeader}>
            <img
              src={
                tweet.userAvatar ||
                "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
              }
              className={styles.avatar}
            />
            <div>
              <span className={styles.username}>
                {tweet.username || "Anonymous"}
              </span>
              <span className={styles.handle}>
                @{tweet.handle || "anonymous"}
              </span>
            </div>
          </div>

          <div className={styles.tweetContent}>{tweet.content}</div>

          <div className={styles.tweetFooter}>
            <GoHeart className={styles.heartIcon} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomePage;*/
import React, { useState, useEffect } from "react";
import styles from "./HomePage.module.css";
import PostHome from "../../components/shared/postContainers/PostHome";
import SearchBar from "../../components/shared/searchBar/SearchBar";
import TweetList from "../../components/shared/tweets/TweetList";
import { getAllTweets } from "../../service/tweetService";

function HomePage() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch tweets on component mount
  useEffect(() => {
    fetchTweets();
  }, []);

  // Function to fetch tweets
  const fetchTweets = async () => {
    setLoading(true);
    try {
      const data = await getAllTweets();
      setTweets(data);
      setError("");
    } catch (err) {
      console.error("Error fetching tweets:", err);
      setError("Failed to load tweets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle when a new tweet is created
  const handleTweetCreated = (newTweet) => {
    setTweets(prevTweets => [newTweet, ...prevTweets]);
  };

  return (
    <div className={styles.parentDiv}>
      <SearchBar />
      
      {/* Post creation component */}
      <PostHome onTweetCreated={handleTweetCreated} />
      
      {/* Show loading state, error, or tweets */}
      {loading ? (
        <div className={styles.loadingState}>Loading tweets...</div>
      ) : error ? (
        <div className={styles.errorState}>{error}</div>
      ) : (
        <TweetList tweets={tweets} onTweetUpdated={fetchTweets} />
      )}
    </div>
  );
}

export default HomePage;
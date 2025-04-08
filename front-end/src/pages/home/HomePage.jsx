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
import React from "react";
import TweetItem from "../../../pages/profile/TweetItem";
import styles from "./TweetList.module.css";

/**
 * Component to display a list of tweets
 * 
 * @param {Object} props
 * @param {Array} props.tweets - Array of tweet objects
 * @param {Function} props.onTweetUpdated - Callback when a tweet is updated or deleted
 */
const TweetList = ({ tweets, onTweetUpdated }) => {
  if (!tweets || tweets.length === 0) {
    return <div className={styles.emptyState}>No tweets to display</div>;
  }

  return (
    <div className={styles.tweetList}>
      {tweets.map((tweet) => (
        <TweetItem 
          key={tweet.id} 
          tweet={tweet} 
          onTweetUpdated={onTweetUpdated}
        />
      ))}
    </div>
  );
};

export default TweetList;
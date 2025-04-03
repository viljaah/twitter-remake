import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import PostContainer from '../../components/shared/postComponent';

const HomePage = () => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/tweets');
        if (!response.ok) {
          throw new Error('Failed to get tweets');
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
      <PostContainer />

      {tweets.map((tweet) => (
        <div key={tweet.id} className={styles.tweetCard}>
          <p>{tweet.content}</p>
        </div>
      ))}
    </div>
  );
};

export default HomePage;


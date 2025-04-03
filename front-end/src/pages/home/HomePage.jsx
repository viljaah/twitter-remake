import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import PostContainer from '../../components/shared/postComponent';
import { GoHeart } from "react-icons/go";

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

      {/* {tweets.map((tweet) => (
        <div key={tweet.id} className={styles.tweetCard}>
          <p>{tweet.content}</p>
        </div>
      ))} */}

{tweets.map((tweet) => (
        <div key={tweet.id} className={styles.tweetCard}>
          <div className={styles.tweetHeader}>
            <img
              src={tweet.userAvatar || 'https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg'}
              alt="User Avatar"
              className={styles.avatar}
            />
            <div>
              <span className={styles.username}>{tweet.username || 'Anonymous'}</span>
              <span className={styles.handle}>
                @{tweet.handle || 'anonymous'}
              </span>
            </div>
          </div>

          <div className={styles.tweetContent}>
            {tweet.content}
          </div>

          <div className={styles.tweetFooter}>
            <GoHeart className={styles.heartIcon} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomePage;


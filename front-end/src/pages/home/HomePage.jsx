import React, { useState } from 'react';
import styles from './HomePage.module.css';
import { AiOutlinePicture } from 'react-icons/ai';
import { BsEmojiSmile } from 'react-icons/bs';
import { RiFileGifLine } from 'react-icons/ri';

const HomePage = () => {
  const [tweetContent, setTweetContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePost = async () => {
    // dont post empty post
    if (!tweetContent.trim()) {
      setError('Tweet cant be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: tweetContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post tweet');
      }

      const data = await response.json();
      console.log('Tweet posted:', data);

      // clear the text if the post got posted
      setTweetContent('');
    } catch (err) {
      setError(err.message || 'Somthing went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.parentDiv}>
      <div className={styles.postContainer}>
        <img src="https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg" className={styles.profileImg}/>

        <div className={styles.postContent}>
          <textarea 
            className={styles.textArea} 
            placeholder="What's happening?" 
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
          />

          <div className={styles.actionsRow}>
            <div className={styles.icons}>
              <AiOutlinePicture className={styles.icon} />
              <RiFileGifLine className={styles.icon} />
              <BsEmojiSmile className={styles.icon} />
              <BsEmojiSmile className={styles.icon} />
              <BsEmojiSmile className={styles.icon} />
              <BsEmojiSmile className={styles.icon} />
            </div>
            <button 
              className={styles.postBtn}
              onClick={handlePost}
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;


import { useState } from 'react';
import styles from './Post.module.css';
import { BsImage, BsEmojiSmile, BsCalendar3 } from "react-icons/bs";
import { RiFileGifLine } from 'react-icons/ri';
import { BiPoll } from "react-icons/bi";
import { GoLocation } from "react-icons/go";
import { createTweet } from '../../../service/tweetService';
import { useAuth } from '../../../contexts/AuthContext';
import Avatar from '../../ui/Avatar';
import Button from '../../ui/Button';

function PostHome({ onTweetCreated }) {
  const [tweetContent, setTweetContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { authUser } = useAuth();

  const handlePost = async () => {
    // Don't post empty tweet
    if (!tweetContent.trim()) {
      setError('Tweet cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newTweet = await createTweet(tweetContent);
      console.log('Tweet posted:', newTweet);

      // Clear the text if the post was successful
      setTweetContent('');
      
      // Notify parent component if callback provided
      if (onTweetCreated) {
        onTweetCreated(newTweet);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.parentDiv}>
      <div className={styles.postContainer}>
        <Avatar 
          src={authUser?.profile_picture_url}
          alt={`${authUser?.username}'s profile`}
          size="md"
          className={styles.profileImg}
        />

        <div className={styles.postContent}>
          <textarea 
            className={styles.textArea} 
            placeholder="What's happening?" 
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
          />

          <div className={styles.actionsRow}>
            <div className={styles.icons}>
              <BsImage className={styles.icon} />
              <RiFileGifLine className={styles.icon} />
              <BiPoll className={styles.icon} />
              <BsEmojiSmile className={styles.icon} />
              <BsCalendar3 className={styles.icon} />
              <GoLocation className={styles.icon} />
            </div>
              <Button 
                variant="primary"
                size="md"
                onClick={handlePost}
                disabled={loading}
                className={styles.postBtn} // Keep the class for positioning only
              >
                {loading ? 'Posting...' : 'Post'}
               </Button>
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
}

export default PostHome;


import React, { useState } from "react";
import { IoIosMore } from "react-icons/io";
import { GoHeart } from "react-icons/go";
import styles from "./TweetItem.module.css";

const TweetItem = ({ tweet, onTweetUpdated, onTweetDeleted }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(tweet.content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleEdit = () => {
    setEditMode(true);
    setMenuOpen(false);
  };

  const handleDelete = async () => {
    setMenuOpen(false);
    if (!window.confirm("Are you sure you want to delete this tweet?")) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/tweets/${tweet.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete tweet");
      }
      // Notify parent that tweet was deleted
      if (onTweetDeleted) {
        onTweetDeleted(tweet.id);
      }
    } catch (err) {
      setError(err.message || "Error deleting tweet");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      setError("Tweet content cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/tweets/${tweet.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editContent }),
      });
      if (!response.ok) {
        throw new Error("Failed to update tweet");
      }
      const updatedTweet = await response.json();
      setEditMode(false);
      if (onTweetUpdated) {
        onTweetUpdated(updatedTweet);
      }
    } catch (err) {
      setError(err.message || "Error updating tweet");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditContent(tweet.content);
    setError("");
  };

  return (
    <div className={styles.tweetCard}>
      <div className={styles.tweetHeader}>
        <img
          src={
            tweet.userAvatar ||
            "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
          }
          alt="Avatar"
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
        <button onClick={handleMenuToggle} className={styles.moreButton}>
          <IoIosMore className={styles.moreIcon} />
        </button>
        {menuOpen && (
          <div className={styles.dropdownMenu}>
            <button className={styles.dropdownItem} onClick={handleEdit}>
              Edit
            </button>
            <button className={styles.dropdownItem} onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
      <div className={styles.tweetContent}>
        {editMode ? (
          <div className={styles.editContainer}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className={styles.editTextArea}
            />
            <div className={styles.editActions}>
              <button
                onClick={handleSaveEdit}
                className={styles.saveBtn}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancelEdit}
                className={styles.cancelBtn}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        ) : (
          tweet.content
        )}
      </div>
      <div className={styles.tweetFooter}>
        <GoHeart className={styles.heartIcon} />
      </div>
    </div>
  );
};

export default TweetItem;

import React from 'react';
import styles from './Post.module.css';
import PostHome from './PostHome';

function PostSidebar({ onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modalContent}>
        <PostHome />
        <button onClick={onClose} className={styles.closeBtn}>X</button>
      </div>
    </div>
  );
}

export default PostSidebar;

import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Post.module.css';
import PostHome from './PostHome';

const PostSidebar = ({ onClose }) => {
  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <div className={styles.postSidebarContent}>
      <PostHome />
        <button onClick={onClose} className={styles.closeBtn}>X</button>
      </div>
    </div>,
    document.body
  );
};

export default PostSidebar;

import React, { useState } from 'react';
import SearchBar from '../../components/shared/searchBar/SearchBar';
import styles from './Explore.module.css';

function ExplorePage() {

  return (
    <div className={styles.exploreContainer}>
        <SearchBar />
    </div>
  );
}

export default ExplorePage;

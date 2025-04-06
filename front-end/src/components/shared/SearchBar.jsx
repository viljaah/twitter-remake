import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './SearchBar.module.css';

function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get('query') || "";
  const initialFilter = params.get('filter') || "tweets";

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [committedQuery, setCommittedQuery] = useState(initialQuery);
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users/me');
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Trigger search when committedQuery changes
  useEffect(() => {
    if (location.pathname === "/explore" && committedQuery.trim() !== "") {
      fetchResults();
    } else {
      setResults([]);
    }
  }, [location.pathname, committedQuery, selectedFilter]);

  const fetchResults = async () => {
    let url = "";
    try {
      switch(selectedFilter) {
        case "tweets":
          url = `http://localhost:8000/api/tweets/search?query=${encodeURIComponent(committedQuery)}`;
          break;
        case "hashtags":
          url = `http://localhost:8000/api/tweets/hashtag/search?query=${encodeURIComponent(committedQuery)}`;
          break;
        case "users":
          url = `http://localhost:8000/api/users/search?q=${encodeURIComponent(committedQuery)}`;
          break;
        default:
          setResults([]);
          return;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        setResults([]);
        setError("No results found");
        return;
      }
      
      const data = await response.json();

      // Handle different result types
      if (selectedFilter === "users" && data.user) {
        // For users, check follow status
        try {
          const followStatusResponse = await fetch(
            {/*WRING ROUTES */}
            `http://localhost:8000/api/users/${data.user.id}/follow-status`
          );
          
          const followStatusData = await followStatusResponse.json();
          
          // Combine user data with follow status
          setResults([{
            ...data.user,
            is_following: followStatusData.is_following
          }]);
        } catch (followError) {
          // If follow status check fails, still show the user
          setResults([data.user]);
        }
      } else {
        // For tweets and hashtags, use the data as-is
        setResults(selectedFilter === "tweets" ? data : 
                   selectedFilter === "hashtags" ? data : []);
      }
      
      setError("");
    } catch (err) {
      setResults([]);
      setError("No results found");
    }
  };

  const handleFollowToggle = async (userId, isCurrentlyFollowing) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      const endpoint = `/api/users/follow/${userId}`;
      const method = isCurrentlyFollowing ? 'DELETE' : 'POST';
      
      const response = await fetch(endpoint, { method });
      
      if (response.ok) {
        // Update the results to reflect the new follow status
        setResults(results.map(user => 
          user.id === userId 
            ? { ...user, is_following: !isCurrentlyFollowing } 
            : user
        ));
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setCommittedQuery(inputQuery);
      if (location.pathname !== "/explore") {
        navigate(`/explore?query=${encodeURIComponent(inputQuery)}&filter=${selectedFilter}`);
      }
    }
  };

  const handleFilterClick = (filter) => {
    if (filter !== selectedFilter) {
      setSelectedFilter(filter);
      setInputQuery("");
      setCommittedQuery("");
      setResults([]);
      setError("");
      if (location.pathname === "/explore") {
        navigate(`/explore?query=&filter=${filter}`);
      }
    }
  };

  return (
    <>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.searchInput}
        />
        <div className={styles.filterButtons}>
          <button 
            className={selectedFilter === "tweets" ? styles.active : ""}
            onClick={() => handleFilterClick("tweets")}
          >
            Tweets
          </button>
          <button 
            className={selectedFilter === "users" ? styles.active : ""}
            onClick={() => handleFilterClick("users")}
          >
            Users
          </button>
          <button 
            className={selectedFilter === "hashtags" ? styles.active : ""}
            onClick={() => handleFilterClick("hashtags")}
          >
            Hashtags
          </button>
        </div>
      </div>
      {committedQuery.trim() !== "" && (
        <div className={styles.resultsContainer}>
          {error ? (
            <p>{error}</p>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <div key={index} className={styles.resultItem}>
                {selectedFilter === "tweets" && (
                  <p>{result.content}</p>
                )}
                {selectedFilter === "hashtags" && (
                  <p>
                    {result.hashtag ? result.hashtag.name : result.content}
                  </p>
                )}
                {selectedFilter === "users" && (
                  <>
                    <Link to={`/profile/${result.username}`} className={styles.userInfo}>
                      <p><strong>{result.username}</strong></p>
                      {result.display_name && <p>{result.display_name}</p>}
                    </Link>
                    {currentUser && currentUser.id !== result.id && (
                      <button 
                        className={`${styles.followButton} ${result.is_following ? styles.following : ''}`}
                        onClick={() => handleFollowToggle(result.id, result.is_following)}
                      >
                        {result.is_following ? 'Unfollow' : 'Follow'}
                      </button>
                    )}
                  </>
                )}
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      )}
    </>
  );  
}

export default SearchBar;
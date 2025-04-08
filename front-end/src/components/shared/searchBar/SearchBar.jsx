import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './SearchBar.module.css';
import { search } from "../../../service/searchService";
import { useAuth } from "../../../contexts/AuthContext";
import { followUser, unfollowUser } from '../../../service/userService';
import Button from "../../ui/Button.jsx";

function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useAuth();
  
  // Extract query and filter from URL
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get('query') || "";
  const initialFilter = params.get('filter') || "tweets";

  // State management
  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [committedQuery, setCommittedQuery] = useState(initialQuery);
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Trigger search when query or filter changes
  useEffect(() => {
    const performSearch = async () => {
      // Only search if on explore page and query is not empty
      if (location.pathname === "/explore" && committedQuery.trim() !== "") {
        setIsLoading(true);
        setError("");
        
        try {
          const searchResults = await search(committedQuery, selectedFilter);
          
          // Handle different result types
          switch(selectedFilter) {
            case 'tweets':
              setResults(searchResults.tweets || []);
              break;
            case 'hashtags':
              setResults(searchResults.hashtags || []);
              break;
            case 'users':
              // Specifically for users, we get a single user or null
              setResults(searchResults ? [searchResults.user] : []);
              break;
            default:
              setResults([]);
          }
        } catch (err) {
          console.error('Search error:', err);
          setError("Failed to perform search");
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    };

    performSearch();
  }, [location.pathname, committedQuery, selectedFilter]);

  // Handle search input submission
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setCommittedQuery(inputQuery);
      
      // Navigate to explore page if not already there
      if (location.pathname !== "/explore") {
        navigate(`/explore?query=${encodeURIComponent(inputQuery)}&filter=${selectedFilter}`);
      }
    }
  };

  // Change search filter
  const handleFilterClick = (filter) => {
    if (filter !== selectedFilter) {
      setSelectedFilter(filter);
      setInputQuery("");
      setCommittedQuery("");
      setResults([]);
      setError("");
      
      // Update URL if on explore page
      if (location.pathname === "/explore") {
        navigate(`/explore?query=&filter=${filter}`);
      }
    }
  };

  // Handle follow/unfollow for users
  const handleFollowToggle = async (userId, isCurrentlyFollowing) => {
    // This method would use the existing follow/unfollow service methods
    // Implement similar to other components' follow logic
    try {
      if (isCurrentlyFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
      
      // Update results to reflect new follow status
      setResults(results.map(user => 
        user.id === userId 
          ? { ...user, is_following: !isCurrentlyFollowing } 
          : user
      ));
    } catch (error) {
      console.error('Error toggling follow:', error);
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
          {['tweets', 'users', 'hashtags'].map(filter => (
            <button 
              key={filter}
              className={selectedFilter === filter ? styles.active : ""}
              onClick={() => handleFilterClick(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {committedQuery.trim() !== "" && (
        <div className={styles.resultsContainer}>
          {isLoading ? (
            <p>Searching...</p>
          ) : error ? (
            <p>{error}</p>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <div key={index} className={styles.resultItem}>
                {selectedFilter === "tweets" && (
                  <p>{result.content}</p>
                )}
                
                {selectedFilter === "hashtags" && (
                  <p>{result.hashtag ? result.hashtag.name : result.content}</p>
                )}
                
                {selectedFilter === "users" && result && (
                  <>
                    <Link to={`/profile/${result.username}`} className={styles.userInfo}>
                      <p><strong>{result.username}</strong></p>
                      {result.display_name && <p>{result.display_name}</p>}
                    </Link>
                    
                    {authUser && authUser.id !== result.id && (
                      <Button 
                        variant={result.is_following ? "unfollow" : "follow"}
                        size="sm"
                        onClick={() => handleFollowToggle(result.id, result.is_following)}
                        className={styles.followButtonPosition}
                      >
                        {result.is_following ? 'Unfollow' : 'Follow'}
                      </Button>
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

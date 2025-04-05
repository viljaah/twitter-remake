import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './SearchBar.module.css';

function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get('query') || "";
  const initialFilter = params.get('filter') || "tweets";

  // inputQuery holds the live value from the input field.
  const [inputQuery, setInputQuery] = useState(initialQuery);
  // committedQuery holds the query when the user presses Enter.
  const [committedQuery, setCommittedQuery] = useState(initialQuery);
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // Trigger search only when committedQuery changes.
  useEffect(() => {
    if (location.pathname === "/explore" && committedQuery.trim() !== "") {
      fetchResults();
    } else {
      setResults([]);
    }
  }, [location.pathname, committedQuery, selectedFilter]);

  const fetchResults = async () => {
    let url = "";
    if (selectedFilter === "tweets") {
      url = `http://localhost:8000/api/tweets/search?query=${encodeURIComponent(committedQuery)}`;
    } else if (selectedFilter === "hashtags") {
      url = `http://localhost:8000/api/tweets/hashtag/search?query=${encodeURIComponent(committedQuery)}`;
    } else if (selectedFilter === "users") {
      url = `http://localhost:8000/api/users/search?q=${encodeURIComponent(committedQuery)}`;
    }
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      if (selectedFilter === "users") {
        // API returns an object with a 'user' key if a user is found.
        if (data.user) {
          setResults([data.user]);
          setError("");
        } else {
          // No user found—clear results without setting an error.
          setResults([]);
          setError("");
        }
      } else {
        setResults(data);
        setError("");
      }
    } catch (err) {
      setResults([]);
      setError("No user found");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Commit the current input value as the search query.
      setCommittedQuery(inputQuery);
      if (location.pathname !== "/explore") {
        // Redirect to ExplorePage with the committed query and selected filter.
        navigate(`/explore?query=${encodeURIComponent(inputQuery)}&filter=${selectedFilter}`);
      }
      // If already on ExplorePage, the useEffect hook will trigger the search.
    }
  };

  const handleFilterClick = (filter) => {
    // If clicking a different filter, clear the search inputs and results.
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
                {selectedFilter === "tweets" && <p>{result.content}</p>}
                {selectedFilter === "hashtags" && (
                  <p>
                    {result.hashtag ? result.hashtag.name : result.content}
                  </p>
                )}
                {selectedFilter === "users" && (
                  <div>
                    <p><strong>{result.username}</strong></p>
                    {result.display_name && <p>{result.display_name}</p>}
                  </div>
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

import React, { useState, useEffect, useRef } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const searchTimeoutRef = useRef(null);
  
  // Debounce search to prevent excessive API calls
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      // Only search if query is not empty or has been cleared
      onSearch(query);
    }, 500); // 500ms delay
    
    // Cleanup on unmount or before next effect run
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, onSearch]);
  
  const handleChange = (e) => {
    setQuery(e.target.value);
  };
  
  // Prevent form submission (which would cause page reload)
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  
  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search for movies..."
        value={query}
        onChange={handleChange}
        aria-label="Search movies"
      />
    </form>
  );
}

export default SearchBar;
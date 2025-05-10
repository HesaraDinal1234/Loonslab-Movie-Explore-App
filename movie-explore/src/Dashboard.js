import React, { useState, useEffect, useCallback } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { fetchTrendingMovies, fetchMovies, fetchGenres } from './MovieAPI'; 
import MovieCard from './MovieCard'; 
import SearchBar from './SearchBar'; 
import './Dashboard.css';  

function Dashboard() {   
  const [movies, setMovies] = useState([]);   
  const [trendingMovies, setTrendingMovies] = useState([]);   
  const [loading, setLoading] = useState(true);   
  const [theme, setTheme] = useState('dark');
  const [genres, setGenres] = useState([]);
  
  // Filter states
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  
  // Generate years for the year filter (current year down to 1980)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1979 }, (_, i) => currentYear - i);
  
  // Rating options
  const ratingOptions = [
    { value: '9', label: '9+ ★' },
    { value: '8', label: '8+ ★' },
    { value: '7', label: '7+ ★' },
    { value: '6', label: '6+ ★' },
    { value: '5', label: '5+ ★' },
    { value: '0', label: 'All Ratings' }
  ];      

  useEffect(() => {     
    const loadInitialData = async () => {       
      try {         
        setLoading(true);
        
        // Fetch genres
        const genresData = await fetchGenres();
        if (genresData && genresData.genres) {
          setGenres(genresData.genres);
        }
        
        // Fetch trending movies
        const data = await fetchTrendingMovies();         
        if (data && data.results) {           
          setTrendingMovies(data.results);           
          setMovies(data.results);         
        }       
      } catch (error) {         
        console.error("Error loading initial data:", error);         
        setTrendingMovies([]);         
        setMovies([]);
        setGenres([]);       
      } finally {         
        setLoading(false);       
      }     
    };          
    
    loadInitialData();   
  }, []);

  // Memoize handleSearch to prevent unnecessary re-renders
  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query); // Store the current search query
    
    try {       
      if (query.trim() === '') {         
        // If search is cleared, show filtered trending movies
        applyAllFilters(trendingMovies);
        return;       
      }              
      
      setLoading(true);       
      const data = await fetchMovies(query);       
      if (data && data.results) {         
        // Apply all filters to search results
        applyAllFilters(data.results);
      } else {         
        setMovies([]);       
      }     
    } catch (error) {       
      console.error("Error searching movies:", error);       
      setMovies([]);     
    } finally {       
      setLoading(false);     
    }
  }, [trendingMovies, selectedGenre, selectedYear, selectedRating]);
  
  // Apply all filters (genre, year, rating) to a list of movies
  const applyAllFilters = useCallback((movieList) => {
    let filteredMovies = [...movieList];
    
    // Filter by genre if selected
    if (selectedGenre) {
      filteredMovies = filteredMovies.filter(movie => 
        movie.genre_ids && movie.genre_ids.includes(parseInt(selectedGenre))
      );
    }
    
    // Filter by year if selected
    if (selectedYear) {
      const year = parseInt(selectedYear);
      filteredMovies = filteredMovies.filter(movie => {
        // Extract year from release_date (format: YYYY-MM-DD)
        const movieYear = movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : null;
        return movieYear === year;
      });
    }
    
    // Filter by rating if selected
    if (selectedRating && selectedRating !== '0') {
      const minRating = parseFloat(selectedRating);
      filteredMovies = filteredMovies.filter(movie => 
        movie.vote_average >= minRating
      );
    }
    
    setMovies(filteredMovies);
  }, [selectedGenre, selectedYear, selectedRating]);
  
  // Handle filter changes
  const handleGenreChange = useCallback((e) => {
    const genreId = e.target.value;
    setSelectedGenre(genreId);
    
    // Re-apply all filters with the new genre value
    if (searchQuery.trim() !== '') {
      handleSearch(searchQuery);
    } else {
      applyAllFilters(trendingMovies);
    }
  }, [searchQuery, trendingMovies, handleSearch, applyAllFilters]);
  
  const handleYearChange = useCallback((e) => {
    const year = e.target.value;
    setSelectedYear(year);
    
    // Re-apply all filters with the new year value
    if (searchQuery.trim() !== '') {
      handleSearch(searchQuery);
    } else {
      applyAllFilters(trendingMovies);
    }
  }, [searchQuery, trendingMovies, handleSearch, applyAllFilters]);
  
  const handleRatingChange = useCallback((e) => {
    const rating = e.target.value;
    setSelectedRating(rating);
    
    // Re-apply all filters with the new rating value
    if (searchQuery.trim() !== '') {
      handleSearch(searchQuery);
    } else {
      applyAllFilters(trendingMovies);
    }
  }, [searchQuery, trendingMovies, handleSearch, applyAllFilters]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedRating('0');
    
    if (searchQuery.trim() !== '') {
      handleSearch(searchQuery);
    } else {
      setMovies(trendingMovies);
    }
  };

  const toggleTheme = () => {     
    setTheme(theme === 'dark' ? 'light' : 'dark');   
  };      

  return (     
    <div className={`dashboard ${theme}`}>       
      <header>         
        <button onClick={toggleTheme} className="theme-toggle">           
          {theme === 'dark' ? '☀️' : '🌙'}         
        </button>         
        <SearchBar onSearch={handleSearch} />
      </header>
      
      {/* Filters Section */}
      <div className="filters-container">
        {/* Genre Filter */}
        <div className="filter">
          <label htmlFor="genre-select">Genre:</label>
          <select 
            id="genre-select"
            value={selectedGenre} 
            onChange={handleGenreChange}
            className="filter-select"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Year Filter */}
        <div className="filter">
          <label htmlFor="year-select">Year:</label>
          <select 
            id="year-select"
            value={selectedYear} 
            onChange={handleYearChange}
            className="filter-select"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        
        {/* Rating Filter */}
        <div className="filter">
          <label htmlFor="rating-select">Rating:</label>
          <select 
            id="rating-select"
            value={selectedRating} 
            onChange={handleRatingChange}
            className="filter-select"
          >
            {ratingOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Reset Filters Button */}
        <button 
          onClick={handleResetFilters}
          className="reset-filters-btn"
          disabled={!selectedGenre && !selectedYear && selectedRating === '0'}
        >
          Reset Filters
        </button>
      </div>
      
      {loading ? (         
        <div className="loading">Searching movies...</div>       
      ) : (         
        <>     
         <section className="trending-section">             
            <h2>Trending This Week</h2>             
            <div className="trending-movies">               
              {trendingMovies && trendingMovies.length > 0 ? (                 
                trendingMovies.slice(0, 5).map((movie) => (                   
                  <MovieCard                     
                    key={movie.id}                     
                    movie={movie}                     
                    onClick={() => navigate(`/movie/${movie.id}`)}                   
                  />                 
                ))               
              ) : (                 
                <div className="no-results">No trending movies available</div>               
              )}             
            </div>           
          </section>               
          <section className="movie-grid">
            <h2>
              {/* Dynamic title based on active filters */}
              {getMovieGridTitle(searchQuery, selectedGenre, selectedYear, selectedRating, genres)}
            </h2>
            {movies && movies.length > 0 ? (               
              movies.map((movie) => (                 
                <MovieCard                   
                  key={movie.id}                   
                  movie={movie}                   
                  onClick={() => navigate(`/movie/${movie.id}`)}                 
                />               
              ))             
            ) : (               
              <div className="no-results">
                No movies found with the current filters
              </div>             
            )}           
          </section>                      
        </>       
      )}     
    </div>   
  ); 
}

// Helper function to generate the movie grid title based on active filters
function getMovieGridTitle(searchQuery, selectedGenre, selectedYear, selectedRating, genres) {
  let title = '';
  
  // Add rating description if applicable
  if (selectedRating && selectedRating !== '0') {
    title += `${selectedRating}+ ★ `;
  }
  
  // Add genre description if applicable
  if (selectedGenre) {
    const genreName = genres.find(g => g.id === parseInt(selectedGenre))?.name || '';
    title += `${genreName} `;
  }
  
  // Add basic title
  title += 'Movies';
  
  // Add year if applicable
  if (selectedYear) {
    title += ` from ${selectedYear}`;
  }
  
  // If there's a search query, show that instead
  if (searchQuery) {
    return `Results for "${searchQuery}"${selectedGenre || selectedYear || (selectedRating && selectedRating !== '0') ? ' with filters' : ''}`;
  }
  
  return title;
}

export default Dashboard;
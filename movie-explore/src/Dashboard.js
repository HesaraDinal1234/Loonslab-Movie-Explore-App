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
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();      

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
        // If search is cleared, show filtered trending movies based on genre
        filterMoviesByGenre(trendingMovies, selectedGenre);
        return;       
      }              
      
      setLoading(true);       
      const data = await fetchMovies(query);       
      if (data && data.results) {         
        // Apply genre filter to search results if a genre is selected
        filterMoviesByGenre(data.results, selectedGenre);
      } else {         
        setMovies([]);       
      }     
    } catch (error) {       
      console.error("Error searching movies:", error);       
      setMovies([]);     
    } finally {       
      setLoading(false);     
    }
  }, [trendingMovies, selectedGenre]);
  
  const filterMoviesByGenre = useCallback((movieList, genreId) => {
    if (!genreId) {
      // If no genre is selected, show all movies
      setMovies(movieList);
      return;
    }
    
    // Filter movies by selected genre
    const filteredMovies = movieList.filter(movie => 
      movie.genre_ids && movie.genre_ids.includes(parseInt(genreId))
    );
    
    setMovies(filteredMovies);
  }, []);
  
  // Update genre and refilter results
  const handleGenreChange = useCallback((e) => {
    const genreId = e.target.value;
    setSelectedGenre(genreId);
    
    // If there's an active search, refilter those results
    if (searchQuery.trim() !== '') {
      // Re-run the search with the new genre filter
      handleSearch(searchQuery);
    } else {
      // Otherwise filter the trending movies
      filterMoviesByGenre(trendingMovies, genreId);
    }
  }, [searchQuery, trendingMovies, handleSearch, filterMoviesByGenre]);

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
      
      {/* Genre Filter Dropdown */}
      <div className="genre-filter">
        <select 
          value={selectedGenre} 
          onChange={handleGenreChange}
          className="genre-select"
        >
          <option value="">All Genres</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>              
      
      {loading ? (         
        <div className="loading">Searching movies...</div>       
      ) : (         
        <>           
          <section className="movie-grid">
            <h2>
              {selectedGenre 
                ? `${genres.find(g => g.id === parseInt(selectedGenre))?.name || ''} Movies` 
                : searchQuery ? `Results for "${searchQuery}"` : 'All Movies'}
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
                {selectedGenre 
                  ? `No ${genres.find(g => g.id === parseInt(selectedGenre))?.name || ''} movies found` 
                  : 'No movies found'}
              </div>             
            )}           
          </section>                      
          
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
        </>       
      )}     
    </div>   
  ); 
}  

export default Dashboard;
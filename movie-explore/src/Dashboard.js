import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTrendingMovies, fetchMovies } from './MovieAPI';
import MovieCard from './MovieCard';
import SearchBar from './SearchBar';
import './Dashboard.css';

function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchTrendingMovies();
        if (data && data.results) {
          setTrendingMovies(data.results);
          setMovies(data.results);
        }
      } catch (error) {
        console.error("Error loading trending movies:", error);
        setTrendingMovies([]);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadTrendingMovies();
  }, []);
  
  const handleSearch = async (query) => {
    try {
      if (query.trim() === '') {
        setMovies(trendingMovies);
        return;
      }
      
      setLoading(true);
      const data = await fetchMovies(query);
      if (data && data.results) {
        setMovies(data.results);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error searching movies:", error);
      setMovies([]);
    } finally {
      setLoading(false);
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
      
      {loading ? (
        <div className="loading">Loading movies...</div>
      ) : (
        <>
          <section className="movie-grid">
            {movies && movies.length > 0 ? (
              movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                />
              ))
            ) : (
              <div className="no-results">No movies found</div>
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
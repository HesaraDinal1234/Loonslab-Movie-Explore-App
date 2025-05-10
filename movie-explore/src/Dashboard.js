import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTrendingMovies, fetchMovies } from './MovieAPI';
import MovieCard from './MovieCard';
import SearchBar from './SearchBar';
import './Dashboard.css';

function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [theme, setTheme] = useState('dark');
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrendingMovies = async () => {
      const data = await fetchTrendingMovies();
      setTrendingMovies(data.results);
      setMovies(data.results);
    };
    loadTrendingMovies();
  }, []);

  const handleSearch = async (query) => {
    if (query.trim() === '') {
      setMovies(trendingMovies);
      return;
    }
    const data = await fetchMovies(query);
    setMovies(data.results);
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

      <section className="movie-grid">
        {movies.map((movie) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            onClick={() => navigate(`/movie/${movie.id}`)}
          />
        ))}
      </section>

      <section className="trending-section">
        <h2>Trending This Week</h2>
        <div className="trending-movies">
          {trendingMovies.slice(0, 5).map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onClick={() => navigate(`/movie/${movie.id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
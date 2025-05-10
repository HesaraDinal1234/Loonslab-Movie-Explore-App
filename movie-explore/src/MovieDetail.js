import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetails } from './MovieAPI';
import './MovieDetail.css';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has a preference stored or use system preference
    const savedMode = localStorage.getItem('darkMode');
    return savedMode !== null 
      ? JSON.parse(savedMode) 
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Apply theme class to document body
    document.body.classList.toggle('dark-mode', darkMode);
    // Save preference
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    return () => {
      // Cleanup on unmount
      document.body.classList.remove('dark-mode');
    };
  }, [darkMode]);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        const data = await fetchMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMovieDetails();
  }, [id]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  if (loading) {
    return (
      <div className={`loading-container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="loader"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className={`error-container ${darkMode ? 'dark-mode' : ''}`}>
        <h2>Movie Not Found</h2>
        <p>Sorry, we couldn't find the movie you're looking for.</p>
        <button onClick={() => navigate(-1)} className="button">
          Return to Movies
        </button>
      </div>
    );
  }

  const trailer = movie.videos?.results?.find(vid => vid.type === 'Trailer');
  const releaseYear = movie.release_date?.split('-')[0] || 'N/A';
  const directors = movie.credits?.crew?.filter(person => person.job === 'Director') || [];
  
  return (
    <div className={`movie-detail-page ${darkMode ? 'dark-mode' : ''}`}>
      <header className="detail-nav">
        <button onClick={() => navigate(-1)} className="back-button">
          <span className="icon back-icon">←</span>
          <span>Back</span>
        </button>
        <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
          <span className="icon">
            {darkMode ? '☀️' : '🌙'}
          </span>
        </button>
      </header>

      <div className="backdrop-container">
        {movie.backdrop_path && (
          <div className="backdrop" 
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            }}
          >
            <div className="backdrop-overlay"></div>
          </div>
        )}
      </div>

      <div className="detail-container">
        <div className="poster-container">
          <img
            src={movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/placeholder-movie.png'}
            alt={movie.title}
            className="movie-poster"
          />
        </div>

        <div className="movie-info">
          <h1>{movie.title}</h1>
          
          {movie.tagline && (
            <p className="tagline">"{movie.tagline}"</p>
          )}

          <div className="meta-info">
            <div className="meta-item">
              <span className="meta-icon">⏱️</span>
              <span>{movie.runtime || 'N/A'} min</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">⭐</span>
              <span>{movie.vote_average?.toFixed(1) || 'N/A'}</span>
            </div>
            <div className="meta-item year">
              <span>📅 {releaseYear}</span>
            </div>
          </div>

          <div className="genres-container">
            {movie.genres?.map(genre => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>

          <div className="section">
            <h3>Overview</h3>
            <p className="overview">{movie.overview || 'No overview available.'}</p>
          </div>

          {directors.length > 0 && (
            <div className="section directors">
              <h3>Director{directors.length > 1 ? 's' : ''}</h3>
              <div className="directors-list">
                {directors.map(director => (
                  <span key={director.id}>{director.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {trailer && (
        <div className="section trailer-section">
          <h2>Trailer</h2>
          <div className="trailer-container">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={`${movie.title} Trailer`}
              allowFullScreen
              className="trailer-frame"
            ></iframe>
          </div>
        </div>
      )}

      <div className="section cast-section">
        <h2>Cast</h2>
        <div className="cast-grid">
          {movie.credits?.cast?.slice(0, 8).map(person => (
            <div key={person.id} className="cast-card">
              <div className="cast-image-container">
                <img
                  src={person.profile_path
                    ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                    : '/placeholder-actor.png'}
                  alt={person.name}
                  className="cast-image"
                />
              </div>
              <div className="cast-details">
                <p className="cast-name">{person.name}</p>
                <p className="cast-character">{person.character}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
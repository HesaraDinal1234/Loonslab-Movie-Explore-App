import React from 'react';
import './MovieCard.css';

function MovieCard({ movie, onClick }) {
  return (
    <div className="movie-card" onClick={onClick}>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        onError={(e) => e.target.src = '/placeholder-movie.png'}
      />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <div className="meta">
          <span>{movie.release_date?.split('-')[0]}</span>
          <span>⭐ {movie.vote_average?.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
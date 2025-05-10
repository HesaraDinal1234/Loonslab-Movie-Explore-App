import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetails } from './MovieAPI';
import './MovieDetail.css';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="loading">Loading...</div>;
  if (!movie) return <div className="error">Movie not found</div>;

  const trailer = movie.videos?.results?.find(vid => vid.type === 'Trailer');

  return (
    <div className="movie-detail">
      <button onClick={() => navigate(-1)} className="back-button">← Back</button>
      
      <div className="detail-header">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          onError={(e) => e.target.src = '/placeholder-movie.png'}
        />
        <div className="header-info">
          <h1>{movie.title}</h1>
          <div className="meta">
            <span>{movie.release_date?.split('-')[0]}</span>
            <span>⭐ {movie.vote_average?.toFixed(1)}</span>
            <span>{movie.runtime} min</span>
          </div>
          <div className="genres">
            {movie.genres?.map(genre => (
              <span key={genre.id}>{genre.name}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="detail-content">
        <h3>Overview</h3>
        <p>{movie.overview}</p>

        {trailer && (
          <div className="trailer">
            <h3>Trailer</h3>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={`${movie.title} Trailer`}
              allowFullScreen
            ></iframe>
          </div>
        )}

        <div className="cast">
          <h3>Cast</h3>
          <div className="cast-grid">
            {movie.credits?.cast?.slice(0, 6).map(person => (
              <div key={person.id} className="cast-member">
                <img
                  src={person.profile_path 
                    ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                    : '/placeholder-actor.png'}
                  alt={person.name}
                />
                <p>{person.name}</p>
                <p className="character">{person.character}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
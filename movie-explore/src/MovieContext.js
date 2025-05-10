import React, { createContext, useContext, useEffect, useState } from 'react';

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [lastSearch, setLastSearch] = useState('');
  const [theme, setTheme] = useState('dark');

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

    const savedLastSearch = localStorage.getItem('lastMovieSearch');
    if (savedLastSearch) setLastSearch(savedLastSearch);

    const savedTheme = localStorage.getItem('movieTheme');
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save last search to localStorage
  const saveLastSearch = (query) => {
    setLastSearch(query);
    localStorage.setItem('lastMovieSearch', query);
  };

  // Save theme preference
  const saveTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('movieTheme', newTheme);
    document.body.className = newTheme === 'dark' ? 'dark-theme' : 'light-theme';
  };

  // Toggle favorite status
  const toggleFavorite = (movie) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === movie.id);
      if (isFavorite) {
        return prev.filter(fav => fav.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  // Check if a movie is favorite
  const isFavorite = (movieId) => {
    return favorites.some(movie => movie.id === movieId);
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        setMovies,
        trendingMovies,
        setTrendingMovies,
        loading,
        setLoading,
        favorites,
        toggleFavorite,
        isFavorite,
        lastSearch,
        saveLastSearch,
        theme,
        setTheme: saveTheme
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => useContext(MovieContext);
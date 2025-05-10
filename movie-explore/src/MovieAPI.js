const API_KEY = 'YOUR_TMDB_API_KEY'; // Get from https://www.themoviedb.org
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMovies = async (query) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
  );
  return await response.json();
};

export const fetchTrendingMovies = async () => {
  const response = await fetch(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
  );
  return await response.json();
};

export const fetchMovieDetails = async (id) => {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits`
  );
  return await response.json();
};
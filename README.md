# Movie Explorer Application

A modern React application for browsing and searching movies using The Movie Database (TMDB) API.

![Movie Explorer App](https://movieversefilm.netlify.app/)

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Movie Discovery**: Browse trending movies updated weekly
- **Search Functionality**: Search for movies by title, actor, or keywords
- **Advanced Filtering**: Filter movies by:
  - Genre
  - Release year
  - Rating (star-based filter)
- **Detailed Movie Information**:
  - Plot overview
  - Cast and crew details
  - Runtime, rating, and release date
  - Movie trailers (YouTube embedded)
- **User Experience**:
  - Responsive design for all device sizes
  - Dark/Light theme toggle with state persistence
  - Loading states for better user feedback
  - User authentication with session management
- **Navigation**: Easy navigation between dashboard and movie details

## Technologies Used

- **React**: Frontend library for building the user interface
- **React Router**: For application routing
- **CSS**: Custom styling with light/dark theme support
- **TMDB API**: Movie data source
- **localStorage/sessionStorage**: For persisting user preferences and authentication

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/HesaraDinal1234/Loonslab-Movie-Explore-App.git
   cd movie-explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Configuration

### TMDB API
This application uses The Movie Database (TMDB) API. You need to:

1. Register for an account at [TMDB](https://www.themoviedb.org/)
2. Generate an API key from your account dashboard
3. Add the API key to your `.env` file as shown in the installation section

## Usage

### Dashboard
The main dashboard displays trending movies and provides a search interface with filters. Users can:
- Search for specific movies
- Filter by genre, year, and minimum rating
- Toggle between light and dark themes
- Access their user account or log out

### Movie Details
Clicking on any movie takes you to a detailed view where you can see:
- Movie backdrop and poster
- Title, tagline, and basic information
- Plot overview
- Director(s)
- Cast members with photos
- Trailer (if available)

## API Integration

The application interacts with TMDB API through the following endpoints (implemented in `MovieAPI.js`):

- `fetchTrendingMovies()`: Gets weekly trending movies
- `fetchMovies(query)`: Searches for movies by query string
- `fetchMovieDetails(movieId)`: Gets detailed information about a specific movie
- `fetchGenres()`: Gets a list of all movie genres
- `fetchMoviesByGenre(genreId)`: Gets movies filtered by a specific genre

Example API usage:

```javascript
import { fetchTrendingMovies } from './MovieAPI';

// In your component
useEffect(() => {
  const loadMovies = async () => {
    try {
      const data = await fetchTrendingMovies();
      setMovies(data.results);
    } catch (error) {
      console.error("Error loading movies:", error);
    }
  };
  
  loadMovies();
}, []);
```

## Authentication

The application includes a simple authentication system that:
- Allows users to log in
- Stores authentication tokens in localStorage/sessionStorage
- Provides a logout functionality that clears session data

## Theme Support

The application supports both light and dark themes:
- Theme preference is saved to localStorage
- Default theme is based on system preference
- Users can toggle between themes with a single click



Built with ❤️ using React and TMDB API
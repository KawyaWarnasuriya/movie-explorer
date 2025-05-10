import React, { useEffect, useState } from 'react';
import { getTrendingMovies } from './api';
import MovieCard from './components/MovieCard';
import SearchBar from './components/SearchBar';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieDetail from './components/MovieDetail';
import { useTheme } from './context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './App.css';

import Login from './components/Login';
import Signup from './components/Signup';
import LandingPage from './components/LandingPage';

import UserProfile from './components/Profile';
import Favorites from './components/Favorites';
import HistoryPage from './components/HistoryPage';
import ProfileIcon from './components/ProfileIcon';

const API_KEY = '82b98d43136f2310d877a917d91e3605';

const TrendingMoviesPage = ({ searchTerm, setSearchTerm, movies }) => {
  return (
    <>
      <div className="heading-wrapper">
        <h1 className="heading">Trending Movies</h1>
        <div className="search-container">
          <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
          <ProfileIcon />
        </div>
      </div>

      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </>
  );
};

const HideNavbarWrapper = ({ children }) => {
  return <>{children}</>;
};

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    async function fetchMovies() {
      try {
        let data;
        if (searchTerm.trim() === '') {
          data = await getTrendingMovies();
        } else {
          const response = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}`
          );
          data = response.data.results;
        }
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    }

    fetchMovies();
  }, [searchTerm]);

  return (
    <Router>
      <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <HideNavbarWrapper>
          <button onClick={toggleTheme} className="theme-toggle-button">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/home"
              element={
                <TrendingMoviesPage
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  movies={movies}
                />
              }
            />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </HideNavbarWrapper>
      </div>
    </Router>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';

import { FaSun, FaMoon } from 'react-icons/fa';

import MovieCard from './components/MovieCard';
import MovieDetail from './components/MovieDetail';

import Login from './components/Login';
import Signup from './components/Signup';
import LandingPage from './components/LandingPage';

import UserProfile from './components/Profile';
import Favorites from './components/Favorites';
import HistoryPage from './components/HistoryPage';

import ProfileIcon from './components/ProfileIcon';

import { useTheme } from './context/ThemeContext';

import movieGallery from './assets/movie-gallery.jpg';

import './App.css';


// ======================================================
// TMDB API KEY
// ======================================================

const API_KEY = '82b98d43136f2310d877a917d91e3605';


// ======================================================
// HOME NAVBAR
// ======================================================

const HomeNavbar = () => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav className="home-navbar">

      {/* Website Brand */}
      <div
        className="home-brand"
        onClick={() => navigate('/home')}
      >
        <div className="home-website-name">
          Movie Explorer
        </div>

        <div className="home-website-tagline">
          Discover Your Favorite Films
        </div>
      </div>


      {/* Navbar Right Side */}
      <div className="home-navbar-actions">

        {/* Theme Button */}
        <button
          type="button"
          className="home-theme-button"
          onClick={toggleTheme}
          aria-label={
            darkMode
              ? 'Switch to light mode'
              : 'Switch to dark mode'
          }
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>


        {/* Profile */}
        <ProfileIcon />

      </div>

    </nav>
  );
};


// ======================================================
// HOME PAGE
// ======================================================

const HomePage = ({
  movies,
  searchTerm,
  setSearchTerm,
  loading,
}) => {

  const { darkMode } = useTheme();

  return (
    <div
      className={`home-page ${
        darkMode ? 'home-dark' : 'home-light'
      }`}
    >

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <HomeNavbar />


      {/* ==================================================
          MOVIE GALLERY / SEARCH SECTION
      ================================================== */}

      <section
        className="movie-gallery-section"
        style={{
          backgroundImage: `url(${movieGallery})`,
        }}
      >

        {/* Dark overlay */}
        <div className="movie-gallery-overlay"></div>


        {/* Content */}
        <div className="movie-gallery-content">

          <h1 className="home-title">
            Trending Movies
          </h1>


          {/* Search */}
          <div className="home-search-wrapper">

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search for a movie..."
              className="home-search-input"
            />

          </div>

        </div>

      </section>


      {/* ==================================================
          MOVIES SECTION
      ================================================== */}

      <section className="trending-section">

        <div className="movies-container">

          {loading ? (

            <div className="movies-message">
              Loading movies...
            </div>

          ) : movies.length > 0 ? (

            <div className="movies-grid">

              {movies.map((movie) => (

                <MovieCard
                  key={movie.id}
                  movie={movie}
                />

              ))}

            </div>

          ) : (

            <div className="movies-message">
              No movies found.
            </div>

          )}

        </div>

      </section>

    </div>
  );
};


// ======================================================
// APP CONTENT
// ======================================================

const AppContent = () => {

  const [movies, setMovies] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(true);


  // ====================================================
  // FETCH MOVIES
  // ====================================================

  useEffect(() => {

    const fetchMovies = async () => {

      setLoading(true);

      try {

        let url;


        // -----------------------------------------------
        // TRENDING MOVIES
        // -----------------------------------------------

        if (searchTerm.trim() === '') {

          url =
            `https://api.themoviedb.org/3/trending/movie/week` +
            `?api_key=${API_KEY}`;

        }


        // -----------------------------------------------
        // SEARCH MOVIES
        // -----------------------------------------------

        else {

          url =
            `https://api.themoviedb.org/3/search/movie` +
            `?api_key=${API_KEY}` +
            `&query=${encodeURIComponent(searchTerm)}`;

        }


        console.log('TMDB Request:', url);


        // -----------------------------------------------
        // API REQUEST
        // -----------------------------------------------

        const response = await axios.get(url);


        console.log(
          'TMDB Response:',
          response.data
        );


        // -----------------------------------------------
        // SET MOVIES
        // -----------------------------------------------

        const results =
          response.data?.results || [];


        console.log(
          'Movies received:',
          results
        );


        setMovies(results);

      }

      catch (error) {

        console.error(
          'Movie API Error:',
          error
        );

        setMovies([]);

      }

      finally {

        setLoading(false);

      }

    };


    fetchMovies();

  }, [searchTerm]);


  // ====================================================
  // ROUTES
  // ====================================================

  return (

    <Routes>

      {/* Landing */}
      <Route
        path="/"
        element={<LandingPage />}
      />


      {/* Login */}
      <Route
        path="/login"
        element={<Login />}
      />


      {/* Signup */}
      <Route
        path="/signup"
        element={<Signup />}
      />


      {/* Home */}
      <Route
        path="/home"
        element={
          <HomePage
            movies={movies}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            loading={loading}
          />
        }
      />


      {/* Movie Details */}
      <Route
        path="/movie/:id"
        element={
          <div className="app-container">
            <MovieDetail />
          </div>
        }
      />


      {/* Profile */}
      <Route
        path="/profile"
        element={
          <div className="app-container">
            <UserProfile />
          </div>
        }
      />


      {/* Favorites */}
      <Route
        path="/favorites"
        element={
          <div className="app-container">
            <Favorites />
          </div>
        }
      />


      {/* History */}
      <Route
        path="/history"
        element={
          <div className="app-container">
            <HistoryPage />
          </div>
        }
      />

    </Routes>

  );
};


// ======================================================
// MAIN APP
// ======================================================

function App() {

  return (

    <Router>

      <AppContent />

    </Router>

  );

}


export default App;
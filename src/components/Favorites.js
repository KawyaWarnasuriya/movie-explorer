import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import {
  FaSun,
  FaMoon,
  FaArrowLeft,
  FaHeart
} from 'react-icons/fa6';

import MovieCard from './MovieCard';
import ProfileIcon from './ProfileIcon';

import { useTheme } from '../context/ThemeContext';

import './Favorites.css';


/* ======================================================
   NAVBAR
====================================================== */

const FavoritesNavbar = () => {

  const navigate = useNavigate();

  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav className="favorites-navbar">

      <div
        className="favorites-navbar-brand"
        onClick={() => navigate('/home')}
      >

        <div className="favorites-navbar-name">
          Movie Explorer
        </div>

        <div className="favorites-navbar-tagline">
          Discover Your Favorite Films
        </div>

      </div>


      <div className="favorites-navbar-actions">

        <button
          type="button"
          className="favorites-theme-button"
          onClick={toggleTheme}
          aria-label={
            darkMode
              ? 'Switch to light mode'
              : 'Switch to dark mode'
          }
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <ProfileIcon />

      </div>

    </nav>
  );
};


/* ======================================================
   FAVORITES PAGE
====================================================== */

const Favorites = () => {

  const [user] = useAuthState(auth);

  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();

  const { darkMode } = useTheme();


  /* ====================================================
     REAL-TIME FAVORITES
  ==================================================== */

  useEffect(() => {

    if (!user) {
      setFavorites([]);
      return;
    }

    const favRef = collection(
      db,
      'users',
      user.uid,
      'favorites'
    );


    const unsubscribe = onSnapshot(
      favRef,

      (snapshot) => {

        const favMovies = snapshot.docs.map(
          doc => doc.data()
        );

        setFavorites(favMovies);

      },

      (error) => {

        console.error(
          'Error fetching favorites:',
          error
        );

        setFavorites([]);

      }
    );


    return () => unsubscribe();

  }, [user]);


  /* ====================================================
     THEME
  ==================================================== */

  const pageTheme = darkMode
    ? 'favorites-dark'
    : 'favorites-light';


  return (

    <div className={`favorites-page ${pageTheme}`}>

      {/* NAVBAR */}

      <FavoritesNavbar />


      <div className="favorites-content">

        {/* BACK BUTTON */}

        <button
          className="favorites-back-button"
          onClick={() => navigate('/home')}
        >

          <FaArrowLeft />

          <span>
            Back to Home
          </span>

        </button>


        {/* PAGE HEADING */}

        <div className="favorites-heading">

          <div className="favorites-heading-icon">
            <FaHeart />
          </div>

          <div>

            <div className="favorites-small-label">
              YOUR COLLECTION
            </div>

            <h2 className="favorites-title">
              Favorite Movies
            </h2>

            <p className="favorites-subtitle">
              Movies you've saved to your favorites
            </p>

          </div>

        </div>


        {/* MOVIES */}

        {favorites.length > 0 ? (

          <div className="movies-grid">

            {favorites.map(movie => (

              <MovieCard
                key={movie.id}
                movie={movie}
              />

            ))}

          </div>

        ) : (

          <div className="favorites-empty">

            <div className="favorites-empty-icon">
              <FaHeart />
            </div>

            <h3>
              No Favorite Movies
            </h3>

            <p>
              You haven't added any movies to your favorites yet.
            </p>

            <button
              onClick={() => navigate('/home')}
            >
              Explore Movies
            </button>

          </div>

        )}

      </div>

    </div>

  );
};


export default Favorites;
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

import {
  FaSun,
  FaMoon,
  FaArrowLeft,
  FaClockRotateLeft
} from 'react-icons/fa6';

import ProfileIcon from './ProfileIcon';
import { useTheme } from '../context/ThemeContext';

import './HistoryPage.css';


/* ======================================================
   NAVBAR
====================================================== */

const HistoryNavbar = () => {

  const navigate = useNavigate();

  const { darkMode, toggleTheme } = useTheme();


  return (
    <nav className="history-navbar">

      {/* BRAND */}

      <div
        className="history-navbar-brand"
        onClick={() => navigate('/home')}
      >

        <div className="history-navbar-name">
          Movie Explorer
        </div>

        <div className="history-navbar-tagline">
          Discover Your Favorite Films
        </div>

      </div>


      {/* ACTIONS */}

      <div className="history-navbar-actions">

        <button
          type="button"
          className="history-theme-button"
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
   HISTORY PAGE
====================================================== */

const HistoryPage = () => {

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { darkMode } = useTheme();


  /* ====================================================
     FETCH HISTORY
  ==================================================== */

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {

        if (user) {

          try {

            const historyRef = collection(
              db,
              'users',
              user.uid,
              'history'
            );

            const snapshot = await getDocs(historyRef);

            const movies = snapshot.docs.map(
              doc => doc.data()
            );

            setHistory(movies);

          } catch (error) {

            console.error(
              'Error fetching watch history:',
              error
            );

            setHistory([]);

          }

        } else {

          setHistory([]);

        }

        setLoading(false);

      }
    );


    return () => unsubscribe();

  }, []);



  /* ====================================================
     THEME
  ==================================================== */

  const pageTheme = darkMode
    ? 'history-dark'
    : 'history-light';



  /* ====================================================
     LOADING
  ==================================================== */

  if (loading) {

    return (

      <div className={`history-page ${pageTheme}`}>

        <HistoryNavbar />

        <div className="history-status-wrapper">

          <div className="history-loading-spinner"></div>

          <p className="status-text">
            Loading watch history...
          </p>

        </div>

      </div>

    );

  }



  /* ====================================================
     PAGE
  ==================================================== */

  return (

    <div className={`history-page ${pageTheme}`}>

      {/* NAVBAR */}

      <HistoryNavbar />



      {/* CONTENT */}

      <div className="history-content">


        {/* BACK BUTTON */}

        <button
          className="history-back-button"
          onClick={() => navigate('/home')}
        >

          <FaArrowLeft />

          <span>
            Back to Home
          </span>

        </button>



        {/* PAGE HEADING */}

        <div className="history-heading">

          <div className="history-heading-icon">
            <FaClockRotateLeft />
          </div>


          <div>

            <div className="history-small-label">
              YOUR ACTIVITY
            </div>

            <h1 className="history-title">
              Watch History
            </h1>

            <p className="history-subtitle">
              Movies you have recently explored
            </p>

          </div>

        </div>



        {/* EMPTY STATE */}

        {!history.length ? (

          <div className="history-empty">

            <div className="history-empty-icon">
              <FaClockRotateLeft />
            </div>

            <h2>
              No Watch History
            </h2>

            <p>
              Movies you view will appear here.
            </p>

            <button
              onClick={() => navigate('/home')}
            >
              Explore Movies
            </button>

          </div>

        ) : (


          /* ==================================================
             MOVIE GRID
          ================================================== */

          <div className="movies-grid">

            {history.map((movie) => (

              <Link
                to={`/movie/${movie.id}`}
                key={movie.id}
                className="history-movie-link"
              >

                <div className="history-card">

                  <div className="history-poster-wrapper">

                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                          : 'https://via.placeholder.com/300x450?text=No+Poster'
                      }
                      alt={movie.title}
                      className="history-poster"
                    />


                    <div className="history-poster-overlay">

                      <span>
                        View Movie
                      </span>

                    </div>

                  </div>


                  <div className="history-card-content">

                    <h2>
                      {movie.title}
                    </h2>


                    <div className="history-release">

                      <span>
                        Release Date
                      </span>

                      <strong>
                        {movie.release_date || 'N/A'}
                      </strong>

                    </div>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

    </div>

  );

};


export default HistoryPage;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MovieDetail.css';

import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { FaSun, FaMoon } from 'react-icons/fa';
import ProfileIcon from './ProfileIcon';

import { useTheme } from '../context/ThemeContext';


// ======================================================
// TMDB API KEY
// ======================================================

const API_KEY = '82b98d43136f2310d877a917d91e3605';


// ======================================================
// HOME NAVBAR
// Same Navbar used in App.js
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
// MOVIE DETAIL
// ======================================================

function MovieDetail() {

  const { id } = useParams();

  const navigate = useNavigate();

  const { darkMode } = useTheme();

  const [movie, setMovie] = useState(null);

  const [cast, setCast] = useState([]);

  const [trailerKey, setTrailerKey] = useState(null);


  // ====================================================
  // FETCH MOVIE DETAILS
  // ====================================================

  useEffect(() => {

    async function fetchMovie() {

      try {

        const [
          movieRes,
          castRes,
          videoRes
        ] = await Promise.all([

          axios.get(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
          ),

          axios.get(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
          ),

          axios.get(
            `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
          )

        ]);


        // Movie data

        const movieData = movieRes.data;

        setMovie(movieData);


        // Top 5 cast

        setCast(
          castRes.data.cast.slice(0, 5)
        );


        // Find YouTube trailer

        const trailer =
          videoRes.data.results.find(
            (video) =>
              video.type === 'Trailer' &&
              video.site === 'YouTube'
          );


        if (trailer) {

          setTrailerKey(trailer.key);

        } else {

          setTrailerKey(null);

        }

      }

      catch (error) {

        console.error(
          'Error fetching movie details:',
          error
        );

      }

    }


    fetchMovie();

  }, [id]);


  // ====================================================
  // SAVE MOVIE TO FIRESTORE HISTORY
  // ====================================================

  useEffect(() => {

    if (!movie) {

      return;

    }


    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {

          if (!user) {

            return;

          }


          try {

            const historyRef = doc(
              db,
              'users',
              user.uid,
              'history',
              movie.id.toString()
            );


            await setDoc(
              historyRef,
              {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date
              }
            );


          }

          catch (error) {

            console.error(
              'Error saving movie history:',
              error
            );

          }

        }
      );


    return () => unsubscribe();

  }, [movie]);


  // ====================================================
  // PAGE THEME CLASS
  // ====================================================

  const pageClass = darkMode
    ? 'movie-detail-dark'
    : 'movie-detail-light';


  // ====================================================
  // LOADING
  // ====================================================

  if (!movie) {

    return (

      <div
        className={`movie-detail-page ${pageClass}`}
      >

        <HomeNavbar />

        <div className="movie-detail-loading">

          Loading...

        </div>

      </div>

    );

  }


  // ====================================================
  // PAGE
  // ====================================================

  return (

    <div
      className={`movie-detail-page ${pageClass}`}
    >

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <HomeNavbar />


      {/* ==================================================
          MOVIE DETAIL WRAPPER
      ================================================== */}

      <div className="movie-detail-wrapper">


        {/* ==================================================
            BACK BUTTON
        ================================================== */}

        <button
          onClick={() => navigate(-1)}
          className="movie-back-button"
        >

          ←

        </button>


        {/* ==================================================
            MOVIE DETAILS CARD
        ================================================== */}

        <div className="movie-detail-card">


          {/* ==================================================
              POSTER
          ================================================== */}

          <div className="detail-poster-container">

            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : ''
              }
              alt={movie.title}
              className="detail-poster"
            />

          </div>


          {/* ==================================================
              MOVIE INFORMATION
          ================================================== */}

          <div className="movie-details">


            {/* ==================================================
                MOVIE TITLE
            ================================================== */}

            <h1 className="detail-title">

              {movie.title}

            </h1>


            {/* ==================================================
                RELEASE DATE
            ================================================== */}

            <p className="release-date">

              Release Date:

              <strong>

                {' '}

                {movie.release_date || 'N/A'}

              </strong>

            </p>


            {/* ==================================================
                OVERVIEW
            ================================================== */}

            <div className="overview-box">

              <p>

                {movie.overview ||
                  'No overview available.'}

              </p>

            </div>


            {/* ==================================================
                RATING
            ================================================== */}

            <div className="detail-rating">

              <span className="rating-star">

                ★

              </span>


              <span className="rating-value">

                {movie.vote_average
                  ? movie.vote_average.toFixed(1)
                  : 'N/A'}

              </span>


              <span className="rating-out-of">

                / 10

              </span>

            </div>


            {/* ==================================================
                TOP CAST + TRAILER
            ================================================== */}

            <div className="cast-trailer-row">


              {/* ==================================================
                  TOP CAST
              ================================================== */}

              <div className="cast-section">

                <h3>
                  Top Cast
                </h3>


                <ul>

                  {cast.map((actor) => (

                    <li key={actor.id}>

                      {actor.name}

                      <span>

                        {' '}

                        as {actor.character}

                      </span>

                    </li>

                  ))}

                </ul>

              </div>


              {/* ==================================================
                  TRAILER BUTTON
              ================================================== */}

              {trailerKey && (

                <div className="trailer-section">

                  <h3>
                    Trailer
                  </h3>


                  <a
                    href={`https://www.youtube.com/watch?v=${trailerKey}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="watch-trailer-button"
                  >

                    ▶ WATCH TRAILER

                  </a>

                </div>

              )}


            </div>


          </div>


        </div>


      </div>


    </div>

  );

}


export default MovieDetail;
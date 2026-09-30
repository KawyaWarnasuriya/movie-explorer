import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  FaHeart,
  FaRegHeart
} from 'react-icons/fa6';

import {
  doc,
  getDoc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';

import { onAuthStateChanged } from 'firebase/auth';

import { auth, db } from '../firebase';

import './MovieCard.css';


function MovieCard({ movie }) {

  const [isFavorite, setIsFavorite] = useState(false);

  const [loadingFavorite, setLoadingFavorite] = useState(false);


  /* ======================================================
     CHECK FAVORITE
  ====================================================== */

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {

        if (!user) {

          setIsFavorite(false);

          return;
        }


        try {

          const favoriteRef = doc(
            db,
            'users',
            user.uid,
            'favorites',
            String(movie.id)
          );


          const favoriteSnap =
            await getDoc(favoriteRef);


          setIsFavorite(
            favoriteSnap.exists()
          );

        } catch (error) {

          console.error(
            'Error checking favorite:',
            error
          );

        }

      }
    );


    return () => unsubscribe();

  }, [movie.id]);


  /* ======================================================
     FAVORITE BUTTON
  ====================================================== */

  const handleFavorite = async (event) => {

    event.preventDefault();

    event.stopPropagation();


    const user = auth.currentUser;


    if (!user) {

      alert(
        'Please login to add movies to your favorites.'
      );

      return;
    }


    if (loadingFavorite) {
      return;
    }


    const previousState = isFavorite;


    /* -----------------------------------------------
       CHANGE UI IMMEDIATELY
    ----------------------------------------------- */

    setIsFavorite(!previousState);

    setLoadingFavorite(true);


    try {

      const favoriteRef = doc(
        db,
        'users',
        user.uid,
        'favorites',
        String(movie.id)
      );


      if (previousState) {

        /* REMOVE */

        await deleteDoc(favoriteRef);

      } else {

        /* ADD */

        await setDoc(favoriteRef, {

          id: movie.id,

          title: movie.title,

          poster_path:
            movie.poster_path || '',

          vote_average:
            movie.vote_average || 0,

          release_date:
            movie.release_date || ''

        });

      }

    } catch (error) {

      console.error(
        'Error updating favorite:',
        error
      );


      /* Firebase failed → restore */

      setIsFavorite(previousState);


      alert(
        'Unable to update favorites. Please check your Firebase settings.'
      );

    } finally {

      setLoadingFavorite(false);

    }

  };


  return (

    <div className="movie-card">

      {/* ==================================================
          POSTER
      ================================================== */}

      <div className="movie-poster-container">

        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : 'https://via.placeholder.com/500x750?text=No+Poster'
          }
          alt={movie.title}
          className="movie-poster"
        />


        {/* ==================================================
            FAVORITE
        ================================================== */}

        <button
          type="button"
          className={
            isFavorite
              ? 'favorite-button favorite-active'
              : 'favorite-button'
          }
          onClick={handleFavorite}
          disabled={loadingFavorite}
          aria-label={
            isFavorite
              ? 'Remove from favorites'
              : 'Add to favorites'
          }
        >

          {isFavorite ? (
            <FaHeart />
          ) : (
            <FaRegHeart />
          )}

        </button>

      </div>


      {/* ==================================================
          MOVIE CONTENT
      ================================================== */}

      <div className="movie-card-content">

        <h2 className="movie-title">
          {movie.title}
        </h2>


        <div className="movie-rating">

          <span className="rating-star">
            ★
          </span>

          <span className="rating-value">

            {movie.vote_average
              ? movie.vote_average.toFixed(1)
              : 'N/A'}

          </span>

          <span className="rating-text">
            / 10
          </span>

        </div>


        <Link
          to={`/movie/${movie.id}`}
          className="more-details-button"
        >
          More Details
        </Link>

      </div>

    </div>

  );
}


export default MovieCard;
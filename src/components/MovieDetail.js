import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MovieDetail.css';

import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const API_KEY = '82b98d43136f2310d877a917d91e3605';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const [movieRes, castRes, videoRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`),
        ]);

        const movieData = movieRes.data;
        setMovie(movieData);
        setCast(castRes.data.cast.slice(0, 5));

        const trailer = videoRes.data.results.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (trailer) setTrailerKey(trailer.key);

        // Save to Firestore history
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const historyRef = doc(db, 'users', user.uid, 'history', movieData.id.toString());
            await setDoc(historyRef, {
              id: movieData.id,
              title: movieData.title,
              poster_path: movieData.poster_path,
              release_date: movieData.release_date,
            });
          }
        });
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    }

    fetchMovie();
  }, [id]);

  if (!movie) {
    return <div style={{ textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <>
      <div className="movie-card">
        <div className="movie-content">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="movie-image"
          />

          <div className="movie-details">
            <h2 className="movie-title">{movie.title}</h2>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p><strong>Rating:</strong> {movie.vote_average}</p>
            <p><strong>Overview:</strong> {movie.overview}</p>

            {/* Cast section */}
            <div className="cast-section">
              <h3>Top Cast</h3>
              <ul>
                {cast.map((actor) => (
                  <li key={actor.id}>
                    {actor.name} as <i>{actor.character}</i>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trailer section */}
            {trailerKey && (
              <div className="trailer-section">
                <h3>Trailer</h3>
                <iframe
                  width="100%"
                  height="320"
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title="YouTube trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>

      <button onClick={() => navigate(-1)} className="back-button">
        ⬅ Back
      </button>
    </>
  );
}

export default MovieDetail;

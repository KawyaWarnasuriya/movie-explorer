import React from 'react';
import { Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function MovieCard({ movie }) {
  const [user] = useAuthState(auth);

  const addToFavorites = async (e) => {
    e.preventDefault(); 

    if (!user) {
      alert('Please login to add favorites.');
      return;
    }

    try {
      await setDoc(doc(db, 'users', user.uid, 'favorites', movie.id.toString()), {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
      });
      alert('Movie added to favorites!');
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  return (
    <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ width: '200px', border: '1px solid #ccc', borderRadius: '8px', padding: '0.5rem' }}>
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
          style={{ width: '100%', borderRadius: '8px' }}
        />
        <h2 style={{ fontSize: '1rem', marginTop: '0.5rem', textAlign: 'center', color: 'brown' }}>{movie.title}</h2>
        <h3 style={{ fontSize: '1rem', marginTop: '0.5rem', textAlign: 'center' }}>Release Date : {movie.release_date}</h3>
        <h3 style={{ fontSize: '1rem', marginTop: '0.5rem', textAlign: 'center' }}>Rating : {movie.vote_average}</h3>

        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <button onClick={addToFavorites} style={{ padding: '5px 10px', cursor: 'pointer' }}>
            Add to Favorites
          </button>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;

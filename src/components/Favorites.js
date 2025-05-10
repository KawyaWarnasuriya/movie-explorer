import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs } from 'firebase/firestore';
import MovieCard from './MovieCard';
import ProfileIcon from './ProfileIcon'; // Import ProfileIcon
import './Favorites.css';

const Favorites = () => {
  const [user] = useAuthState(auth);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      try {
        const favRef = collection(db, 'users', user.uid, 'favorites');
        const snapshot = await getDocs(favRef);
        const favMovies = snapshot.docs.map(doc => doc.data());
        setFavorites(favMovies);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h2 className="favorites-title">Your Favorite Movies</h2>
        <ProfileIcon />
      </div>

      <div className="movies-grid">
        {favorites.length > 0 ? (
          favorites.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <p>No favorite movies found.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;

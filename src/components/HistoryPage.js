import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import ProfileIcon from './ProfileIcon';
import './HistoryPage.css';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const historyRef = collection(db, 'users', user.uid, 'history');
        const snapshot = await getDocs(historyRef);
        const movies = snapshot.docs.map(doc => doc.data());
        setHistory(movies);
        setLoading(false);
      } else {
        setHistory([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="status-text">Loading history...</p>;
  if (!history.length) return <p className="status-text">No history found.</p>;

  return (
    <div className="history-page">
      <div className="history-header">
        <h2 className="history-title">Watch History</h2>
        <ProfileIcon />
      </div>

      <div className="movies-grid">
        {history.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} style={{ textDecoration: 'none' }}>
            <div className="history-card">
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
              <h2>{movie.title}</h2>
              <h3>Release Date: {movie.release_date}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;

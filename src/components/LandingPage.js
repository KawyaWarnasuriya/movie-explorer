import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import backgroundImage from '../assets/background.jpg';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="landing-container"
      style={{ '--background-image': `url(${backgroundImage})` }}
    >
      <div className="background-overlay"></div>

      {/* =========================
          NAVBAR
          ========================= */}
      <nav className="landing-navbar">
        <div className="website-brand">
          <div className="website-name">
            Movie Explorer
          </div>

          <div className="website-tagline">
            Discover Your Favorite Films
          </div>
        </div>

        <div className="navbar-buttons">
          <button onClick={() => navigate('/login')}>
            Login / Signup
          </button>
        </div>
      </nav>

      {/* =========================
          CENTER CONTENT
          ========================= */}
      <div className="overlay-content">
        <h1>Welcome to Movie Explorer</h1>

        <button
          className="get-started-btn"
          onClick={() => navigate('/login')}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import videoBg from '../assets/background.mp4';


function LandingPage() {
    const navigate = useNavigate();
  
    return (
      <div className="landing-container">
        <video className="background-video" autoPlay loop muted>
          <source src={videoBg} type="video/mp4" />
        </video>

        <div className="top-right-buttons">
            <button onClick={() => navigate('/login')}>Login / Signup</button>
        </div>


        <div className="overlay-content">
          <h1>Welcome to Movie Explorer</h1>
          <button className="get-started-btn" onClick={() => navigate('/login')}>Get Started</button>
        </div>
      </div>
    );
  }
  
  export default LandingPage;

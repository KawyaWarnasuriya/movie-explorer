import React, { useState, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

import {
  FaSun,
  FaMoon,
  FaCamera,
  FaArrowLeft,
  FaEnvelope,
  FaCircleCheck
} from 'react-icons/fa6';

import ProfileIcon from './ProfileIcon';
import { useTheme } from '../context/ThemeContext';
import './Profile.css';


const ProfileNavbar = () => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav className="profile-navbar">

      <div
        className="profile-navbar-brand"
        onClick={() => navigate('/home')}
      >
        <div className="profile-navbar-name">
          Movie Explorer
        </div>

        <div className="profile-navbar-tagline">
          Discover Your Favorite Films
        </div>
      </div>


      <div className="profile-navbar-actions">

        <button
          type="button"
          className="profile-theme-button"
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


const Profile = () => {

  const [user] = useAuthState(auth);

  const navigate = useNavigate();

  const { darkMode } = useTheme();

  const [previewImage, setPreviewImage] = useState(null);

  const fileInputRef = useRef(null);


  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {

      const imageURL = URL.createObjectURL(file);

      setPreviewImage(imageURL);

    }

  };


  const handleClick = () => {

    if (fileInputRef.current) {

      fileInputRef.current.click();

    }

  };


  const pageTheme = darkMode
    ? 'profile-dark'
    : 'profile-light';


  return (

    <div className={`profile-page ${pageTheme}`}>

      {/* NAVBAR */}

      <ProfileNavbar />


      <div className="profile-page-wrapper">


        {/* BACK BUTTON */}

        <button
          className="profile-back-button"
          onClick={() => navigate('/home')}
        >
          <FaArrowLeft />

          <span>
            Back to Home
          </span>
        </button>



        {/* HERO */}

        <div className="profile-hero">

          <div className="profile-hero-content">

            <div className="profile-small-label">
              ACCOUNT
            </div>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your Movie Explorer account
            </p>

          </div>

        </div>



        {/* MAIN PROFILE CARD */}

        <div className="profile-main-card">


          {/* PROFILE IMAGE */}

          <div className="profile-image-section">

            <div
              className="profile-image-wrapper"
              onClick={handleClick}
            >

              <img
                src={
                  previewImage ||
                  user?.photoURL ||
                  'https://www.w3schools.com/howto/img_avatar.png'
                }
                alt="Profile"
                className="profile-main-image"
              />


              <div className="profile-image-overlay">

                <FaCamera />

                <span>
                  Change Photo
                </span>

              </div>


              <div className="profile-camera-button">

                <FaCamera />

              </div>

            </div>


            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />


            <h2>
              {user?.displayName || 'Movie Explorer User'}
            </h2>


            <div className="profile-member-badge">

              <FaCircleCheck />

              <span>
                Active Member
              </span>

            </div>

          </div>



          {/* ACCOUNT INFORMATION */}

          <div className="profile-information">


            <div className="profile-section-title">

              <span>
                Account Information
              </span>

            </div>



            {/* EMAIL */}

            <div className="profile-info-box">

              <div className="profile-info-icon">

                <FaEnvelope />

              </div>


              <div className="profile-info-content">

                <span className="profile-info-label">
                  Email Address
                </span>


                <span className="profile-info-value">

                  {user?.email || 'No email available'}

                </span>

              </div>

            </div>



            {/* STATUS */}

            <div className="profile-info-box">

              <div className="profile-status-dot"></div>


              <div className="profile-info-content">

                <span className="profile-info-label">
                  Account Status
                </span>


                <span className="profile-info-value profile-active">
                  Active
                </span>

              </div>

            </div>



            {/* DESCRIPTION */}

            <div className="profile-description">

              <div className="profile-description-line"></div>

              <p>
                Welcome to Movie Explorer. Explore movies,
                discover new favorites and keep track of the
                films you enjoy.
              </p>

            </div>


          </div>

        </div>



        {/* NOT LOGGED IN */}

        {!user && (

          <div className="profile-login-message">

            <h2>
              You are not logged in
            </h2>

            <p>
              Please log in to view your profile.
            </p>

            <button
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>

          </div>

        )}

      </div>

    </div>

  );

};


export default Profile;
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaSun, FaMoon } from 'react-icons/fa';

import { useTheme } from '../context/ThemeContext';

import loginBackground from '../assets/login-bg.webp';

import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { darkMode, toggleTheme } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Login with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Get user information from Firestore
      // IMPORTANT: collection name is "users"
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('User data:', docSnap.data());
      } else {
        console.log('No user data found!');
      }

      // Go to home page
      navigate('/home');

    } catch (err) {
      console.error('LOGIN ERROR:', err);

      switch (err.code) {
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;

        case 'auth/user-not-found':
          setError('No account found with this email.');
          break;

        case 'auth/wrong-password':
          setError('Incorrect password.');
          break;

        case 'auth/invalid-credential':
          setError('Incorrect email or password.');
          break;

        case 'auth/too-many-requests':
          setError(
            'Too many failed attempts. Try again later.'
          );
          break;

        case 'permission-denied':
          setError('Firestore permission denied.');
          break;

        case 'failed-precondition':
          setError(
            'Firestore database is not configured correctly.'
          );
          break;

        default:
          setError(
            `Login failed: ${err.message || err.code}`
          );
      }
    }
  };

  return (
    <div
      className={`login-page ${
        darkMode ? 'login-dark' : 'login-light'
      }`}
      style={{
        '--login-background-image': `url(${loginBackground})`,
      }}
    >

      {/* =========================================
          BACKGROUND OVERLAY
          ========================================= */}
      <div className="login-background-overlay"></div>


      {/* =========================================
          NAVBAR
          ========================================= */}
      <nav className="login-navbar">

        <div
          className="login-brand"
          onClick={() => navigate('/')}
        >

          <div className="login-website-name">
            Movie Explorer
          </div>

          <div className="login-website-tagline">
            Discover Your Favorite Films
          </div>

        </div>


        {/* Theme Button */}
        <div className="login-navbar-actions">

          <button
            onClick={toggleTheme}
            className="theme-toggle-button"
            aria-label={
              darkMode
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
          >
            {darkMode ? (
              <FaSun />
            ) : (
              <FaMoon />
            )}
          </button>

        </div>

      </nav>


      {/* =========================================
          LOGIN CONTENT
          ========================================= */}
      <div className="login-content">

        <form
          onSubmit={handleLogin}
          className="login-form"
        >

          {/* Heading */}
          <div className="login-heading">

            <h2>
              Welcome Back
            </h2>

            <p>
              Log in to explore your favorite movies
            </p>

          </div>


          {/* =====================================
              EMAIL
              ===================================== */}
          <div className="input-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          {/* =====================================
              PASSWORD
              ===================================== */}
          <div className="input-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="password-input-container">

              <input
                id="password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >

                {showPassword ? (
                  <FiEye size={19} />
                ) : (
                  <FiEyeOff size={19} />
                )}

              </button>

            </div>

          </div>


          {/* =====================================
              LOGIN BUTTON
              ===================================== */}
          <button
            type="submit"
            className="login-submit-button"
          >
            Log In
          </button>


          {/* =====================================
              SIGN UP
              ===================================== */}
          <p className="signup-link">

            Don't have an account?{' '}

            <button
              type="button"
              onClick={() =>
                navigate('/signup')
              }
            >
              Sign Up
            </button>

          </p>


          {/* =====================================
              ERROR
              ===================================== */}
          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

        </form>

      </div>

    </div>
  );
};

export default Login;
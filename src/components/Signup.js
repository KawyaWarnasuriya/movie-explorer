import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaSun, FaMoon } from 'react-icons/fa';

import { useTheme } from '../context/ThemeContext';

import signupBackground from '../assets/signup-bg.jpg';

import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const { darkMode, toggleTheme } = useTheme();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Check password match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      // =========================================
      // CREATE FIREBASE AUTHENTICATION ACCOUNT
      // =========================================

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;


      // =========================================
      // SAVE USER INFORMATION IN FIRESTORE
      // IMPORTANT:
      // Collection name is "users"
      // =========================================

      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          email: user.email,
          createdAt: new Date().toISOString(),
        }
      );


      // =========================================
      // GO TO HOME PAGE
      // =========================================

      navigate('/');


    } catch (err) {
      console.error('SIGNUP ERROR:', err);

      switch (err.code) {

        case 'auth/email-already-in-use':
          setError(
            'This email is already registered.'
          );
          break;

        case 'auth/invalid-email':
          setError(
            'Please enter a valid email address.'
          );
          break;

        case 'auth/weak-password':
          setError(
            'Password should be at least 6 characters.'
          );
          break;

        case 'permission-denied':
          setError(
            'Firestore permission denied.'
          );
          break;

        case 'failed-precondition':
          setError(
            'Firestore database is not configured correctly.'
          );
          break;

        default:
          setError(
            `Signup failed: ${
              err.message || err.code
            }`
          );
      }
    }
  };

  return (
    <div
      className={`signup-page ${
        darkMode
          ? 'signup-dark'
          : 'signup-light'
      }`}
      style={{
        '--signup-background-image':
          `url(${signupBackground})`,
      }}
    >

      {/* =========================================
          BACKGROUND OVERLAY
          ========================================= */}
      <div className="signup-background-overlay"></div>


      {/* =========================================
          NAVBAR
          ========================================= */}
      <nav className="signup-navbar">

        <div
          className="signup-brand"
          onClick={() => navigate('/')}
        >

          <div className="signup-website-name">
            Movie Explorer
          </div>

          <div className="signup-website-tagline">
            Discover Your Favorite Films
          </div>

        </div>


        <div className="signup-navbar-actions">

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
          SIGNUP CONTENT
          ========================================= */}
      <div className="signup-content">

        <form
          onSubmit={handleSignup}
          className="signup-form"
        >

          {/* =====================================
              HEADING
              ===================================== */}
          <div className="signup-heading">

            <h2>
              Create Account
            </h2>

            <p>
              Sign up to explore your favorite movies
            </p>

          </div>


          {/* =====================================
              EMAIL
              ===================================== */}
          <div className="signup-input-group">

            <label htmlFor="signup-email">
              Email
            </label>

            <input
              id="signup-email"
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
          <div className="signup-input-group">

            <label htmlFor="signup-password">
              Password
            </label>

            <div className="signup-password-container">

              <input
                id="signup-password"
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
                className="signup-password-toggle"
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
              CONFIRM PASSWORD
              ===================================== */}
          <div className="signup-input-group">

            <label htmlFor="confirm-password">
              Confirm Password
            </label>

            <div className="signup-password-container">

              <input
                id="confirm-password"
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="signup-password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    (prev) => !prev
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
              >

                {showConfirmPassword ? (
                  <FiEye size={19} />
                ) : (
                  <FiEyeOff size={19} />
                )}

              </button>

            </div>

          </div>


          {/* =====================================
              SIGNUP BUTTON
              ===================================== */}
          <button
            type="submit"
            className="signup-submit-button"
          >
            Sign Up
          </button>


          {/* =====================================
              LOGIN LINK
              ===================================== */}
          <p className="login-link">

            Already have an account?{' '}

            <button
              type="button"
              onClick={() =>
                navigate('/login')
              }
            >
              Log In
            </button>

          </p>


          {/* =====================================
              ERROR
              ===================================== */}
          {error && (
            <p className="signup-error">
              {error}
            </p>
          )}

        </form>

      </div>

    </div>
  );
};

export default Signup;
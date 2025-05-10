import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import './Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Optional: fetch user data from Firestore
        const docRef = doc(db, 'user', user.uid);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          console.log("User data:", docSnap.data());
        } else {
          console.log("No user data found!");
        }
  
        navigate('/home'); 
      } catch (err) {
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
          case 'auth/too-many-requests':
            setError('Too many failed attempts. Try again later.');
            break;
          default:
            setError('Login failed. Please try again.');
        }
      }
    };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Log In</h2>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Log In</button>
        <p className="signup-link">Don't have an account? <a href="/signup">Sign Up</a></p>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;

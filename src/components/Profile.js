import React, { useState, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import ProfileIcon from './ProfileIcon'; // import profile icon
import './Profile.css';

const Profile = () => {
  const [user] = useAuthState(auth);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleClick = () => {
    fileInputRef.current.click(); // trigger hidden file input
  };

  return (
    <div className="profile-container">
      <div className="top-header">
        <h2>User Profile</h2>
        <div className="profile-icon-wrapper">
          <ProfileIcon />
        </div>
      </div>

      <div className="profile-card">
        {user ? (
          <div className="profile-info">
            <div className="image-wrapper" onClick={handleClick}>
              <img
                src={
                  previewImage ||
                  user.photoURL ||
                  'https://www.w3schools.com/howto/img_avatar.png'
                }
                alt="Profile"
                className="profile-image"
              />
              <div className="overlay">
                <span className="plus-icon">+</span>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <p><strong>Email:</strong> {user.email}</p>
            
          </div>
        ) : (
          <p className="not-logged">You are not logged in.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;

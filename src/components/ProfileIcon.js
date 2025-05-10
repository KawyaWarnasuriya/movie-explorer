import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import './ProfileIcon.css';

function ProfileIcon() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [authUser] = useAuthState(auth);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const firstLetter = authUser?.email?.charAt(0).toUpperCase() || '?';

  return (
    <div className="profile-menu">
      <div className="profile-icon" onClick={() => setOpen(!open)}>
        {firstLetter}
      </div>
      {open && (
        <div className="dropdown">
          <div onClick={() => navigate('/home')}>Home</div>
          <div onClick={() => navigate('/profile')}>Profile</div>
          <div onClick={() => navigate('/favorites')}>Favorites</div>
          <div onClick={() => navigate('/history')}>History</div>
          <div onClick={handleLogout}>Logout</div>
        </div>
      )}
    </div>
  );
}

export default ProfileIcon;

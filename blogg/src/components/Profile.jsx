import React from 'react';
import { useLocation } from 'react-router-dom';

const Profile = () => {
  const location = useLocation();
  const { email } = location.state || {}; 

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Welcome to your profile!</p>
      {email && <p>Email: {email}</p>}
    </div>
  );
};

export default Profile;

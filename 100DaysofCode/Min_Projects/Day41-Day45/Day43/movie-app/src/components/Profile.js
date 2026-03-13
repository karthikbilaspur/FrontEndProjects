import React, { useState, useEffect } from 'react';
import { auth } from '../utils/firebase';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="profile">
      <h1>Profile</h1>
      {user && (
        <div>
          <p>Email: {user.email}</p>
          // Add more user profile details here
        </div>
      )}
    </div>
  );
};

export default Profile;
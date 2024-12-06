import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Identifier.css'; // Optional: Add styles for the component

const Identifier = () => {
  const [user, setUser] = useState(null); // To store the user data
  const [loading, setLoading] = useState(true); // To manage the loading state
  const [error, setError] = useState(null); // To manage errors

  // Fetch the user credentials when the component loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId'); // Get session ID from localStorage
        if (!sessionId) {
          setError('Session ID not found. Please log in.');
          setLoading(false);
          return;
        }

        // Fetch user data from the backend
        const response = await axios.get('http://localhost:8080/api/user/me', {
          headers: {
            Authorization: `Session ${sessionId}`, // Attach session ID as header
          },
        });

        setUser(response.data); // Set the user data in state
        setLoading(false); // Stop loading spinner
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data.');
        setLoading(false); // Stop loading spinner
      }
    };

    fetchUserData();
  }, []);

  // Display loading, error, or user information
  return (
    <div className="identifier-container">
      {loading ? (
        <p>Loading user data...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : user ? (
        <div className="user-info">
          <h3>Welcome, {user.username}!</h3>
          <p><strong>User ID:</strong> {user.user_id}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p>No user logged in.</p>
      )}
    </div>
  );
};

export default Identifier;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';

const SessionDescription = () => {
  const { session_id } = useParams(); // Retrieve session_id from the URL
  const [session, setSession] = useState(null); // Store session data
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(''); // Store error messages

  // Fetch session data
  const fetchSession = async () => {
    try {
      console.log(`Fetching session with ID: ${session_id}`);
      const response = await axios.get(`https://details-server.onrender.com/sessions/${session_id}`);
      // const response = await axios.get(`http://localhost:5590/sessions/${session_id}`);
      setSession(response.data); // Store fetched session data
      setLoading(false); // Set loading to false
      setError(''); // Clear error state
    } catch (err) {
      console.error('Error fetching session:', err);
      setError(err.response?.data?.error || 'Failed to fetch session data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [session_id]);

  // Render loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Render session description
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card style={{ maxWidth: '600px', padding: '16px', backgroundColor: '#f9f9f9' }}>
        <CardContent>
        <Typography variant="h6" gutterBottom>
              About the Session
            </Typography>


          {/* Session Description */}
          <Typography variant="body1" color="textSecondary" gutterBottom>
            {session.description || 'No description available for this session.'}
          </Typography>


          {/* Creator Details */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              About the Creator
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Username:</strong> {session.creator_username}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Bio:</strong> {session.creator_bio || 'No bio available.'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SessionDescription;
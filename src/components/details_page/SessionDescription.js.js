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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ backgroundColor: '#f4f6f9' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ backgroundColor: '#f4f6f9' }}
      >
        <Typography color="error" variant="body1" sx={{ textAlign: 'center', fontSize: '1rem', marginTop:'7rem' }}>
          {error}
        </Typography>
      </Box>
    );
  }

  // Render session description
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start" // Align to top
      minHeight="50vh"
      sx={{ backgroundColor: '#f4f6f9', padding: '0rem', paddingTop: '1.5rem' }}
    >
      <Card
        sx={{
          width: { xs: '100%', sm: '600px' }, // 90% width for screens below 500px, otherwise 600px
          padding: '1rem',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
        }}
      >
        <CardContent>
          {/* Session Description */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize:'1.3rem',
              color: '#333333',
              marginBottom: '16px',
              borderBottom: '2px solid #4caf50',
              paddingBottom: '0px',
            }}
          >
            About the Session
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom sx={{ lineHeight: '1.6' }}>
            {session.description || 'No description available for this session.'}
          </Typography>

          {/* Creator Details */}
          <Box mt={4}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontSize:'1.3rem',
                fontWeight: 'bold',
                color: '#333333',
                marginBottom: '16px',
                borderBottom: '2px solid #2196f3',
                paddingBottom: '0px',
              }}
            >
              About the Creator
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ marginBottom: '8px', lineHeight: '1.6' }}>
              <strong>Username:</strong> {session.creator_username}
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ lineHeight: '1.6' }}>
              <strong>Bio:</strong> {session.creator_bio || 'No bio available.'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SessionDescription;
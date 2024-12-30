import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Grid, Typography, Card, CardContent, Box } from '@mui/material';
import { AccessTime, Person } from '@mui/icons-material';

const MyHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch sessionId from localStorage
  const sessionId = localStorage.getItem('sessionId');

  // Helper function to convert YouTube URLs to embed format
  const convertToEmbedURL = (url) => {
    let videoId = '';

    if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1];
    } else if (url.includes('youtube.com/watch')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  // Helper function to format time to AM/PM in local time
  const formatTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes, seconds || 0);

    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  // Helper function to check if the session has ended
  const hasSessionEnded = (date, endTime) => {
    const datePart = new Date(date);
    const [hours, minutes] = endTime.split(':').map(Number);
    datePart.setHours(hours, minutes, 0);

    const now = new Date();
    return now >= datePart;
  };

  // Fetch past sessions from API
  const fetchPastSessions = async () => {
    if (!sessionId) {
      setError('No sessionId found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5567/api/booked-sessions', {
        headers: {
          Authorization: `Session ${sessionId}`, // Use sessionId in the header
        },
      });

      // Filter sessions to only include past sessions
      const pastSessions = response.data
        .filter((session) => hasSessionEnded(session.date, session.end_time))
        .map((session) => ({
          ...session,
          video_url: convertToEmbedURL(session.video_url),
          start_time: formatTime(session.start_time),
          end_time: formatTime(session.end_time),
          date: new Date(session.date).toLocaleDateString('en-US'),
        }));

      setSessions(pastSessions);
      setError(''); // Reset error on success
    } catch (error) {
      console.error('Error fetching sessions:', error.response?.data || error.message);
      setError('Failed to fetch past sessions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastSessions();
  }, [sessionId]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'flex-start', // Align items to the top
        minHeight: '100vh',
        width: sessions.length === 0 ? '100%' : { xs: '100%', sm: '80%', md: '70%', lg: '60%' }, // Responsive width based on session availability
        margin: '0 auto', // Center the box horizontally on the screen
        padding: '10px', // Add padding
        backgroundColor: '#f5f5f5', // Light background for better contrast
        overflow: 'hidden', // Prevent horizontal scrolling within the box
      }}
      style={{ marginBottom: '4rem' }}
    >
      <Box sx={{ width: '100%' }}>
        {loading && (
          <Typography sx={{ textAlign: 'center', marginBottom: '20px' }}>Loading...</Typography>
        )}

        {sessions.length === 0 && !error && !loading && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              height: '400px',
              padding: '20px',
            }}
          >
            <Typography variant="h5" sx={{ color: '#666', marginTop: '20px' }}>
              No past sessions found
            </Typography>
          </Box>
        )}

        {error && (
          <div style={{ textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
            <Button variant="contained" onClick={fetchPastSessions}>
              Retry
            </Button>
          </div>
        )}

        {sessions.length > 0 && (
          <Grid container spacing={3}>
            {sessions.map((session, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    backgroundColor: '#ffffff',
                    boxShadow: '0px 3px 15px rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      {/* Video Container */}
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            position: 'relative',
                            paddingTop: '56.25%',
                            width: '100%',
                            borderRadius: 1,
                            overflow: 'hidden',
                            marginBottom: '15px',
                          }}
                        >
                          <iframe
                            src={session.video_url}
                            title={session.session_title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                            }}
                          />
                        </Box>
                      </Grid>

                      {/* Details and Buttons */}
                      <Grid item xs={12}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                          {session.session_title}
                        </Typography>

                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                          <Person sx={{ marginRight: '8px', color: '#666' }} />
                          Created by: {session.full_name || session.username}
                        </Typography>

                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                          <AccessTime sx={{ marginRight: '8px', color: '#666' }} />
                          Start Time: {session.date} {session.start_time}
                        </Typography>

                        <Typography sx={{ color: '#888', textAlign: 'center', marginTop: '10px' }}>
                          Thank You For Attending The Session.
                        </Typography>

                        <Button
                          fullWidth
                          variant="contained"
                          className="rate-button"
                          sx={{
                            backgroundColor: '#ffc107',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#e0a800',
                            },
                            marginTop: '10px',
                          }}
                        >
                          Rate Session
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default MyHistory;
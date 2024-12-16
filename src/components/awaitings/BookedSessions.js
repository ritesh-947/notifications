import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Grid, Typography, Card, CardContent, Box } from '@mui/material';
import { AccessTime, Person, HourglassEmpty } from '@mui/icons-material'; // Added HourglassEmpty icon for Time Left
import './BookedSessions.css'; // Custom CSS

const BookedSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:5567', // Backend API base URL
  });

  axiosInstance.interceptors.request.use((config) => {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      config.headers['Authorization'] = `Session ${sessionId}`;
    }
    return config;
  });

  const calculateTimeLeft = (date, startTime) => {
    console.log('[DEBUG] calculateTimeLeft called with:', { date, startTime });

    const sessionDateTime = new Date(date);
    const now = new Date();

    if (isNaN(sessionDateTime)) {
      console.error('[ERROR] Invalid sessionDateTime:', sessionDateTime);
      return 'Invalid date or time';
    }

    console.log('[DEBUG] Parsed sessionDateTime:', sessionDateTime);
    console.log('[DEBUG] Current time (now):', now);

    const difference = sessionDateTime - now;
    console.log('[DEBUG] Time difference in ms:', difference);

    if (difference <= 0) {
      console.warn('[WARN] Session already started or invalid time difference:', difference);
      return 'Session started!';
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    console.log('[DEBUG] Calculated hours:', hours, 'Calculated minutes:', minutes);

    return `${hours} Hr ${minutes} Min`;
  };

  useEffect(() => {
    const fetchBookedSessions = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get(`/api/booked-sessions`);
        const formattedSessions = response.data.map((session) => ({
          ...session,
          time_left: calculateTimeLeft(session.date, session.start_time),
        }));
        setSessions(formattedSessions);
      } catch (error) {
        console.error('[ERROR] Failed to fetch booked sessions:', error);
        setError('Failed to fetch booked sessions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSessions();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1, marginTop:3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Booked Sessions
      </Typography>

      {loading && <Typography>Loading sessions...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && sessions.length === 0 && <Typography>No sessions booked yet.</Typography>}

      <Grid container spacing={3} justifyContent="center">
        {sessions.map((session, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                {/* Session Title */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {session.session_title}
                </Typography>

                {/* Video Preview */}
                {session.video_url && (
                  <Box sx={{ position: 'relative', paddingBottom: '56.25%', mb: 2 }}>
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
                )}

                {/* Creator Username */}
                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Person sx={{ mr: 1, color: 'grey.600' }} />
                  Creator: {session.creator_username || 'Unknown'}
                </Typography>

                {/* Date */}
                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTime sx={{ mr: 1, color: 'grey.600' }} />
                  Date: {new Date(session.date).toLocaleDateString('en-US')}
                </Typography>

                {/* Start Time */}
                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTime sx={{ mr: 1, color: 'grey.600' }} />
                  Start Time: {session.start_time}
                </Typography>

                {/* Time Left */}
                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <HourglassEmpty sx={{ mr: 1, color: 'grey.600' }} />
                  Time Left: {session.time_left}
                </Typography>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                  {/* About Session Button */}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => console.log('About session clicked', session.booking_id)}
                  >
                    About Session
                  </Button>

                  {/* Join Session Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => window.location.href = `http://localhost:5555/room/${session.booking_id}`}
                    disabled={session.time_left === 'Session started!'}
                  >
                    Join Session
                  </Button>

                  {/* Rate Session Button */}
                  {session.time_left === 'Session started!' && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => console.log('Rate session clicked', session.booking_id)}
                    >
                      Rate Session
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BookedSessions;
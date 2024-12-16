import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Grid, Typography, Card, CardContent, Box } from '@mui/material';
import { AccessTime, Person, HourglassEmpty } from '@mui/icons-material';
import moment from 'moment-timezone'; // Import moment-timezone
import './BookedSessions.css';

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

  // Calculate time left
  const calculateTimeLeft = (date, startTime) => {
    const sessionDateTime = moment.tz(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata');
    const now = moment.tz('Asia/Kolkata');
    const difference = sessionDateTime.diff(now);

    if (difference <= 0) {
      return 'Session started!';
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} Hr ${minutes} Min`;
  };

  // Determine if the session is joinable
  const isJoinable = (date, startTime, endTime) => {
    const sessionStart = moment.tz(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata');
    const sessionEnd = moment.tz(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata');
    const now = moment.tz('Asia/Kolkata');
    const joinableStart = sessionStart.clone().subtract(5, 'minutes');

    return now.isBetween(joinableStart, sessionEnd);
  };

  // Fetch booked sessions
  useEffect(() => {
    const fetchBookedSessions = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get(`/api/booked-sessions`);
        const formattedSessions = response.data.map((session) => ({
          ...session,
          time_left: calculateTimeLeft(session.date, session.start_time),
          is_joinable: isJoinable(session.date, session.start_time, session.end_time),
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1, marginTop: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'blue' }}>
        Booked Sessions
      </Typography>

      {loading && <Typography>Loading sessions...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && sessions.length === 0 && <Typography>No sessions booked yet.</Typography>}

      <Grid container spacing={3} justifyContent="center">
        {sessions.map((session, index) => (
          <Grid item xs={12} sm={6} md={5} key={index}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundColor: '#f9f9f9',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  paddingBottom: '56.25%', // Maintain 16:9 aspect ratio
                  backgroundColor: '#000',
                  overflow: 'hidden',
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

              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {session.session_title}
                </Typography>

                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 0.7 }}>
                  <Person sx={{ mr: 1 }} />
                  Creator: {session.creator_username || 'Unknown'}
                </Typography>

                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 0.7 }}>
                  <AccessTime sx={{ mr: 1 }} />
                  Date: {moment(session.date).format('DD/MM/YYYY')}
                </Typography>

                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 0.7 }}>
                  <AccessTime sx={{ mr: 1 }} />
                  Start Time: {session.start_time}
                </Typography>

                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 0.7 }}>
                  <HourglassEmpty sx={{ mr: 1 }} />
                  Time Left: {session.time_left}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => console.log('About session clicked', session.booking_id)}
                  >
                    About Session
                  </Button>

                  {session.is_joinable ? (
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: 'green', color: 'white', '&:hover': { backgroundColor: '#005500' } }}
                      onClick={() => window.location.href = `http://localhost:5555/room/${session.booking_id}`}
                    >
                      Join Session
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      disabled
                      sx={{ backgroundColor: 'gray', color: 'white' }}
                    >
                      Not Joinable
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
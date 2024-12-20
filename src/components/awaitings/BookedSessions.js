import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AccessTime, Person, HourglassEmpty } from '@mui/icons-material';
import moment from 'moment-timezone'; // Import moment-timezone
import { useNavigate } from 'react-router-dom'; // For navigation
import InfoIcon from '@mui/icons-material/Info';
import './BookedSessions.css';

const BookedSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate(); // React Router hook for navigation

  // Axios instance
  const axiosInstance = axios.create({
    // baseURL: 'http://localhost:5567', // Backend API base URL
    baseURL: 'https://awaiting-server.onrender.com', // Backend API base URL
  });

  // Dialog open/close handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Axios interceptor to add session ID
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
    return now.isBetween(sessionStart, sessionEnd);
  };

  // Determine if the session has ended
  const hasSessionEnded = (date, endTime) => {
    const sessionEnd = moment.tz(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata');
    const now = moment.tz('Asia/Kolkata');
    return now.isAfter(sessionEnd);
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
          has_ended: hasSessionEnded(session.date, session.end_time),
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1, marginTop: 5.7 }}>
      <Typography variant="h5" component="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
        Booked Sessions
        <Button
          variant="outlined"
          startIcon={<InfoIcon />}
          onClick={handleOpen}
          sx={{
            textTransform: 'none',
            borderColor: 'blue',
            color: 'blue',
            '&:hover': { backgroundColor: '#e8f0fe', borderColor: 'blue' },
          }}
        >
          Info
        </Button>
      </Typography>

      {/* Info Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Important Information</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>0.</strong> Sessions Are Not Cancellable!
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>1.</strong> You Can Join Sessions Just Before 5 Minutes Of Start Time!
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            <strong>2.</strong> If Missed To Attend, Contact Creator for Rescheduling with Same Room ID!
          </Typography>
          <Typography variant="body1">
            <strong>3.</strong> Thank You for Choosing WanLoft!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {loading && <Typography>Loading sessions...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && sessions.length === 0 && <Typography>No sessions booked yet.</Typography>}

      <Grid container spacing={3} justifyContent="center">
        {sessions.map((session, index) => (
          <Grid item xs={12} sm={6} md={5} key={index}>
            <Card
              sx={{
                boxShadow: 2,
                borderRadius: '8px',
                overflow: 'hidden',
                padding: 1.5,
                margin: '10px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <CardContent sx={{ padding: '16px' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {session.session_title}
                </Typography>

                {/* Display video link */}
                <Typography sx={{ mb: 1 }}>
                  <strong>Video Link:</strong>{' '}
                  <a
                    href={session.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#1976d2', textDecoration: 'underline' }}
                  >
                    {session.video_url}
                  </a>
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
                  {session.has_ended ? 'Session Ended' : `Time Left: ${session.time_left}`}
                </Typography>

                {/* Show Room ID */}
                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 0.7 }}>
                  <HourglassEmpty sx={{ mr: 1 }} />
                  Room ID: {session.room_id || 'Not Assigned'}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                  {!session.has_ended && (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: session.is_joinable ? 'green' : 'gray',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: session.is_joinable ? '#005500' : 'gray',
                        },
                      }}
                      disabled={!session.is_joinable}
                      onClick={() => navigate(`/room/${session.room_id}`)}
                    >
                      {session.is_joinable ? 'Join Session' : 'Not Joinable'}
                    </Button>
                  )}

                  {session.has_ended && (
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: '#FFDE21', color: 'black', '&:hover': { backgroundColor: '#003d99' } }}
                      onClick={() => navigate(`/session/${session.booking_id}/rate`)}
                    >
                      Rate Session
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(`/session/${session.booking_id}`)}
                  >
                    About Session
                  </Button>
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
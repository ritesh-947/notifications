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
import { AccessTime, Person, HourglassEmpty, Timer } from '@mui/icons-material';
import moment from 'moment-timezone';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CreatorBookedSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [displayUpcoming, setDisplayUpcoming] = useState(true); // Toggle state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedThoughts, setSelectedThoughts] = useState('');
  const navigate = useNavigate(); // Initialize navigate for React Router

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:5567', // Backend API base URL
  });

  const handleOpenThoughts = (thoughts) => {
    setSelectedThoughts(thoughts || 'No thoughts provided.');
    setOpen(true);
  };

  const handleCloseThoughts = () => setOpen(false);

  axiosInstance.interceptors.request.use((config) => {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      config.headers['Authorization'] = `Session ${sessionId}`;
    }
    return config;
  });

  const fetchCreatorSessions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/api/creator/booked-sessions');
      const now = moment.tz('Asia/Kolkata');
      const oneWeekAgo = now.clone().subtract(7, 'days');

      // Classify sessions
      const upcoming = [];
      const past = [];

      response.data.forEach((session) => {
        const sessionEnd = moment.tz(`${session.date} ${session.end_time}`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata');

        if (sessionEnd.isBefore(now)) {
          if (sessionEnd.isAfter(oneWeekAgo)) {
            past.push(session);
          }
        } else {
          upcoming.push(session);
        }
      });

      setUpcomingSessions(upcoming);
      setPastSessions(past);
    } catch (error) {
      console.error('[ERROR] Failed to fetch creator sessions:', error);
      setError('Failed to fetch sessions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = (date, startTime) => {
    const sessionStart = moment.tz(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata');
    const now = moment.tz('Asia/Kolkata');
    const difference = sessionStart.diff(now);

    if (difference <= 0) {
      return 'Session started!';
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} Hr ${minutes} Min`;
  };

  useEffect(() => {
    fetchCreatorSessions();
  }, []);

  const renderSessions = (sessions) => (
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
                {session.session_title || 'Untitled Session'}
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
                Attendee: {session.attendee_username || 'Unknown'}
              </Typography>

              <Typography sx={{ display: 'flex', alignItems: 'center', mb: 0.7 }}>
                <AccessTime sx={{ mr: 1 }} />
                Date: {moment(session.date).format('DD/MM/YYYY')}
              </Typography>

              <Typography sx={{ display: 'flex', alignItems: 'center', mb: 0.7 }}>
                <AccessTime sx={{ mr: 1 }} />
                Start Time: {session.start_time}
              </Typography>

              {/* Display Time Left */}
              <Typography sx={{ display: 'flex', alignItems: 'center', mb: 0.7 }}>
                <Timer sx={{ mr: 1 }} />
                Time Left: {calculateTimeLeft(session.date, session.start_time)}
              </Typography>

              {/* Display Room ID */}
              <Typography sx={{ display: 'flex', alignItems: 'center', mb: 0.7 }}>
                <HourglassEmpty sx={{ mr: 1 }} />
                Room ID: <strong>{session.room_id}</strong>
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: session.joinable ? '#4caf50' : '#d3d3d3',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: session.joinable ? '#388e3c' : '#d3d3d3',
                    },
                  }}
                  disabled={!session.joinable}
                    onClick={() => navigate(`/room/${session.room_id}`)} // Use navigate for room navigation

                >
                  {session.joinable ? 'Join Session' : 'Not Joinable'}
                </Button>

                <Button
                  variant="outlined"
                  sx={{
                    color: '#1976d2',
                    borderColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#f0f8ff',
                      borderColor: '#005bb5',
                    },
                  }}
                  onClick={() => handleOpenThoughts(session.thoughts)}
                >
                  Read Thoughts
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1, marginTop: 5.7 }}>
      <Typography variant="h5" component="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
        Sessions Booked by Attendees
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant={displayUpcoming ? 'contained' : 'outlined'}
          onClick={() => setDisplayUpcoming(true)}
          sx={{ mr: 2 }}
        >
          Upcoming Sessions
        </Button>
        <Button
          variant={!displayUpcoming ? 'contained' : 'outlined'}
          onClick={() => setDisplayUpcoming(false)}
        >
          Past Sessions
        </Button>
      </Box>

      {loading && <Typography>Loading sessions...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <>
          {displayUpcoming && renderSessions(upcomingSessions)}
          {!displayUpcoming && renderSessions(pastSessions)}
        </>
      )}

      <Dialog open={open} onClose={handleCloseThoughts}>
        <DialogTitle>Thoughts</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {selectedThoughts}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseThoughts} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreatorBookedSessions;
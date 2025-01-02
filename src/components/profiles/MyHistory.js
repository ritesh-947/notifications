import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import { AccessTime, Person } from '@mui/icons-material';
import moment from 'moment-timezone';
import { useNavigate } from 'react-router-dom';

const MyHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Axios instance
  const axiosInstance = axios.create({
    // baseURL: 'http://localhost:5567', // Replace with your backend API base URL
    baseURL: 'https://awaiting-server.onrender.com', // Replace with your backend API base URL
  });

  // Axios interceptor to add session ID
  axiosInstance.interceptors.request.use((config) => {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      config.headers['Authorization'] = `Session ${sessionId}`;
    }
    return config;
  });

  // Determine if the session has ended
  const hasSessionEnded = (date, endTime) => {
    const sessionEnd = moment.tz(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata');
    const now = moment.tz('Asia/Kolkata');
    return now.isAfter(sessionEnd);
  };

  // Fetch attended sessions
  useEffect(() => {
    const fetchAttendedSessions = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get(`/api/booked-sessions`);
        const attendedSessions = response.data.filter((session) =>
          hasSessionEnded(session.date, session.end_time)
        );

        setSessions(attendedSessions);
      } catch (error) {
        console.error('[ERROR] Failed to fetch attended sessions:', error);
        setError('Failed to fetch attended sessions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendedSessions();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1, marginTop: -2.7 }} style={{ marginBottom: '4rem' }}>
     
      {loading && <Typography>Loading sessions...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && sessions.length === 0 && <Typography>No attended sessions found.</Typography>}

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

                <Typography sx={{ color: '#888', textAlign: 'center', mt: 2 }}>
                  Thank you for attending this session.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#FFDE21', color: 'black', '&:hover': { backgroundColor: '#003d99' } }}
                    onClick={() => navigate(`/session/${session.booking_id}/rate`)}
                  >
                    Rate Session
                  </Button>

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

export default MyHistory;
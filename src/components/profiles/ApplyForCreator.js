import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CheckCircle, Star } from '@mui/icons-material';

const ApplyForCreator = () => {
  const [loading, setLoading] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      const sessionId = localStorage.getItem('sessionId');

      if (!sessionId) {
        setErrorMessage('You need to log in to view this page.');
        setCheckingRole(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:8084/user-role', {
          headers: {
            Authorization: `Session ${sessionId}`,
          },
        });

        setIsCreator(response.data.role === 'creator');
      } catch (error) {
        console.error('Error fetching user role:', error.message);
        setErrorMessage('Failed to check user role. Please try again.');
      } finally {
        setCheckingRole(false);
      }
    };

    fetchUserRole();
  }, []);

  const applyForCreator = async () => {
    const sessionId = localStorage.getItem('sessionId');

    if (!sessionId) {
      setErrorMessage('You need to log in to apply as a creator.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post(
        'http://localhost:8084/apply-creator',
        {}, // No request body required
        {
          headers: {
            Authorization: `Session ${sessionId}`,
          },
        }
      );

      setSuccessMessage(response.data.message || 'You are now a creator!');
      setIsCreator(true); // Update role locally
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || 'An error occurred. Please try again later.';
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (checkingRole) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <CircularProgress size={24} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Checking your role...
        </Typography>
      </Container>
    );
  }

  if (isCreator) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          You are already a creator!
        </Typography>
        <Typography variant="body1">
          Explore your creator dashboard to manage your sessions and reach your audience.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Apply to Become a Creator
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Unlock your potential by becoming a creator on our platform! Share your expertise,
        host sessions, and connect with an engaged audience. Here are some benefits of being a creator:
      </Typography>

      <Box sx={{ mb: 3 }}>
        <List>
          <ListItem>
            <ListItemIcon>
              <Star color="primary" />
            </ListItemIcon>
            <ListItemText primary="Monetize your skills and knowledge by hosting sessions." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Star color="primary" />
            </ListItemIcon>
            <ListItemText primary="Grow your personal brand and reach a global audience." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Star color="primary" />
            </ListItemIcon>
            <ListItemText primary="Engage directly with your followers and participants." />
          </ListItem>
        </List>
      </Box>

      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

      <Button
        variant="contained"
        color="primary"
        onClick={applyForCreator}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Apply Now'}
      </Button>
    </Container>
  );
};

export default ApplyForCreator;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Grid, Avatar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileDescription = () => {
  const [expanded, setExpanded] = useState(false);
  const [profileData, setProfileData] = useState(null); // State to hold profile data
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Function to fetch profile data
  const fetchProfileData = async () => {
    const sessionId = localStorage.getItem('sessionId'); // Retrieve sessionId from localStorage
    if (!sessionId) {
      console.error('[ERROR] No sessionId found in localStorage.');
      setError('Please log in to access your profile.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('https://profile-server-2eky.onrender.com/myprofile', {
      // const response = await axios.get('http://localhost:8082/myprofile', {
        headers: {
          Authorization: `Session ${sessionId}`, // Pass sessionId in Authorization header
        },
      });
      setProfileData(response.data); // Set profile data from the response
      setError('');
    } catch (err) {
      console.error('[ERROR] Fetching profile data failed:', err.response?.data || err.message);
      setError('Failed to fetch profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const navigateToBecomeCreator = () => {
    navigate('/become-creator');
  };


  // Fetch profile data when the component mounts
  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <Typography variant="h6" color="textSecondary">
        Loading...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ width: '100%', p: 0 }}>
      <Grid container justifyContent="flex-end" sx={{ width: '100%', pl: '0px' }}>
        <Grid item xs={12} sm={18} md={15} lg={18} xl={57}>
          <Box sx={{ width: { xs: '100%', sm: '96%' }, ml: { xs: 0, sm: 2 }, mt: 1 }}>
            <Card sx={{ boxShadow: 4, borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', mt: -8 }}>
                <Avatar alt={profileData?.full_name || 'Profile Avatar'} />
              </Box>
              <CardContent sx={{ pt: 5, textAlign: 'left' }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1.2rem' }}>
                  {profileData?.full_name || 'Full Name'}
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 1, fontSize: '1rem' }}>
                  {expanded
                    ? profileData?.bio || 'Loading...'
                    : (profileData?.bio?.substring(0, 100) || 'Loading...') + '...'}
                </Typography>
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{ mt: 2, cursor: 'pointer', fontWeight: 'medium' }}
                  onClick={toggleExpanded}
                >
                  {expanded ? 'Show less' : 'Show more'}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProfileDescription;
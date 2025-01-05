import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Grid, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUsers, faPlay, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import UserBio from './UserBio'; // Import the UserBio component
import UserSessions from './UserSessions';

const UserProfile = () => {
  const { username } = useParams(); // Get the username from the URL parameters
  const [profileData, setProfileData] = useState(null); // User profile data
  const [isFollowing, setIsFollowing] = useState(false); // Following status
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const sessionId = localStorage.getItem('sessionId'); // Fetch sessionId from localStorage

  // Fetch profile data and follow status
  const fetchProfileData = async () => {
    setLoading(true); // Set loading to true before the fetch

    if (!sessionId) {
      setError('You must be logged in to view profiles.');
      setLoading(false);
      return;
    }

    try {
      // Fetch user profile data
      const profileResponse = await axios.get(`https://profile-server-ym9x.onrender.com/api/user-profile/${username}`, {
    //   const profileResponse = await axios.get(`http://localhost:8083/api/user-profile/${username}`, {
        headers: {
          Authorization: `Session ${sessionId}`,
        },
      });

      // Set profile data
      setProfileData(profileResponse.data);

      // Fetch follow status
      const followStatusResponse = await axios.get(`https://profile-server-ym9x.onrender.com/api/follow-status/${username}`, {
    //   const followStatusResponse = await axios.get(`http://localhost:8083/api/follow-status/${username}`, {
        headers: {
          Authorization: `Session ${sessionId}`,
        },
      });

      // Set follow status
      setIsFollowing(followStatusResponse.data.isFollowing);
      setError(null); // Clear error
    } catch (err) {
      console.error('[ERROR] Fetching profile data or follow status:', err);
      if (err.response?.status === 404) {
        setError('User profile not found.');
      } else {
        setError('An error occurred while fetching profile data.');
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [username]);

  const handleFollow = async () => {
    try {
      await axios.post(
        `https://profile-server-ym9x.onrender.com/api/follow/${username}`,
        // `http://localhost:8083/api/follow/${username}`,
        {},
        {
          headers: {
            Authorization: `Session ${sessionId}`,
          },
        }
      );
      setIsFollowing(true);
      setProfileData((prev) => ({
        ...prev,
        followers_count: prev.followers_count + 1,
      }));
    } catch (err) {
      console.error('[ERROR] Following user:', err);
      setError('Failed to follow the user.');
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.post(
        `https://profile-server-ym9x.onrender.com/api/unfollow/${username}`,
        // `http://localhost:8083/api/unfollow/${username}`,
        {},
        {
          headers: {
            Authorization: `Session ${sessionId}`,
          },
        }
      );
      setIsFollowing(false);
      setProfileData((prev) => ({
        ...prev,
        followers_count: prev.followers_count - 1,
      }));
    } catch (err) {
      console.error('[ERROR] Unfollowing user:', err);
      setError('Failed to unfollow the user.');
    }
  };

  if (loading) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 5 }}>
        Loading...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" align="center" color="error" sx={{ mt: 5 }}>
        {error}
      </Typography>
    );
  }

  const isCreator = profileData.role === 'creator';

  return (
    <Grid container justifyContent="center" sx={{ mt: 5 }}>
      <Grid item xs={12} md={8}>
        <Box sx={{ p: 0, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 'none' }}>
          <Card sx={{ boxShadow: 'none' }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'nowrap', // Prevent wrapping
                  mb: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: isCreator ? '#4caf50' : '#2196f3',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mr: 1,
                      minWidth: 60, // Prevent squeezing
                      minHeight: 60, // Prevent squeezing
                      maxWidth: 60, // Ensure consistent size
                      maxHeight: 60, // Ensure consistent size
                    }}
                  >
                    <FontAwesomeIcon icon={faStar} style={{ color: '#fff', fontSize: '24px' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" noWrap>
                      {profileData.full_name || 'User Name'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      @{profileData.username}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                {isFollowing ? (
  <Button
    variant="outlined"
    color="success"
    onClick={handleUnfollow}
    sx={{
      minWidth: '40px',
      height: '40px',
      borderRadius: '50%',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: 'success.main',
      color: 'success.main',
    }}
  >
    <FontAwesomeIcon icon={faCheck} />
  </Button>
) : (
  <Button
    variant="outlined"
    color="primary"
    onClick={handleFollow}
    sx={{
      minWidth: '40px',
      height: '40px',
      borderRadius: '50%',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: 'primary.main',
      color: 'primary.main',
    }}
  >
    <FontAwesomeIcon icon={faPlus} />
  </Button>
)}
                </Box>
              </Box>
              <Grid container spacing={2} sx={{ textAlign: 'center', mb: 4 }}>
                <Grid item xs={4}>
                  <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    {profileData.followers_count} Followers
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    {profileData.following_count} Following
                  </Typography>
                </Grid>
                {isCreator && (
                  <Grid item xs={4}>
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                      {profileData.session_count || 0} Sessions
                    </Typography>
                  </Grid>
                )}
              </Grid>
              
              {/* Integrate UserBio component */}
              <UserBio bio={profileData.bio} />
            </CardContent>
          </Card>
        </Box>
      </Grid>
      <UserSessions />
    </Grid>
    
  );
};

export default UserProfile;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Grid, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUsers, faPlay } from '@fortawesome/free-solid-svg-icons';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch sessionId from localStorage
    const sessionId = localStorage.getItem('sessionId');

    // Function to fetch profile data using sessionId
    const fetchProfileData = async () => {
        if (!sessionId) {
            console.error('[ERROR] No sessionId found in localStorage.');
            setError('No session found. Please log in.');
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
            console.log('[INFO] Profile data fetched:', response.data);
            setProfileData(response.data);
            setError('');
        } catch (error) {
            console.error('[ERROR] Fetching profile data:', error.response || error.message);
            if (error.response?.status === 404) {
                setError('User profile not found.');
            } else if (error.response?.status === 401) {
                setError('Unauthorized. Please log in again.');
            } else {
                setError('Failed to fetch profile data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch profile data on component mount
    useEffect(() => {
        fetchProfileData();
    }, []);

    // Handle Edit Profile navigation
    const handleEditClick = () => {
        navigate('/edit-profile');
    };
    
    if (loading) {
        return (
            <h6 style={{ marginTop: '3rem', textAlign: 'center' }}>
                Loading...
            </h6>
        );
    }
    
    if (error) {
        return (
            <h2 style={{ marginTop: '6rem', textAlign: 'center', color: 'red',fontSize:'1rem' }}>
                {error}
            </h2>
        );
    }

    const isCreator = profileData.role === 'creator';

    return (
        <Grid container justifyContent="center" sx={{ mt:5, p: 0, width: { xs: '103%', sm: '100%' } }} >
            <Grid item xs={12} sm={12.9} md={12.7} lg={11.7} xl={15}>
                <Box
                    sx={{
                        width: '100%',
                        ml: { xs: 0, sm: 'auto' },
                        mt: 0,
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 0,
                    }}
                >
                    <Card sx={{ boxShadow: 0 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box
                                        sx={{
                                            width: 55,
                                            height: 50,
                                            borderRadius: '20%',
                                            backgroundColor: '#fff',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            mr: 2,
                                            border: isCreator ? '3px solid #4caf50' : '3px solid #2196f3',
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faStar}
                                            size="2x"
                                            style={{ color: isCreator ? '#4caf50' : '#2196f3' }}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="h5"
                                            component="div"
                                            sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                                        >
                                            {profileData.full_name || 'User Name'}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            @{profileData.username}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Button
                                        variant="contained"
                                        startIcon={window.innerWidth < 750 ? null : <EditIcon />}
                                        onClick={handleEditClick}
                                    >
                                        {window.innerWidth < 750 ? <EditIcon /> : 'Edit Profile'}
                                    </Button>
                                </Box>
                            </Box>
                            <Grid container spacing={2} sx={{ textAlign: 'center', mb: 4 }}>
                                {isCreator && (
                                    <Grid item xs={4}>
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
                                        >
                                            {profileData.session_count} Sessions
                                        </Typography>
                                    </Grid>
                                )}
                                <Grid item xs={4}>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
                                    >
                                        {profileData.followers_count} Followers
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
                                    >
                                        {profileData.following_count} Following
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={2}
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    justifyContent: { xs: 'flex-start', sm: 'space-between' },
                                }}
                            >
                                {isCreator && (
                                    <>
                                        <Grid item xs={12} sm={6}>
                                            <Typography
                                                variant="body1"
                                                sx={{ fontWeight: 'bold', mb: 0, fontSize: '0.9rem' }}
                                            >
                                                <FontAwesomeIcon icon={faStar} style={{ marginRight: 8 }} />
                                                {profileData.creator_rating || 0} Creator Rating
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography
                                                variant="body1"
                                                sx={{ fontWeight: 'bold', mb: 0, fontSize: '0.9rem' }}
                                            >
                                                <FontAwesomeIcon icon={faUsers} style={{ marginRight: 8 }} />
                                                {profileData.attendees_count} Attendees
                                            </Typography>
                                        </Grid>
                                    </>
                                )}
                                <Grid item xs={12} sm={6}>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 'bold', mb: 2, fontSize: '0.9rem' }}
                                    >
                                        <FontAwesomeIcon icon={faPlay} style={{ marginRight: 8 }} />
                                        {profileData.sessions_attended} Sessions Attended
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            </Grid>
        </Grid>
    );
};

export default MyProfile;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Grid, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUsers, faPlay } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const UserProfile = () => {
    const { username } = useParams(); // Get the username from the URL parameters
    const [profileData, setProfileData] = useState(null); // User profile data
    const [isFollowing, setIsFollowing] = useState(false); // Following status
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch sessionId from localStorage
    const sessionId = localStorage.getItem('sessionId');

    // Fetch profile data and follow status
    const fetchProfileData = async () => {
        if (!sessionId) {
            setError('Please log in to view profiles.');
            setLoading(false);
            return;
        }

        try {
            // Fetch user profile data
            const profileResponse = await axios.get(`http://localhost:8083/user-profile/${username}`, {
                headers: {
                    Authorization: `Session ${sessionId}`,
                },
            });
            setProfileData(profileResponse.data);

            // Fetch follow status
            const followStatusResponse = await axios.get(`http://localhost:8083/follow-status/${username}`, {
                headers: {
                    Authorization: `Session ${sessionId}`,
                },
            });
            setIsFollowing(followStatusResponse.data.isFollowing);

            setError('');
        } catch (error) {
            console.error('[ERROR] Fetching profile data or follow status:', error);
            if (error.response?.status === 404) {
                setError('User not found.');
            } else {
                setError('An error occurred while fetching profile data.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch profile data on component mount
    useEffect(() => {
        fetchProfileData();
    }, [username]);

    // Handle follow action
    const handleFollow = async () => {
        try {
            await axios.post(
                `http://localhost:8083/follow/${username}`,
                {},
                {
                    headers: {
                        Authorization: `Session ${sessionId}`,
                    },
                }
            );
            setIsFollowing(true);
            setProfileData((prevData) => ({
                ...prevData,
                followers_count: prevData.followers_count + 1,
            }));
        } catch (error) {
            console.error('[ERROR] Following user:', error);
            setError('Failed to follow user.');
        }
    };

    // Handle unfollow action
    const handleUnfollow = async () => {
        try {
            await axios.post(
                `http://localhost:8083/unfollow/${username}`,
                {},
                {
                    headers: {
                        Authorization: `Session ${sessionId}`,
                    },
                }
            );
            setIsFollowing(false);
            setProfileData((prevData) => ({
                ...prevData,
                followers_count: prevData.followers_count - 1,
            }));
        } catch (error) {
            console.error('[ERROR] Unfollowing user:', error);
            setError('Failed to unfollow user.');
        }
    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    const isCreator = profileData.role === 'creator';

    return (
        <Grid container justifyContent="center" sx={{ mt: 5, p: 0, width: { xs: '103%', sm: '100%' } }}>
            <Grid item xs={12} sm={12.9} md={12.7} lg={11.7} xl={15}>
                <Box
                    sx={{
                        width: '100%',
                        ml: { xs: 0, sm: 'auto' },
                        mt: 0,
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <Card sx={{ boxShadow: 3 }}>
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
                                    {isFollowing ? (
                                        <Button variant="contained" color="secondary" onClick={handleUnfollow}>
                                            Unfollow
                                        </Button>
                                    ) : (
                                        <Button variant="contained" color="primary" onClick={handleFollow}>
                                            Follow
                                        </Button>
                                    )}
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
                            <Grid container spacing={2}>
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

export default UserProfile;
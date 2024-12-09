import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Box } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // Import the Help icon
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import axios from 'axios';
import './CourseCard.css'; // Import the updated CSS

const CourseCard = () => {
  const { session_id } = useParams(); // Retrieve session_id from URL parameters
  const [sessionData, setSessionData] = useState(null); // State to store session data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error message state

  // Fetch session data from the API
  const fetchSessionData = async () => {
    try {
      console.log('Fetching session data for session_id:', session_id);

      const localSessionId = localStorage.getItem('sessionId');
      if (!localSessionId) {
        setError('User not authenticated. Please log in.');
        return;
      }

    //   const response = await axios.get(`https://c-card-server.onrender.com/api/session/${session_id}`, {
    const response = await axios.get(`http://localhost:5009/api/session/${session_id}`, {
        headers: {
          Authorization: `Session ${localSessionId}`, // Pass session_id as Authorization header
          'Content-Type': 'application/json',
        },
      });

      console.log('Response data:', response.data);
      setSessionData(response.data); // Store the fetched session data in state
      setLoading(false); // Set loading to false once data is fetched
      setError(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error fetching session data:', error);
      setError('An error occurred while fetching session data.');
      setLoading(false); // Set loading to false in case of error
    }
  };

  useEffect(() => {
    fetchSessionData();
  }, [session_id]);

  // Display a loading message while data is being fetched
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  // Display a message if no session data is available
  if (!sessionData) {
    return <Typography>No session data available.</Typography>;
  }

  // Display error message if there's an error
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box className="course-card-container">
      {/* Card for session description */}
      <Card className="course-description-card" style={{ marginLeft: '20px', marginRight: '20px', marginTop: '0rem', }}>
  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch',width: 'calc(100% + 200px)' }}>
    <Box display="flex" alignItems="center" className="header-with-icon">
      <DescriptionIcon className="description-icon" />
      <Typography className="course-header" color="light-blue" sx={{ fontSize: '1rem' }}>
        &nbsp; About The Session
      </Typography>
    </Box>

    {sessionData.description && (
      <Typography
        fontSize="0.9rem"
        className="description-text"
        sx={{
          textAlign: 'left',
          paddingLeft: '2rem',
          paddingRight: '1.5rem', // Expand to the right by increasing padding
          flexGrow: 1, // Allow the text to take as much space as possible
        }}
      >
        {sessionData.description}
      </Typography>
    )}
  </CardContent>
</Card>

      {/* Card for creator information */}
      <Card className="creator-info-card" style={{ marginTop: '20px', margin: '20px' }}>
        <CardContent>
          <Box display="flex" alignItems="center" className="header-with-icon">
            <PersonIcon className="person-icon" color="green" /> {/* Person Icon for Creator */}
            <Typography className="course-header" color="green" sx={{ fontSize: '1rem' }}>
              &nbsp; About The Creator
            </Typography>
          </Box>

          {/* Render creator's full name, username, and bio */}
          {sessionData.full_name && (
            <Typography  sx={{ fontSize: '0.9rem', textAlign: 'left', marginLeft:'2rem'}}>
              Creator: {sessionData.full_name}
              {/* {sessionData.username && (
                <Typography sx={{ fontSize: '0.9rem' }}>@{sessionData.username}</Typography>
              )} */}
            </Typography>
          )}

          {sessionData.bio && (
            <Typography fontSize="0.9rem"sx={{  textAlign: 'left', marginLeft:'2rem'}}>Bio: {sessionData.bio}</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CourseCard;
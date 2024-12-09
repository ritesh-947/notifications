import React, { useEffect, useState } from 'react';
import {Alert, Box, Typography, Button, IconButton, Avatar, Card, CardContent, CardMedia, Grid, TextField, Checkbox, FormControlLabel,Snackbar } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import LanguageIcon from '@mui/icons-material/Language';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './SmallCard.css';
import MenuBookIcon from '@mui/icons-material/MenuBook';



const SmallCard = () => {
  const { session_id } = useParams(); // Get session_id from the URL parameters
  const [sessionData, setSessionData] = useState(null); // Store session data
  const [loading, setLoading] = useState(true); // Loading state
  const [favorite, setFavorite] = useState(false); // Track favorite state
  const [message, setMessage] = useState(''); // Store message input
  const [anonymous, setAnonymous] = useState(false); // Track anonymous state for message
  const [successMessage, setSuccessMessage] = useState(false); // Track success state for snackbar

  console.log('Frontend session_id from useParams:', session_id);

  // Fetch session data
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId'); // Retrieve session_id from localStorage
        if (!sessionId) {
          console.error('No session_id found in localStorage');
          return;
        }

        // const response = await axios.get(`http://localhost:5011/api/session/${session_id}`, {
        const response = await axios.get(`https://promo-server-5iob.onrender.com/api/session/${session_id}`, {
          headers: {
            Authorization: `Session ${sessionId}`, // Pass session_id in the Authorization header
            'Content-Type': 'application/json',
          },
        });

        console.log('Backend response:', response.data);

        const session = response.data;

        const parsedTimePeriod = typeof session.availability_timeperiod === 'string'
          ? JSON.parse(session.availability_timeperiod)
          : session.availability_timeperiod;

        const formattedSession = {
          ...session,
          video_url: convertToEmbedURL(session.video_url),
          availability_timeperiod: parsedTimePeriod,
          languages: session.creator_languages ? session.creator_languages.split(',').map(lang => lang.trim()) : ['English'],
        };

        setSessionData(formattedSession);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching session data:', error.response?.data || error.message);
        setLoading(false);
      }
    };

    if (session_id) {
      fetchSessionData();
    } else {
      console.error('No session_id provided');
    }
  }, [session_id]);

  // Helper function to convert YouTube URL into embeddable URL
  const convertToEmbedURL = (url) => {
    let videoId = '';
    if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1];
    } else if (url.includes('youtube.com/watch')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  
  // Handle message submission
  const handleSendMessage = async () => {
    if (!message.trim()) {
      console.error('Message is empty');
      return;
    }

    try {
      const sessionId = localStorage.getItem('sessionId'); // Retrieve session_id from localStorage
      if (!sessionId) {
        console.error('No session_id found in localStorage');
        return;
      }

      // const response = await axios.post('http://localhost:5011/api/session_queries', {
      const response = await axios.post('https://promo-server-5iob.onrender.com/api/session_queries', {
        session_id,
        message,
        anonymous,
      }, {
        headers: {
          Authorization: `Session ${sessionId}`, // Pass session_id in the Authorization header
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Message sent successfully');
        setMessage(''); // Clear the input field after sending
        setAnonymous(false); // Reset anonymous state
        setSuccessMessage(true); // Show success snackbar
      }
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!sessionData) return <Typography>No session data available.</Typography>;

  const formattedTimePeriod = sessionData.availability_timeperiod
    ? `${sessionData.availability_timeperiod.start} - ${sessionData.availability_timeperiod.end}`
    : 'Not Specified';

  return (
    
    <Box
      className="small-card"
      sx={{
        position: 'relative',
        width: '100%',
        boxShadow: 3,
        backgroundColor: 'white',
        borderRadius: '8px',
        marginBottom: '20px',
        marginTop:'3rem',
        overflow: 'hidden',
      }}
    >
       <Snackbar
        open={successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(false)} // Close after 4 seconds
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Change to top position
        
      >
        <Alert
          onClose={() => setSuccessMessage(false)}
          severity="success"
          icon={<CheckCircleIcon fontSize="inherit" />}
          sx={{
            position: 'relative', // Position adjustment
            top: '-1.2rem', // Move it slightly upward
          }}
         
        >
          Message sent successfully!
        </Alert>
      </Snackbar>
      <Card className="small-card-inner">
        <CardMedia
          component="iframe"
          src={sessionData.video_url}
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          sx={{ height: '150px', marginBottom: '10px' }}
        />
        <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <MenuBookIcon sx={{ color: 'green', fontSize: '40px' }} />
<Button
  variant="contained"
  sx={{
    width: '100%',
    py: 1,
    backgroundColor: 'green', // Set the background color
    '&:hover': {
      backgroundColor: 'darkgreen', // Optional hover color
    },
  }}
>
Book Session
</Button>
       

        </Box>
        <CardContent>
          <Typography variant="h6" sx={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' 
            ,top: '-0.5rem', 
            position:'relative',
            textAlign: 'left',
            // marginLeft: '0',
          }}>
            {sessionData.title || 'No Title Available'}
          </Typography>
          <Box display="flex" alignItems="center" sx={{ mb: -3 }}>
            <CurrencyRupeeIcon fontSize="small" sx={{ mr: 1, color: '#1976d2', mb: 0 }} />
            <Typography variant="h4" sx={{ lineHeight: -1, fontSize: '1.2rem',color: '#444444' }}>{sessionData.price || 'N/A'}</Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <StarIcon fontSize="small" sx={{ mr: 1, color: '#FFD700' }} />
            <Typography variant="body1" sx={{ mr: 1 ,color: '#666677'}}>
              {Number(sessionData.average_rating).toFixed(1) || '0.0'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ({sessionData.total_ratings || 0} ratings)
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="body2" color="textSecondary">
              Duration: {sessionData.duration === 'both' ? '15 / 30 Minutes' : `${sessionData.duration}`}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="body2" color="textSecondary">
              Available Days: {sessionData.availability_days?.join(', ') || 'Not Specified'}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="body2" color="textSecondary">
              Available Time: {formattedTimePeriod}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <LanguageIcon fontSize="small" sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="body2" color="textSecondary">
              {sessionData.languages.join(', ') || 'English'}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Send a message to the creator"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ 
                mr: 1, 
                '& .MuiOutlinedInput-root': { 
                  height: '35px', // Adjust the height here 
                },
              }}
            />
       <Button
  variant="contained"
  color="primary"
  startIcon={<SendIcon />} // Add the icon to the left
  endIcon={<SendIcon />}   // Keep the icon on the right
  sx={{ height: '100%' }}
  onClick={handleSendMessage}
>
  Send
</Button>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                name="anonymous"
                color="primary"
              />
            }
            label="Ask anonymously"
          />
            {/* Snackbar for success message */}
     
        </CardContent>
      </Card>
    </Box>
  );
};

export default SmallCard;
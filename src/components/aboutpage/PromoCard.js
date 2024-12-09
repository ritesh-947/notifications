import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Snackbar,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import {
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Send as SendIcon,
  Star as StarIcon,
  Language as LanguageIcon,
  CalendarToday as CalendarTodayIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import './PromoCard.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PromoCard = () => {
  const { session_id } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(false); // Track success state for snackbar


  // Fetch session data
  const fetchSessionData = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        setError('Please log in to access session details.');
        return;
      }

      const response = await axios.get(`http://localhost:5011/api/session/${session_id}`, {
        headers: {
          Authorization: `Session ${sessionId}`,
        },
      });

      const session = response.data;
      const parsedTimePeriod =
        typeof session.availability_timeperiod === 'string'
          ? JSON.parse(session.availability_timeperiod)
          : session.availability_timeperiod;

      setSessionData({
        ...session,
        video_url: convertToEmbedURL(session.video_url),
        availability_timeperiod: parsedTimePeriod,
        languages: session.creator_languages
          ? session.creator_languages.split(',').map((lang) => lang.trim())
          : ['English'],
      });

      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        navigate('/login');
      } else {
        setError('An error occurred while fetching session data.');
      }
      setLoading(false);
    }
  };

  // // Track visitor count (commented out)
  // const trackVisitor = async () => {
  //   try {
  //     await axios.post(
  //       `http://localhost:6001/api/session/${session_id}/visitor`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Session ${localStorage.getItem('sessionId')}`,
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     console.error('Error tracking visitor:', error);
  //   }
  // };

  // Handle message submission
   // Handle message submission
   const handleSendMessage = async () => {
    if (!message.trim()) {
      console.error('Message is empty');
      return;
    }

    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        console.error('No session_id found in localStorage');
        return;
      }

      const response = await axios.post('http://localhost:5011/api/session_queries', {
        session_id,
        message,
        anonymous,
      }, {
        headers: {
          Authorization: `Session ${sessionId}`,
        },
      });

      if (response.status === 200) {
        setMessage(''); // Clear input
        setAnonymous(false); // Reset anonymous
        setSuccessMessage(true); // Show success snackbar
      }
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
    }
  };

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

  useEffect(() => {
    console.log('useEffect triggered with session_id:', session_id);
    if (session_id) {
      fetchSessionData();
      // trackVisitor(); // Commented out to disable visitor tracking
    }
  }, [session_id]);

  if (loading) return <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />;
  if (!sessionData && error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={4}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box
      className="promo-card"
      sx={{
        position: 'absolute',
        top: '5rem',
        right: '1%',
        width: '35%',
        zIndex: 1000,
        boxShadow: 3,
        backgroundColor: 'white',
        borderRadius: '8px',
      }}
      pl={0}
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
        >
          Message sent successfully!
        </Alert>
      </Snackbar>


      <Card className="promo-card-inner">
        <CardContent>
          <Grid container alignItems="flex-start" sx={{ mt: -1 }}>
            <Grid item>
              <Avatar src="https://via.placeholder.com/40" alt={sessionData.creator_username} />
            </Grid>
            <Grid item xs>
              <Box display="flex" flexDirection="column" justifyContent="center" ml={2}>
                <Typography variant="h6" sx={{ fontSize: '1.1rem', color: '#111', lineHeight: 1 }}>
                  {sessionData.creator_full_name || 'Unknown Creator'}
                </Typography>
                <Typography variant="body2" color="#333">
                  @{sessionData.creator_username}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <CardMedia
          component="iframe"
          src={sessionData.video_url}
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        <CardContent>
          <Button
            variant="contained"
            color="primary"
            startIcon={<MenuBookIcon />}
            href={`http://localhost:3337/session/${session_id}/schedule`}
            fullWidth
            sx={{
              mb: 1,
              mt:-1,
              bgcolor: 'rgb(0, 150, 0)',
              '&:hover': {
                bgcolor: 'rgb(0, 128, 0)',
              },
              py: 1.0,
              fontWeight: 'bold',
              fontSize: '0.85rem',
            }}
          >
            Book Session
          </Button>

          <Typography
            variant="h4"
            noWrap={!showFullTitle}
            sx={{ cursor: 'pointer', fontSize: '1rem', color: '#333', fontWeight: '700' 
                , position: 'relative', // Enables positioning adjustments
              
            }}
            onClick={() => setShowFullTitle(!showFullTitle)}
          >
            {sessionData.title || 'No Title Available'}
          </Typography>


          <Box display="flex" alignItems="center" mb={-1} mt={1}>
            <StarIcon fontSize="small" sx={{ mr: 1, color: '#f4c150' }} />
            <Typography variant="body1" sx={{ mr: 1 }}>
              {Number(sessionData.average_rating).toFixed(1) || '0.0'}
            </Typography>
            <Typography variant="body2" color="#444">
              ({sessionData.total_ratings || 0} ratings)
            </Typography>
          </Box>


          <Box display="flex" alignItems="center" mb={-0.5}>
            <CurrencyRupeeIcon fontSize="small" sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="h6" sx={{fontSize: '1rem'}}>{sessionData.price || 'N/A'}</Typography>
            <IconButton onClick={() => setFavorite(!favorite)}>
              {favorite ? <FavoriteIcon sx={{ color: 'red' }} /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>

        

          <Box display="flex" alignItems="center" mb={0.5}>
            <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="body2" color="#444">
              Duration: {sessionData.duration || 'N/A'} Minutes
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={0.5}>
            <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="body2" color="#444">
              Available Days: {sessionData.availability_days?.join(', ') || 'Not Specified'}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={2}>
            <LanguageIcon fontSize="small" sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="body2" color="444">
              {Array.isArray(sessionData.creator_languages)
                ? sessionData.creator_languages.join(', ')
                : sessionData.creator_languages || 'English'}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask your query here.."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ mr: 1 }}
              InputProps={{
                sx: {
                  padding: '-2rem 1rem', // Adjust padding for smaller height
                  fontSize: '0.875rem', // Optional: smaller font size
                },
            }}
            />

            <Button
              variant="outlined"
              color="success"
              endIcon={<SendIcon />}
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
            label="Send as Anonymous"
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default PromoCard;
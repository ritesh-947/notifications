import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Box, TextField, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import './Ratings.css';

const MAX_CHAR_COUNT = 235;

const Ratings = () => {
  const { session_id } = useParams(); // Get session ID from the URL
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hasRated, setHasRated] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Axios instance with sessionId attached
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:6003', // Backend API base URL
    // baseURL: 'https://ratings-server.onrender.com', // Backend API base URL
  });

  // Attach `sessionId` from localStorage
  axiosInstance.interceptors.request.use(
    (config) => {
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        config.headers['Authorization'] = `Session ${sessionId}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Fetch the existing rating
  const fetchRating = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/session/${session_id}/ratings`);
      if (response.data && response.data.rating) {
        setRating(response.data.rating);
        setReview(response.data.review);
        setHasRated(true);
      } else {
        setHasRated(false);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setErrorMessage(
        error.response?.data?.error || 'An error occurred while fetching your rating. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle submitting a new rating
  const handleRatingSubmit = async () => {
    if (rating < 1 || rating > 5) {
      setErrorMessage('Please select a rating between 1 and 5.');
      return;
    }

    if (review.length > MAX_CHAR_COUNT) {
      setErrorMessage(`Review cannot exceed ${MAX_CHAR_COUNT} characters.`);
      return;
    }

    try {
      await axiosInstance.post(`/api/session/${session_id}/ratings`, { rating, review });
      setHasRated(true);
      setMessage('Your rating has been submitted.');
      setErrorMessage('');
    } catch (error) {
      console.error('Error submitting rating:', error);
      setErrorMessage(
        error.response?.data?.error || 'An error occurred while submitting your rating. Please try again.'
      );
    }
  };

  // Handle updating an existing rating
  const handleRatingUpdate = async () => {
    if (rating < 1 || rating > 5) {
      setErrorMessage('Please select a rating between 1 and 5.');
      return;
    }

    try {
      await axiosInstance.put(`/api/session/${session_id}/ratings`, { rating, review });
      setMessage('Your rating has been updated.');
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating rating:', error);
      setErrorMessage(
        error.response?.data?.error || 'An error occurred while updating your rating. Please try again.'
      );
    }
  };

  // Handle deleting an existing rating
  const handleRatingDelete = async () => {
    try {
      await axiosInstance.delete(`/api/session/${session_id}/ratings`);
      setHasRated(false);
      setRating(0);
      setReview('');
      setMessage('Your rating has been deleted.');
    } catch (error) {
      console.error('Error deleting rating:', error);
      setErrorMessage(
        error.response?.data?.error || 'An error occurred while deleting your rating. Please try again.'
      );
    }
  };

  useEffect(() => {
    fetchRating();
  }, [session_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: '100%',
          margin: '0 auto',
          boxShadow: 3,
          padding: 2,
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>
            {hasRated ? 'Update Your Rating' : 'Rate this Session'}
          </Typography>

          {message && <Typography sx={{ color: 'green', textAlign: 'center' }}>{message}</Typography>}
          {errorMessage && <Typography sx={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Typography>}

          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="body1">Rating:</Typography>
            <Select
              fullWidth
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              sx={{ marginBottom: 2 }}
            >
              <MenuItem value={0}>Select a rating</MenuItem>
              {[1, 2, 3, 4, 5].map((value) => (
                <MenuItem key={value} value={value}>
                  {value} - {['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'][value - 1]}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="body1">Review:</Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review (optional)"
              variant="outlined"
              helperText={`${review.length}/${MAX_CHAR_COUNT} characters`}
            />
          </Box>

          {hasRated ? (
            <>
              <Button fullWidth variant="contained" color="primary" onClick={handleRatingUpdate} sx={{ marginBottom: 1 }}>
                Update Rating
              </Button>
              <Button fullWidth variant="outlined" color="secondary" onClick={handleRatingDelete}>
                Delete Rating
              </Button>
            </>
          ) : (
            <Button fullWidth variant="contained" color="primary" onClick={handleRatingSubmit}>
              Submit Rating
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Ratings;
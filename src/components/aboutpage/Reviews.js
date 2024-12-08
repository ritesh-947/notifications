import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Reviews.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const Reviews = () => {
  const { session_id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Helper function to refresh token
  const refreshToken = async () => {
    try {
      const response = await axios.post('http://localhost:6001/api/auth/refresh', {}, { withCredentials: true });
      console.log('Token refreshed successfully:', response.data.message);
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error.response?.data || error.message);
      return false;
    }
  };

  // Helper function to handle API errors
  const handleApiError = async (error, retryFunction) => {
    if (error.response?.status === 401) {
      console.warn('Access token expired, attempting refresh...');
      const refreshed = await refreshToken();
      if (refreshed) {
        console.log('Retrying the failed request after token refresh...');
        retryFunction();
      } else {
        console.error('Token refresh failed. User needs to log in again.');
      }
    } else {
      console.error('API error:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      const retryFunction = fetchReviews; // Retry this function if token refresh is needed
      try {
        const response = await axios.get(`http://localhost:6003/api/session/${session_id}/reviews`, {
          withCredentials: true,
        });
        console.log('Fetched Reviews:', response.data); // Check here
        setReviews(response.data);
      } catch (error) {
        await handleApiError(error, retryFunction);
      }
    };
    fetchReviews();
  }, [session_id]);

  const handleLike = async (reviewId, index) => {
    const retryFunction = () => handleLike(reviewId, index); // Retry this function if token refresh is needed
    try {
      const response = await axios.post(`http://localhost:6003/api/reviews/${reviewId}/like`, {}, {
        withCredentials: true,
      });

      const updatedReviews = [...reviews];
      updatedReviews[index].like_count = response.data.like_count;
      updatedReviews[index].liked = response.data.liked;
      setReviews(updatedReviews);
    } catch (error) {
      await handleApiError(error, retryFunction);
    }
  };

  const getProfileLetter = (username) => (username ? username.charAt(0).toUpperCase() : '?');

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <div className="stars">
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} className="star-full" style={{ color: '#ffa500' }} />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} className="star-empty" style={{ color: 'lightgray' }} />
        ))}
      </div>
    );
  };

  return (
    <div className="reviews-section">
      <h2>Reviews for this Session:</h2>
      {errorMessage ? (
        <p className={errorMessage.includes('No reviews') ? 'neutral-message' : 'error-message'}>
          {errorMessage}
        </p>
      ) : (
        reviews.length === 0 ? (
          <p className="neutral-message">No reviews available for this session.</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="profile-pic">{getProfileLetter(review.reviewer_username)}</div>
              <div className="review-content">
                <h4>{review.reviewer_username}</h4>
                <div className="rating-section">
                  {renderStars(review.rating)}
                  <small>{new Date(review.created_at).toLocaleString()}</small>
                </div>
                <p>{review.review}</p>
                <div className="helpful-section">
                  <span>Helpful?</span>
                  <button
                    className={`like-button ${review.liked ? 'liked' : ''}`}
                    onClick={() => handleLike(review.id, index)}
                  >
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </button>
                  <button className="dislike-button">
                    <FontAwesomeIcon icon={faThumbsDown} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
};

export default Reviews;
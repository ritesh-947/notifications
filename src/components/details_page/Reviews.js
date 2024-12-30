import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Reviews.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const Reviews = () => {
  const { session_id } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('https://ratings-server.onrender.com/api/check-auth', {
        // const response = await axios.get('http://localhost:6003/api/check-auth', {
          withCredentials: true, // Ensure cookies are sent
        });
        setIsLoggedIn(response.data.isLoggedIn);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`https://ratings-server.onrender.com/api/session/${session_id}/reviews`);
        // const response = await axios.get(`http://localhost:6003/api/session/${session_id}/reviews`);
        console.log('Fetched Reviews:', response.data);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error.response?.data || error.message);
        setErrorMessage('Failed to fetch reviews.');
      }
    };

    fetchReviews();
  }, [session_id]);

  const handleLike = async (reviewId, index) => {
    if (!isLoggedIn) {
      setErrorMessage('Like functionality coming soon.');
      return;
    }

    try {
      const response = await axios.post(
        `https://ratings-server.onrender.com/api/reviews/${reviewId}/like`,
        // `http://localhost:6003/api/reviews/${reviewId}/like`,
        {},
        {
          headers: {
            Authorization: `Session ${localStorage.getItem('sessionId')}`,
          },
        }
      );

      const updatedReviews = [...reviews];
      updatedReviews[index].like_count = response.data.like_count;
      updatedReviews[index].liked = response.data.liked; // Toggle the like state
      setReviews(updatedReviews);
    } catch (error) {
      console.error('Error liking the review:', error.response?.data || error.message);
      setErrorMessage('Failed to like the review.');
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
    <div className="reviews-section"
    style={{marginBottom : '3rem'}}>
      <h6>Reviews for this Session:</h6>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {reviews.length === 0 ? (
        <p className="neutral-message no-reviews-message">No reviews found for this session.</p>
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
      )}
    </div>
  );
};

export default Reviews;
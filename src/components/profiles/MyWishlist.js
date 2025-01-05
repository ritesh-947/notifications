import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faGlobe, faClock, faCalendar, faIndianRupeeSign, faUsers } from '@fortawesome/free-solid-svg-icons';
import './MyWishlist.css';
import { useNavigate } from 'react-router-dom';

const MyWishlist = () => {
  const [wishlistedVideos, setWishlistedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState('');
  const navigate = useNavigate();
  const videoRefs = useRef([]);
  const sessionId = localStorage.getItem('sessionId');

  const fetchWishlistedVideos = async () => {
    setLoading(true);

    if (!sessionId) {
      console.error('No sessionId found in localStorage.');
      setAuthMessage('You need to log in to view your wishlist.');
      setWishlistedVideos([]);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('https://home-server-x9xg.onrender.com/api/wishlist', {
      // const response = await axios.get('http://localhost:6001/api/wishlist', {
        headers: {
          Authorization: `Session ${sessionId}`,
        },
      });

      const { wishlistedSessions } = response.data;

      if (Array.isArray(wishlistedSessions)) {
        const formattedVideos = wishlistedSessions.map((video) => ({
          ...video,
          video_url: convertToEmbedURL(video.video_url),
          languages: video.languages ? video.languages.split(',') : [],
          avg_rating: parseFloat(video.avg_rating) || 0,
        }));

        setWishlistedVideos(formattedVideos);
      } else {
        console.error('Invalid API response: `wishlistedSessions` is not an array.');
        setWishlistedVideos([]);
      }

      setAuthMessage('');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error.message);
      setWishlistedVideos([]);
      if (error.response?.status === 401) {
        setAuthMessage('You need to log in to view your wishlist.');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistedVideos();
  }, []);

  const convertToEmbedURL = (url) => {
    let videoId = '';
    if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/watch')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const handleViewMore = (sessionId) => {
    navigate(`/session/${sessionId}`);
  };

  const handleRemoveFromWishlist = async (sessionIdToRemove) => {
    try {
      const response = await axios.post(
        'https://home-server-x9xg.onrender.com/api/wishlist/remove',
        { sessionId: sessionIdToRemove },
        {
          headers: {
            Authorization: `Session ${sessionId}`,
          },
        }
      );

      if (response.status === 200) {
        setWishlistedVideos((prevVideos) =>
          prevVideos.filter((video) => video.session_id !== sessionIdToRemove)
        );
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  if (!wishlistedVideos || wishlistedVideos.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          height: '70vh',
        }}
      >
        <img
          src="./wishlist-empty.png"
          alt="Wishlist is empty"
          style={{ width: '250px', height: 'auto', marginBottom: '2rem', borderRadius: '20%' }}
        />
        <h6
          style={{
            marginTop: '-1rem',
            fontSize: '1rem',
          }}
        >
          Your wishlist is empty.
        </h6>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      {authMessage && <div className="auth-message">{authMessage}</div>}
      <div className="video-grid">
        {wishlistedVideos.map((video, index) => (
          <div
            key={video.session_id}
            className="video-card"
            style={{
              minHeight: '475px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '15px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              margin: '10px',
            }}
            ref={(el) => (videoRefs.current[index] = el)}
          >
            <div
              className="creator-info"
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={() => navigate(`/user/${video.creator_username}`)}
            >
              <FontAwesomeIcon icon={faStar} />
              <p
                style={{
                  marginLeft: '5px',
                  marginBottom: '10px',
                  color: 'black',
                  textDecoration: 'none',
                }}
              >
                {video.creator_username
                  ? `Created by ${video.creator_username}`
                  : 'Creator not available'}
              </p>
            </div>
            {video.video_url ? (
              <iframe
                width="320"
                height="180"
                src={video.video_url}
                title={video.session_title}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="video-placeholder">Video not available</div>
            )}
            <div className="video-content">
              <h3>{video.session_title || 'Untitled Session'}</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                <FontAwesomeIcon icon={faIndianRupeeSign} /> Price: ₹{video.price}
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                <FontAwesomeIcon icon={faCalendar} /> Available:{' '}
                {video.availability_days?.map((day) => day.slice(0, 3)).join(', ')}
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                <FontAwesomeIcon icon={faClock} /> Duration: {video.duration}
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                <FontAwesomeIcon icon={faGlobe} /> Languages: {video.languages.join(', ')}
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                <FontAwesomeIcon
                  icon={faStar}
                  style={{
                    color: video.avg_rating > 3.7 ? '#FFD700' : 'gray',
                    padding: '2px',
                  }}
                />
                Rating: {video.avg_rating.toFixed(2)} ({video.ratings_count || 0} ratings)
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                <FontAwesomeIcon icon={faUsers} /> Attendees: {video.attendees_count || 0}
              </p>
              <div className="button-container">
                <button
                  className="view-more-button"
                  onClick={() => handleViewMore(video.session_id)}
                >
                  View More
                </button>
                <button
                  className="remove-from-wishlist-button"
                  onClick={() => handleRemoveFromWishlist(video.session_id)}
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyWishlist;
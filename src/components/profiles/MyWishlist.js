import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faGlobe, faClock, faCalendar, faDollarSign, faUsers } from '@fortawesome/free-solid-svg-icons';
import './MyWishlist.css';
import { useNavigate } from 'react-router-dom';
import ThreeDotMenu from './ThreeDotMenu';

const MyWishlist = () => {
  const [wishlistedVideos, setWishlistedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authMessage, setAuthMessage] = useState('');
  const videoRefs = useRef([]);
  const navigate = useNavigate();

  const sessionId = localStorage.getItem('sessionId');

  const fetchWishlistedVideos = async () => {
    if (!sessionId) {
      console.error('No sessionId found in localStorage.');
      setAuthMessage('You need to log in to view your wishlist.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('https://home-server-x9xg.onrender.com/api/wishlist', {
        headers: {
          Authorization: `Session ${sessionId}`,
        },
      });

      const { wishlistedSessions, user } = response.data;

      const formattedVideos = wishlistedSessions.map((video) => ({
        ...video,
        video_url: convertToEmbedURL(video.video_url),
        languages: video.languages.split(','),
        avg_rating: parseFloat(video.avg_rating),
      }));

      setWishlistedVideos(formattedVideos);
      setUser(user);
      setAuthMessage('');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error.message);
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

  const handleRemoveFromWishlist = async (sessionId) => {
    try {
      const response = await axios.post(
        'https://home-server-x9xg.onrender.com/api/wishlist/remove',
        { sessionId },
        {
          headers: {
            Authorization: `Session ${sessionId}`,
          },
        }
      );

      if (response.status === 200) {
        setWishlistedVideos((prevVideos) =>
          prevVideos.filter((video) => video.session_id !== sessionId)
        );
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error.message);
    }
  };

  if (loading) {
    return <div>Loading your wishlist...</div>;
  }



  if (wishlistedVideos.length === 0) {
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
          style={{ width: '250px', height: 'auto', marginBottom: '2rem', borderRadius:'20%' }}
        />
          <h6
        style={{
          marginTop: '-1rem', // Move the text 1rem upwards
          fontSize: '1rem', // Optional: Adjust font size if needed
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
            <div className="creator-info" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faStar} />
              <p style={{ marginLeft: '5px', marginBottom: '10px' }}>
                {video.creator_username ? `Created by ${video.creator_username}` : 'Creator not available'}
              </p>
              <ThreeDotMenu
                sessionId={video.session_id}
                onRemoveFromWishlist={() => handleRemoveFromWishlist(video.session_id)}
              />
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
                <FontAwesomeIcon icon={faDollarSign} /> Price: ₹{video.price}
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                <FontAwesomeIcon icon={faCalendar} /> Available: {video.availability_days.map((day) => day.slice(0, 3)).join(', ')}
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                <FontAwesomeIcon icon={faClock} /> Duration: {video.duration}
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                <FontAwesomeIcon icon={faGlobe} /> Languages: {video.languages.join(', ')}
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                <FontAwesomeIcon icon={faStar} /> Rating: {video.avg_rating.toFixed(2)} ({video.ratings_count} ratings)
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                <FontAwesomeIcon icon={faUsers} /> Attendees: {video.attendees_count}
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
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faGlobe, faClock, faCalendar, faDollarSign, faUsers } from '@fortawesome/free-solid-svg-icons'; // Import additional icons
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ searchQuery }) => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authMessage, setAuthMessage] = useState(''); // New state for auth message
  const videoRefs = useRef([]);
  const navigate = useNavigate();

  // Check if the user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem('sessionId');
  };

  // Fetch videos from the backend
  const fetchVideos = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');

      const response = await axios.get('https://home-server-x9xg.onrender.com/api/sessions', {
      // const response = await axios.get('http://localhost:6001/api/sessions', {
        headers: {
          Authorization: sessionId ? `Session ${sessionId}` : '',
        },
      });

      const { sessions, user } = response.data;
      const formattedVideos = sessions.map((video) => ({
        ...video,
        video_url: convertToEmbedURL(video.video_url),
        languages: video.languages.split(','),
        avg_rating: parseFloat(video.avg_rating),
      }));

      setVideos(formattedVideos);

      if (user) {
        setUser(user);
        setAuthMessage(''); // Clear any auth message if logged in
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error.message);

      // Check if unauthorized and display auth message
      if (error.response?.status === 401) {
        setAuthMessage('Need to Login to Book Sessions...');
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    // Apply search filter and limit results to 12
    const filtered = videos.filter((video) =>
      video.session_title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVideos(filtered.slice(0, 12)); // Limit to 12 results
  }, [searchQuery, videos]);

  const handleLogout = () => {
    localStorage.removeItem('sessionId'); // Clear session ID
    setAuthMessage('Need to Login to Book Sessions...'); // Show auth message on logout
    setUser(null);
  };

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
    navigate(`/session/${sessionId}`); // Navigate to the session details page
  };

  const handleBookSession = (sessionId) => {
    if (!isAuthenticated()) {
      alert('You need to login to book sessions!');
    } else {
      console.log(`Booking session with ID: ${sessionId}`);
      alert('Booking functionality coming soon!');
    }
  };

  if (loading) {
    return <div>Loading sessions...</div>;
  }

  if (!loading && videos.length === 0) {
    return <div>No sessions available at the moment.</div>;
  }

  return (
    <div className="home-page">
      {/* Show Auth Message */}
      {authMessage && <div className="auth-message">{authMessage}</div>}

      {user && (
        <div className="user-info">
          <h2>Welcome, {user.username}!</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      <div className="video-grid">
        {filteredVideos.map((video, index) => (
          <div
            key={video.session_id}
            className="video-card"
            ref={(el) => (videoRefs.current[index] = el)}
          >
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
              <p>
                <FontAwesomeIcon icon={faDollarSign} /> Price: ₹{video.price}
              </p>
              <p>
                <FontAwesomeIcon icon={faCalendar} /> Available: {video.availability_days}
              </p>
              <p>
                <FontAwesomeIcon icon={faClock} /> Duration: {video.duration} Minutes
              </p>
              <p>
                <FontAwesomeIcon icon={faGlobe} /> Languages: {video.languages.join(', ')}
              </p>
              <p>
                <FontAwesomeIcon icon={faStar} /> Rating: {video.avg_rating.toFixed(2)}{' '}
                <FontAwesomeIcon icon={faUsers} /> ({video.ratings_count} ratings)
              </p>
              <p>
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
                  className="book-session-button"
                  onClick={() => handleBookSession(video.session_id)}
                >
                  Book Session
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
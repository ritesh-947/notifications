import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faGlobe, faClock, faCalendar, faIndianRupeeSign, faUsers } from '@fortawesome/free-solid-svg-icons';
import './CategoryPage.css';

const CategoryPage = () => {
  const { category } = useParams(); // Get category from URL parameters
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessionsByCategory = async () => {
      try {
        const response = await axios.get(`https://home-server-x9xg.onrender.com/api/sessions/category/${category}`);
        // const response = await axios.get(`http://localhost:6001/api/sessions/category/${category}`);
        const formattedSessions = response.data.sessions.map((session) => ({
          ...session,
          video_url: convertToEmbedURL(session.video_url),
          languages: Array.isArray(session.languages)
            ? session.languages
            : session.languages.split(','),
        }));
        setSessions(formattedSessions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sessions:', err.message);
        setError('Failed to load sessions for this category. Please try again later.');
        setLoading(false);
      }
    };

    fetchSessionsByCategory();
  }, [category]);

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

  const handleBookSession = (sessionId) => {
    navigate(`/session/${sessionId}/book`);
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Loading sessions for "{category}"...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (sessions.length === 0) {
    return <div className="no-sessions">No sessions available for the "{category}" category.</div>;
  }

  return (
    <div className="category-page">
      <h5>Sessions for "{category}"</h5>
      <div className="session-grid">
        {sessions.map((session) => (
          <div className="session-card" key={session.session_id}>
            {session.video_url ? (
              <iframe
                width="320"
                height="180"
                src={session.video_url}
                title={session.session_title}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="video-placeholder">Video not available</div>
            )}
            <div className="session-details">
              <h3>{session.session_title || 'Untitled Session'}</h3>
              <p>
                <FontAwesomeIcon icon={faIndianRupeeSign} /> Price:{' '}
                {session.price === 'free' ? 'Free' : `₹${session.price}`}
              </p>
              <p>
                <FontAwesomeIcon icon={faCalendar} /> Available Days:{' '}
                {session.availability_days.map((day) => day.slice(0, 3)).join(', ')}
              </p>
              <p>
                <FontAwesomeIcon icon={faClock} /> Duration: {session.duration}
              </p>
              <p>
                <FontAwesomeIcon icon={faGlobe} /> Languages:{' '}
                {Array.isArray(session.languages)
                  ? session.languages.join(', ')
                  : session.languages}
              </p>
              <p>
                <FontAwesomeIcon icon={faStar} /> Rating:{' '}
                {typeof session.avg_rating === 'number'
                  ? session.avg_rating.toFixed(2)
                  : parseFloat(session.avg_rating || 0).toFixed(2)}{' '}
                ({session.ratings_count || 0} ratings)
              </p>
              <p>
                <FontAwesomeIcon icon={faUsers} /> Attendees: {session.attendees_count || 0}
              </p>
              <div className="session-buttons">
                <button onClick={() => handleViewMore(session.session_id)}>View More</button>
                <button onClick={() => handleBookSession(session.session_id)}>Book Session</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
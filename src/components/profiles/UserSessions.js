import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faGlobe, faClock, faCalendar, faIndianRupeeSign, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
// import './UserSessions.css';

const UserSessions = () => {
  const { username } = useParams(); // Get username from URL parameter
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const videoRefs = useRef([]);

  const convertToEmbedURL = (url) => {
    let videoId = '';
    if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/watch')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const fetchUserSessions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8083/api/sessions/${username}`);
      const formattedSessions = response.data.map((session) => ({
        ...session,
        video_url: convertToEmbedURL(session.video_url),
        languages: session.languages.split(','),
      }));
      setSessions(formattedSessions);
      setError(null);
    } catch (err) {
      console.error('[ERROR] Fetching user sessions:', err.message);
    //   setError('Users did not have uploaded any sessions.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = (sessionId) => {
    navigate(`/session/${sessionId}`); // Navigate to the session details page
  };

  const handleBookSession = (sessionId) => {
    navigate(`/session/${sessionId}/book`); // Navigate to the booking page
  };

  useEffect(() => {
    fetchUserSessions();
  }, [username]);

  if (loading) {
    return (
      <div
        style={{
          marginTop: '4rem',
          fontSize: '1rem',
          textAlign: 'center',
        }}
      >
        Loading sessions...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          marginTop: '4rem',
          fontSize: '1rem',
          textAlign: 'center',
          color: 'red',
        }}
      >
        {error}
      </div>
    );
  }

  if (!loading && sessions.length === 0) {
    return <div style={{ marginTop: '4rem', textAlign: 'center' }}>No sessions found for this user.</div>;
  }

  return (
    <div className="user-sessions">
      <h4 style={{ fontSize:'1rem', marginBottom: '0rem', textAlign: 'center' }}>Sessions by {username}</h4>
      <div className="video-grid">
        {sessions.map((session, index) => (
          <div
            key={session.session_id}
            className="video-card"
            style={{
              minHeight: '475px',
              minWidth: '300px', // Set minimum width
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
            <div className="video-content">
              <h3>{session.session_title || 'Untitled Session'}</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                <FontAwesomeIcon icon={faIndianRupeeSign} /> Price: {session.price}
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '8px' }} />
                Available: {session.availability_days.map((day) => day.slice(0, 3)).join(', ')}
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                <FontAwesomeIcon icon={faClock} /> Duration: {session.duration}
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                <FontAwesomeIcon icon={faGlobe} /> Languages: {session.languages.join(', ')}
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                <FontAwesomeIcon icon={faUsers} /> Attendees: {session.visitor_count}
              </p>
              <div className="button-container">
                <button
                  className="view-more-button"
                  onClick={() => handleViewMore(session.session_id)}
                >
                  View More
                </button>
                <button
                  className="book-session-button"
                  onClick={() => handleBookSession(session.session_id)}
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

export default UserSessions;
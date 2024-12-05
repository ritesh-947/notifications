import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen, FaDoorOpen } from 'react-icons/fa'; // Import icons

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleDescription, setVisibleDescription] = useState(null); // Track the currently visible description
  const navigate = useNavigate();

  // Fetch videos from backend
  const fetchVideos = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3053/api/sessions');
      const sessions = response.data.sessions;

      // Convert video URLs to embed format
      const formattedVideos = sessions.map((video) => ({
        ...video,
        video_url: convertToEmbedURL(video.video_url),
      }));

      setVideos(formattedVideos);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch sessions. Please try again later.');
      console.error('Error fetching videos:', err);
      setLoading(false);
    }
  };

  

  // Convert YouTube URL to embed URL
  const convertToEmbedURL = (url) => {
    let videoId = '';
    if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/watch')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Toggle description visibility
  const toggleDescription = (sessionId) => {
    setVisibleDescription(visibleDescription === sessionId ? null : sessionId);
  };

  // Handle navigation to chat
  const goToChat = (sessionId) => {
    navigate(`/chat/${sessionId}`);
  };

  if (loading) return <div>Loading sessions...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="home-page">
    <div className="video-grid">
  {videos.map((video) => (
    <div key={video.session_id} className="video-card">
      {video.video_url ? (
        <iframe
          width="320"
          height="180"
          src={video.video_url}
          title={video.session_title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="video-placeholder">Video not available</div>
      )}

      <div className="video-content">
        <h3>{video.session_title || 'Untitled Session'}</h3>

        {visibleDescription === video.session_id && (
          <p className="video-description">{video.description}</p>
        )}

        <div className="button-container">
          {/* Toggle description button */}
          <button
            className="view-description-button"
            onClick={() => toggleDescription(video.session_id)}
          >
            <FaBookOpen style={{ marginRight: '5px' }} />
            {visibleDescription === video.session_id
              ? 'Hide Blog'
              : 'View Blog'}
          </button>

          {/* Join Room button */}
          <button
            className="join-room-button"
            onClick={() => (window.location.href = `/chat/${video.session_id}`)}
          >
             <FaDoorOpen style={{ marginRight: '5px' }} />
            Join Room
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
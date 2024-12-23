import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faGlobe, faClock, faCalendar, faDollarSign, faUsers } from '@fortawesome/free-solid-svg-icons'; // Import additional icons
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import ThreeDotMenu from './ThreeDotMenu'; // Import the ThreeDotMenu component

const HomePage = ({ searchQuery }) => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authMessage, setAuthMessage] = useState(''); // New state for auth message
  const videoRefs = useRef([]);
  const navigate = useNavigate();


  console.log('resources pulled successfully');

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
     // Increment impressions for visible sessions
     const sessionIds = formattedVideos.map((video) => video.session_id);
     await incrementImpressions(sessionIds);

     setLoading(false);
   } catch (error) {
     console.error('Error fetching videos:', error.message);

     if (error.response?.status === 401) {
       setAuthMessage('Need to Login to Book Sessions...');
     }

     setLoading(false);
   }
 };

 
 const incrementImpressions = async (sessionIds) => {
  try {
    // await axios.post('http://localhost:6001/api/sessions/increment-impressions', {
    await axios.post('https://home-server-x9xg.onrender.com/api/increment-impressions', {
      sessionIds,
    });
  } catch (error) {
    console.error('Error incrementing impressions:', error.response?.data || error.message);
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
      console.log(`Navigating to booking page for session ID: ${sessionId}`);
      navigate(`/session/${sessionId}/book`); // Navigate to the booking page
      // alert('Booking functionality coming soon!');
    }
  };
  const handleCreatorClick = (creatorId) => {
    // window.location.href = `http://localhost:3232/user/${creatorId}`;
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

        </div>
      )}
      <div className="video-grid">
        {filteredVideos.map((video, index) => (
          
          <div
            key={video.session_id}
            className="video-card"
            style={{
              minHeight: '475px', // Increase card height
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
             <div className="creator-info" onClick={() => handleCreatorClick(video.creator_id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginRight: '-10px' }}>
             <div
  className={`star-icon ${video.role === 'creator' ? 'creator' : 'user'}`}

>
  <FontAwesomeIcon icon={faStar} />
</div>
              <p style={{ marginLeft: '5px', marginBottom: '10px'  }}>{video.creator_username ? `Created by ${video.creator_username}` : 'Creator not available'}</p>
              <ThreeDotMenu sessionId={video.session_id} onShare={() => console.log('Share clicked')} />
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
  <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '8px' }} />
  Available: {video.availability_days.map((day) => day.slice(0, 3)).join(', ')}
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
      color: video.avg_rating > 3.7 ? '#FFD700' : 'gray', // Golden color if rating > 3.7, gray otherwise



      padding: '2px' // Space between border and icon
    }} 
  /> 
  Rating: {video.avg_rating.toFixed(2)}{' '}
 ({video.ratings_count} ratings)
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

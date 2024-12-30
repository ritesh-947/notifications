import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faGlobe, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import './MyWishlist.css';
import ThreeDotMenu from './ThreeDotMenu';
import ShareModal from './ShareModal';

const MyWishlist = () => {
  const [wishlistedVideos, setWishlistedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareSessionId, setShareSessionId] = useState(null);

  // Fetch sessionId from localStorage
  const sessionId = localStorage.getItem('sessionId');

  const handleOpenShareModal = (sessionId) => {
    setShareSessionId(sessionId);
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
    setShareSessionId(null);
  };

  const fetchWishlistedVideos = async () => {
    if (!sessionId) {
      console.error('[ERROR] No sessionId found in localStorage.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:6001/api/wishlist', {
        headers: {
          Authorization: `Session ${sessionId}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const { wishlistedSessions, user } = data;

        const formattedVideos = wishlistedSessions.map((video) => ({
          ...video,
          video_url: convertToEmbedURL(video.video_url),
          languages: video.languages.split(','),
          avg_rating: parseFloat(video.avg_rating),
        }));

        setWishlistedVideos(formattedVideos);
        setUser(user);
      } else {
        console.error('[ERROR] Failed to fetch wishlisted sessions:', response.statusText);
      }
    } catch (error) {
      console.error('[ERROR] Error fetching wishlisted videos:', error.message);
    } finally {
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

  const handleRemoveFromWishlist = async (sessionId) => {
    if (!sessionId || !user?.id) {
      console.error('[ERROR] Invalid session or user ID.');
      return;
    }

    try {
      const response = await fetch('http://localhost:6004/api/wishlist/remove', {
        method: 'POST',
        headers: {
          Authorization: `Session ${sessionId}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          userId: user.id,
        }),
      });

      if (response.ok) {
        setWishlistedVideos((prevVideos) =>
          prevVideos.filter((video) => video.session_id !== sessionId)
        );
        console.log('Session removed from wishlist successfully.');
      } else {
        console.error('[ERROR] Failed to remove session from wishlist:', response.statusText);
      }
    } catch (error) {
      console.error('[ERROR] Error removing session from wishlist:', error.message);
    }
  };

  const handleCreatorClick = (creatorId) => {
    window.location.href = `http://localhost:3232/user/${creatorId}`;
  };

  const handleReadFullStoryClick = (sessionId) => {
    window.location.href = `http://localhost:3345/session/${sessionId}`;
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const partialStar = (rating % 1) * 100;
    const emptyStars = 5 - fullStars - (partialStar ? 1 : 0);
  
    return (
      <div className="stars"  style={{ marginBottom: '4rem' }}>
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesomeIcon key={`full-${i}`} icon={faStar} className="star-full" />
        ))}
        {partialStar > 0 && (
          <div className="star-container" key="partial-star">
            <FontAwesomeIcon icon={faStar} className="star-empty" />
            <div className="star-overlay" style={{ width: `${partialStar}%` }}>
              <FontAwesomeIcon icon={faStar} className="star-full-overlay" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="star-empty" />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading wishlist...</div>;
  }

  if (wishlistedVideos.length === 0) {
    return <div className="no-videos">You have no wishlisted sessions.</div>;
  }

  return (
    <div className="home-page">
      <div className="video-grid">
        {wishlistedVideos.map((video, index) => (
          <div key={`${video.session_id}-${index}`} className="video-card">
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

            <div className="title-and-menu">
              <h3 style={{ color: 'black', fontSize: '18px', margin: '5px 0', maxWidth: '85%' }}>
                {video.session_title || 'Untitled Session'}
              </h3>
              <ThreeDotMenu
                sessionId={video.session_id}
                userId={user?.id}
                onRemoveFromWishlist={() => handleRemoveFromWishlist(video.session_id)}
                onShare={() => handleOpenShareModal(video.session_id)}
              />
            </div>

            <div
              className="creator-info"
              onClick={() => handleCreatorClick(video.creator_id)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginRight: '-10px' }}
            >
              <FontAwesomeIcon icon={faStar} className="creator-star" />
              <p style={{ marginLeft: '5px' }}>
                {video.creator_username ? `Created by ${video.creator_username}` : 'Creator not available'}
              </p>
            </div>

            <div className="video-info" style={{ marginTop: '10px' }}>
              <span className="rating">{Number.isNaN(video.avg_rating) ? '0.00' : video.avg_rating.toFixed(2)}</span>
              {renderStars(video.avg_rating || 0)}
              <FontAwesomeIcon icon={faUserFriends} />
              <span className="attendees-count">{`${video.attendees_count} Attendees`}</span>
            </div>

            <button className="read-more" onClick={() => handleReadFullStoryClick(video.session_id)}>
              View More
            </button>
          </div>
        ))}
      </div>

      <ShareModal
        open={isShareModalOpen}
        handleClose={handleCloseShareModal}
        sessionId={shareSessionId}
      />
    </div>
  );
};

export default MyWishlist;
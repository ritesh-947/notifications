import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faSearch, faBell, faVideo, faCalendarAlt, faSignInAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import axios from 'axios';

const Header = ({ onSearch }) => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false); // Track search state
  const navigate = useNavigate();

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 550); // Check if screen size is <= 550px
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch user info
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:6002/api/user-info');
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.warn('No user data found:', error.response?.data || error.message);
      setUser(null); // Ensure UI doesn't break when unauthenticated
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchButtonClick = () => {
    if (searchQuery.trim() !== '') {
      onSearch(searchQuery.trim());
      setIsSearchActive(true); // Mark search as active
    }
  };

  const handleBackButtonClick = () => {
    window.location.reload(); // Reload the current page
    setIsSearchActive(false); // Mark search as inactive
  };
  
  const handleVideoUploadClick = () => {
    const redirectUrl = user?.role === 'creator'
      ? 'upload'
      : '/become-creator';
    window.location.href = redirectUrl;
  };

  const handleLoginSignUpClick = () => {
    window.location.href = 'http://localhost:3002/login';
  };

  return (
    <header className="o1-header">
      <div className="o1-header-left">
        <div className="o1-logo">
          <img src="../../public/IMG_1152.jpg" alt="Logo" className="o1-logo-image" />
        </div>
        <a href="#" className="o1-categories">Categories</a>
      </div>

      <div className="o1-header-center">
        {/* Show back button only if search is active */}
        {isSearchActive && (
          <button className="o1-back-button" onClick={handleBackButtonClick}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
        <div className="o1-search-container">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="o1-search-input"
          />
          <button className="o1-search-button" onClick={handleSearchButtonClick}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>

      <div className="o1-header-right">
        <FontAwesomeIcon
          icon={faVideo}
          size="1x"
          className="o1-icon"
          onClick={handleVideoUploadClick}
        />
        {!isSmallScreen && (
          <>
            <button
              className="o1-icon-button"
              onClick={() => window.location.href = 'http://localhost:5568/booked-sessions'}
              style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faCalendarAlt} size="1x" className="o1-icon" color="blue" />
            </button>

           
          </>
        )}
        {!user && (
          <button className="o1-login-button" onClick={handleLoginSignUpClick}>
            <FontAwesomeIcon icon={faSignInAlt} className="o1-icon" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
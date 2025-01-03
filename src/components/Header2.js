import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faSearch, faSignInAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import './Header2.css';

const Header2 = ({ onSearch }) => {
  const [isSearchActive, setIsSearchActive] = useState(false); // To toggle the search input field
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchButtonClick = () => {
    if (isSearchActive && searchQuery.trim() !== '') {
      // Perform search when input is open and has a query
      onSearch(searchQuery.trim());
    } else {
      setIsSearchActive(true); // Open search input field if not active
    }
  };



  const handleLoginClick = () => {
    window.location.href = '/login'; // Redirect to login page
  };

  const handleProfileClick = () => {
    window.location.href = '/my-profile'; // Navigate to /my-profile
  };

  return (
    <header className="responsive-header">
      {/* Left: Logo */}
      <div className="header-left">
        <img src="/IMG_1152.png" alt="Logo" className="header-logo" />
      </div>

      {/* Center: Search */}
      <div className={`header-center ${isSearchActive ? 'active' : ''}`}>

       
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className={`search-input ${isSearchActive ? 'active' : ''}`}
          onKeyDown={(e) => e.key === 'Enter' && onSearch(searchQuery.trim())}
        />
      </div>

      {/* Right: Search, Login, and Profile */}
      <div className="header-right">
        <FontAwesomeIcon
          icon={faSearch}
          className="header-icon"
          onClick={handleSearchButtonClick}
        />
        <FontAwesomeIcon
          icon={faSignInAlt}
          className="header-icon login-icon"
          onClick={handleLoginClick}
        />
        <div className="profile-icon" onClick={handleProfileClick}>
          <FontAwesomeIcon icon={faStar} />
        </div>
      </div>
    </header>
  );
};

export default Header2;
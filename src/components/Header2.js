import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faSearch, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import './Header2.css';

const Header2 = ({ onSearch }) => {
  const [isSearchActive, setIsSearchActive] = useState(false); // To toggle the search input field
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);

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

  const handleRefreshButtonClick = () => {
    window.location.reload(); // Refresh the page
  };

  const handleLoginClick = () => {
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <header className="responsive-header">
      {/* Left: Logo */}
      <div className="header-left">
        <img src="/IMG_1152.png" alt="Logo" className="header-logo" />
      </div>

      {/* Center: Search */}
      <div className={`header-center ${isSearchActive ? 'active' : ''}`}>
        <button className="refresh-button" onClick={handleRefreshButtonClick}>
          <FontAwesomeIcon icon={faRedo} />
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className={`search-input ${isSearchActive ? 'active' : ''}`}
          onKeyDown={(e) => e.key === 'Enter' && onSearch(searchQuery.trim())}
        />
      </div>

      {/* Right: Search and Login */}
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
      </div>
    </header>
  );
};

export default Header2;
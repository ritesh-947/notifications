import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faSearch, faVideo } from '@fortawesome/free-solid-svg-icons';
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

  const handleRecordButtonClick = () => {
    alert('Record button clicked!'); // Action for record button
  };

  const handleVideoUploadClick = () => {
    const redirectUrl = user?.role === 'creator'
      ? 'upload'
      : '/upload';
    window.location.href = redirectUrl;
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

      {/* Right: Record and Search */}
      <div className="header-right">
        <FontAwesomeIcon
          icon={faVideo}
          className="header-icon"
          onClick={handleVideoUploadClick}
        />
        <FontAwesomeIcon
          icon={faSearch}
          className="header-icon"
          onClick={handleSearchButtonClick}
        />
      </div>
    </header>
  );
};

export default Header2;
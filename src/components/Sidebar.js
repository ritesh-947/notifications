// Sidebar.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faChevronDown,
  faUser,
  faBars,
  faVideo,
  faCalendarCheck,
  faQuestionCircle,
  faHeart,
  faUserCircle,
  faDollarSign,
  faListAlt,
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css'; // Ensure you have styles in Sidebar.css

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Default collapsed

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <>
      <button className="menu-button" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} style={{ marginTop: '0px' }} />
      </button>
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sign-in">
          <FontAwesomeIcon icon={faUser} /> 
        </div>
        <ul>
          <li>
            <a href="/homepage">
              <FontAwesomeIcon icon={faHome} /> Home
            </a>
          </li>
          <li>
            <a href="/room">
              <FontAwesomeIcon icon={faVideo} /> Join Room
            </a>
          </li>
          <li>
            <a href="/booked-sessions">
              <FontAwesomeIcon icon={faCalendarCheck} /> Bookings
            </a>
          </li>
          <li>
            <a href="/my-queries">
              <FontAwesomeIcon icon={faQuestionCircle} /> My Queries
            </a>
          </li>
          <li>
            <a href="/wishlist">
              <FontAwesomeIcon icon={faHeart} /> Wishlist
            </a>
          </li>
          <li>
            <a href="/my-profile">
              <FontAwesomeIcon icon={faUserCircle} /> My Profile
            </a>
          </li>
          <li>
            <a href="/monetization">
              <FontAwesomeIcon icon={faDollarSign} /> Monetization
            </a>
          </li>
          <li>
            <a href="/subscription">
              <FontAwesomeIcon icon={faListAlt} /> Subscription
            </a>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
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
            <a href="/creator-sessions">
              <FontAwesomeIcon icon={faCalendarCheck} color="green" /> Visitor Bookings
            </a>
          </li>
          
          <li>
            <a href="/visitor-queries">
              <FontAwesomeIcon icon={faQuestionCircle} color="green"/> Visitor Queries
            </a>
          </li>
          
         

          

          <li>
            <a href="/monetization">
              <FontAwesomeIcon icon={faDollarSign} color="blue" /> Monetization
            </a>
          </li>
          <li>
            <a href="/subscription">
              <FontAwesomeIcon icon={faListAlt} color="blue" /> Subscription
            </a>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
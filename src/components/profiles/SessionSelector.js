import React, { useState } from 'react';
import MySessions from './MySessions';
import MyQueries from './MyQueries';
import VisitorQueries from './VisitorQueries';
import MyHistory from './MyHistory';
import MyWishlist from './MyWishlist';
import './SessionSelector.css'; // Create a CSS file for styling

const SessionSelector = () => {
  const [selectedTab, setSelectedTab] = useState('MySessions');

  const renderComponent = () => {
    switch (selectedTab) {
      case 'MySessions':
        return <MySessions />;
      case 'MyQueries':
        return <MyQueries />;
      case 'MyHistory':
        return <MyHistory />;
      case 'MyWishlist':
        return <MyWishlist />;
      default:
        return <MySessions />;
    }
  };

  return (
    <div>
      <div className="session-selector-header">
        <div
          className={`session-tab ${selectedTab === 'MySessions' ? 'active' : ''}`}
          onClick={() => setSelectedTab('MySessions')}
        >
          My Sessions
        </div>
        <div
          className={`session-tab ${selectedTab === 'MyQueries' ? 'active' : ''}`}
          onClick={() => setSelectedTab('MyQueries')}
        >
          My Queries
        </div>
        <div
          className={`session-tab ${selectedTab === 'MyHistory' ? 'active' : ''}`}
          onClick={() => setSelectedTab('MyHistory')}
        >
          My History
        </div>
        <div
          className={`session-tab ${selectedTab === 'MyWishlist' ? 'active' : ''}`}
          onClick={() => setSelectedTab('MyWishlist')}
        >
          My Wishlist
        </div>
      </div>
      <div className="session-content">
        {renderComponent()}
      </div>
    </div>
  );
};

export default SessionSelector;
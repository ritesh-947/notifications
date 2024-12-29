import React, { useState } from 'react';
import MySessions from './MySessions';
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
      case 'VisitorQueries':
        return <VisitorQueries />;
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
          Sessions
        </div>
       
        <div
          className={`session-tab ${selectedTab === 'MyHistory' ? 'active' : ''}`}
          onClick={() => setSelectedTab('MyHistory')}
        >
          History
        </div>
        <div
          className={`session-tab ${selectedTab === 'MyWishlist' ? 'active' : ''}`}
          onClick={() => setSelectedTab('MyWishlist')}
        >
          Wishlist
        </div>
        <div
          className={`session-tab ${selectedTab === 'VisitorQueries' ? 'active' : ''}`}
          onClick={() => setSelectedTab('VisitorQueries')}
        >
          V.Queries
        </div>
      </div>
      <div className="session-content">
        {renderComponent()}
      </div>
    </div>
  );
};

export default SessionSelector;
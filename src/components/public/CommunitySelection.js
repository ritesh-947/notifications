import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CommunitySelection = () => {
  const [community, setCommunity] = useState('');
  const [onlineCount, setOnlineCount] = useState(0); // Track the number of people online
  const [recentChats, setRecentChats] = useState([]); // For recent chats based on "?"
  const navigate = useNavigate();

  // Mock data for online user count
  const communityOnlineData = {
    webapp: 42,
    design: 38,
    marketing: 29,
    development: 55,
    support: 19,
    security: 12,
  };

  // Mock recent chats (example of a chat array)
  const allChats = [
    { message: 'How do I start with React?', community: 'webapp' },
    { message: 'What are the best practices for web design?', community: 'design' },
    { message: '???', community: 'marketing' }, // Chat with only question marks
    { message: 'What is a JWT?', community: 'security' },
    { message: 'What is happening here?', community: 'webapp' },
    { message: '?', community: 'support' }, // Chat with only question mark
  ];

  // Function to filter recent chats containing only "?" marks
  const filterRecentChats = () => {
    const recent = allChats.filter(chat => chat.message.trim() === '?' || chat.message.includes('???'));
    setRecentChats(recent);
  };

  // Update the online user count based on the selected community
  useEffect(() => {
    if (community) {
      setOnlineCount(communityOnlineData[community] || 0);
    } else {
      setOnlineCount(0);
    }
  }, [community]);

  // Filter recent chats whenever the component renders or community is selected
  useEffect(() => {
    filterRecentChats();
  }, [community]);

  const handleJoinCommunity = () => {
    if (community) {
      navigate(`/public/${community}/room`);
    }
  };

  return (
    <div>
      <h2>Select Your Community</h2>

      {/* Community Selection Dropdown */}
      <select value={community} onChange={(e) => setCommunity(e.target.value)}>
        <option value="">Select a community</option>
        <option value="webapp">WebApp</option>
        <option value="design">Design</option>
        <option value="marketing">Marketing</option>
        <option value="development">Development</option>
        <option value="support">Support</option>
        <option value="security">Security</option>
        {/* Add more communities as needed */}
      </select>

      {/* Display the number of people online in the selected community */}
      {community && (
        <p>
          <strong>{community}</strong> community has <strong>{onlineCount}</strong> people online.
        </p>
      )}

      {/* Button to join community */}
      <button onClick={handleJoinCommunity} disabled={!community}>
        Join Community
      </button>

    
    </div>
  );
};

export default CommunitySelection;
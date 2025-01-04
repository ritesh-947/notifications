import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinRoom.css'; // Import the CSS file

const JoinRoom = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    } else {
      alert('Please enter a valid Room ID.');
    }
  };

  return (
    <div className="join-room-container">
      <div className="join-room-card">
        <h2 className="join-room-title">Join a Room</h2>
        <form onSubmit={handleJoinRoom} className="join-room-form">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="join-room-input"
          />
          <button type="submit" className="join-room-button">
            Join Room For Free
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Chat.css';
import { useParams } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';

// Initialize the socket connection
const socket = io('https://msg-room.onrender.com', {
  withCredentials: false, // Disable credentials for simplicity
});

const Chat = () => {
  const { room_id } = useParams(); // Extract room_id from the URL
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [membersCount, setMembersCount] = useState(0); // Track the number of members in the room
  const messageEndRef = useRef(null);
  const [username, setUsername] = useState('');

  useEffect(() => {


    // // Prompt the user for a username or generate one
    // const user = prompt('Enter your username:') || `User-${Math.random().toString(36).substring(2, 8)}`;
    // setUsername(user);

    
    if (room_id) {
      // Join the room dynamically based on room_id
      socket.emit('joinRoom', room_id);
      console.log(`Joined Room: ${room_id}`);

   // Listen for incoming messages
   socket.on('receiveMessage', (message) => {
    console.log('New message received:', message);
    setMessages((prevMessages) => [...prevMessages, message]);
    scrollToBottom();
});
      // Handle message deletion
      socket.on('messageDeleted', (messageId) => {
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== messageId)
        );
      });

      // Handle typing notification
      socket.on('typing', () => {
        setTyping(true);
        setTimeout(() => setTyping(false), 2500);
      });

      // Update room members count
      socket.on('roomMembers', (count) => {
        setMembersCount(count);
      });

      return () => {
        socket.off('receiveMessage');
        socket.off('messageDeleted');
        socket.off('typing');
        socket.off('roomMembers');
      };
    }
  }, [room_id]);

  
  const sendMessage = () => {
    if (messageInput.trim()) {
      const message = {
        text: messageInput.slice(0, 200),
        sender: username, // Replace with actual username
        roomId: room_id,
        timestamp: Date.now(),
      };
      socket.emit('sendMessage', message);
      setMessageInput('');
    }
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setMessageInput(value);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Room: {room_id}</h3>
        <p>Members: {membersCount}</p>
      </div>
      <div className="messages-container">
    {messages.map((msg, idx) => (
        <div
            key={idx}
            className={`message ${msg.sender === 'User' ? 'own' : 'other'}`}
        >
            <div className="profile-icon">
                {/* Ensure sender exists before accessing charAt */}
                {(msg.sender ? msg.sender.charAt(0).toUpperCase() : '?')}
            </div>
            <div className="message-content">
                <strong>{msg.sender || 'Mystery'}:</strong> {msg.text}
                <div className="timestamp">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
            </div>
        </div>
    ))}
    <div ref={messageEndRef}></div>
</div>
      <div className="input-container">
        <input
          type="text"
          value={messageInput}
        onChange={handleInputChange}
          placeholder="Type your message (max 200 characters)..."
        />
        <button onClick={sendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;
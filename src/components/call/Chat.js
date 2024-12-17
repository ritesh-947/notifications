import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Chat.css';
import { useParams } from 'react-router-dom';
import Picker from '@emoji-mart/react';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

const socket = io('http://localhost:3051', { withCredentials: false }); // No credentials required

const Chat = () => {
  const { room_id } = useParams(); // Extract room ID from the URL
  const [roomId, setRoomId] = useState(room_id);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: null, username: 'Anonymous' });
  const messageEndRef = useRef(null);

  useEffect(() => {
    const sessionId = localStorage.getItem('session_id');

    const fetchUserInfo = async () => {
      if (!sessionId) {
        console.warn('Session ID not found in localStorage.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3051/api/auth/session-info', {
          headers: { Authorization: `Bearer ${sessionId}` },
        });
        setCurrentUser({ id: response.data.userId, username: response.data.username });
        console.log('User Info:', response.data);
      } catch (err) {
        console.error('Error fetching user info:', err.response?.data || err.message);
      }
    };

    fetchUserInfo();

    if (room_id) {
      socket.emit('joinRoom', room_id);
      console.log(`Joined room: ${room_id}`);
    }

    socket.on('loadMessages', (loadedMessages) => {
      setMessages(loadedMessages);
      scrollToBottom();
    });

    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
    });

    socket.on('typing', () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 2500);
    });

    return () => socket.disconnect();
  }, [room_id]);

  const sendMessage = () => {
    const sessionId = localStorage.getItem('session_id'); // Retrieve session_id from localStorage
    if (!sessionId) {
      console.error('Session ID missing in local storage');
      return;
    }
  
    if (messageInput.trim() && roomId) {
      const message = {
        text: messageInput,
        id: Math.random().toString(36).substring(7), // Unique message ID
        timestamp: Date.now(),
        roomId: roomId, // Room ID from params
        sessionId: sessionId, // Session ID for user validation
      };
  
      console.log('Sending message:', message); // Log message payload
      socket.emit('sendMessage', message);
      setMessageInput(''); // Clear the input field
    } else {
      console.error('Message text, roomId, or sessionId is missing');
    }
  };
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEmojiSelect = (emoji) => {
    setMessageInput((prevInput) => prevInput + emoji.native);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <div className="message-text">
              <strong>{message.sender}:</strong> <p>{message.text}</p>
              <div className="sent-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {typing && <div className="typing-indicator">User is typing...</div>}

      <div className="input-container">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onInput={() => socket.emit('typing')}
          placeholder="Type a message..."
        />
        <span className="emoji-icon" onClick={() => setEmojiPickerVisible((prev) => !prev)}>
          😊
        </span>
        {emojiPickerVisible && (
          <Picker onEmojiSelect={handleEmojiSelect} set="apple" showPreview={false} />
        )}
        <button onClick={sendMessage} className="send-icon">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;
import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Chat.css';
import { useParams } from 'react-router-dom';
import Picker from '@emoji-mart/react';
import { FaPaperPlane, FaComments, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const socket = io('http://localhost:3051', { withCredentials: false }); // Socket.io connection

const Chat = () => {
  const { room_id } = useParams(); // Extract room ID from the URL
  const [roomId, setRoomId] = useState(room_id);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: null, username: 'Anonymous' });
  const [isChatOpen, setIsChatOpen] = useState(false); // Chat window state
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
      socket.emit('joinRoom', { roomId: room_id, sessionId });
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
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      console.error('Session ID missing in local storage');
      return;
    }

    if (messageInput.trim() && roomId) {
      const message = {
        text: messageInput,
        roomId: roomId,
        sessionId: sessionId,
      };

      console.log('Sending message:', message);
      socket.emit('sendMessage', message);
      setMessageInput('');
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
    <div className="chat-wrapper">
      {/* Chat Button */}
      {!isChatOpen && (
        <button className="chat-toggle-button" onClick={() => setIsChatOpen(true)}>
          <FaComments size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <span>Chat Room: {roomId}</span>
            <button className="chat-close-button" onClick={() => setIsChatOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className="message">
                <div className="message-text">
                  <strong>{message.username || 'User'}:</strong> {message.text}
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
      )}
    </div>
  );
};

export default Chat;
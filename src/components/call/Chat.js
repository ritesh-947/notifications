import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Chat.css';
import { useParams } from 'react-router-dom';
import Picker from '@emoji-mart/react';
import { FaPaperPlane, FaComments, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

// Socket.IO connection
const socket = io('http://localhost:3051', { withCredentials: false });


const Chat = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: null, username: 'Anonymous' });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const messageEndRef = useRef(null);
  const emojiPickerRef = useRef(null);


  useEffect(() => {
  if (isChatOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
  return () => {
    document.body.style.overflow = 'auto';
  };
}, [isChatOpen]);

  // Fetch user info and initialize socket events
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');

    if (!roomId || !sessionId) {
      console.error('[ERROR] Room ID or Session ID is missing.');
      return;
    }

    scrollToBottom();
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:3051/api/auth/session-info', {
          headers: { Authorization: `Bearer ${sessionId}` },
        });
        console.log('[DEBUG] User Info:', response.data);
        setCurrentUser({ id: response.data.userId, username: response.data.username });
      } catch (err) {
        console.error('[ERROR] Fetching user info:', err.response?.data || err.message);
      }
    };

    fetchUserInfo();

    socket.emit('joinRoom', { roomId, sessionId });
    console.log('[DEBUG] joinRoom emitted with:', { roomId, sessionId });

    socket.on('loadMessages', (loadedMessages) => {
      console.log('[DEBUG] Messages loaded from server:', loadedMessages);
      setMessages(
        loadedMessages.map((msg) => ({
          ...msg,
          username: msg.username || 'Anonymous',
        }))
      );
      scrollToBottom();
    });

    socket.on('receiveMessage', (message) => {
      console.log('[DEBUG] New message received:', message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, username: message.username || 'Anonymous' },
      ]);
      scrollToBottom();
    });

    socket.on('typing', () => {
      console.log('[DEBUG] User is typing...');
      setTyping(true);
      setTimeout(() => setTyping(false), 2500);
    });

    socket.on('messageDeleted', ({ id }) => {
      console.log('[DEBUG] Message deleted with ID:', id);
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
    });

    socket.on('messageEdited', (editedMessage) => {
      console.log('[DEBUG] Message edited:', editedMessage);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === editedMessage.id ? { ...msg, text: editedMessage.text } : msg
        )
      );
    });

    return () => {
      console.log('[INFO] Disconnecting socket...');
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId || !roomId) {
      console.error('[ERROR] Room ID or Session ID is missing.');
      return;
    }

    if (messageInput.trim()) {
      if (editingMessageId) {
        console.log('[DEBUG] Editing message:', { id: editingMessageId, text: messageInput.trim() });
        socket.emit('editMessage', { id: editingMessageId, text: messageInput.trim() });

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === editingMessageId ? { ...msg, text: messageInput.trim() } : msg
          )
        );

        setEditingMessageId(null);
        setMessageInput('');
      } else {
        const message = {
          text: messageInput.trim(),
          roomId,
          senderId: currentUser.id,
          username: currentUser.username,
          timestamp: new Date().toISOString(),
        };

        console.log('[DEBUG] Sending new message:', message);
        socket.emit('sendMessage', { text: message.text, roomId, sessionId });

        setMessages((prevMessages) => [...prevMessages, message]);
        setMessageInput('');
      }
    }
  };

  const deleteMessage = (id) => {
    if (!id) {
      console.error('[ERROR] Message ID is missing for deletion.');
      return;
    }

    console.log('[DEBUG] Deleting message with ID:', id);
    socket.emit('deleteMessage', { id });

    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
  };

  const startEditing = (id, text) => {
    console.log('[DEBUG] Starting to edit message with ID:', id);
    setEditingMessageId(id);
    setMessageInput(text);
  };

  const cancelEditing = () => {
    console.log('[DEBUG] Cancel editing message.');
    setEditingMessageId(null);
    setMessageInput('');
  };

  const handleEmojiSelect = (emoji) => {
    console.log('[DEBUG] Emoji selected:', emoji.native);
    setMessageInput((prevInput) => prevInput + emoji.native);
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOutsideClick = (event) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
      console.log('[DEBUG] Clicked outside emoji picker, closing.');
      setEmojiPickerVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const inputContainerStyle = {
  position: 'absolute', // Ensure it is positioned relative to the parent container
  bottom: '-4.2rem',         // Stick to the bottom of the chat-container
  width: '100%',       // Stretch across the width of the chat-container
  padding: '10px',     // Padding inside the container
  backgroundColor: 'white', // Background color
  borderTop: '1px solid #ddd', // Top border for separation
  boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)', // Subtle shadow for better appearance
};

  return (
    <div className="chat-wrapper">
      {!isChatOpen && (
        <button className="chat-toggle-button" onClick={() => setIsChatOpen(true)}>
          <FaComments size={24} />
        </button>
      )}

      {isChatOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <span>Chat Room: {roomId}</span>
            <button className="chat-close-button" onClick={() => setIsChatOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.senderId === currentUser.id ? 'own-message' : 'other-message'
                }`}
              >
                <div
                  className={`profile-icon ${
                    message.senderId === currentUser.id
                      ? 'profile-icon-own'
                      : 'profile-icon-other'
                  }`}
                >
                  {message.username ? message.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="message-content">
                  <div>
                    <div className="username">{message.username}</div>
                    <div className="message-text">{message.text}</div>
                    <div className="sent-time">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                {/* {message.senderId === currentUser.id && (
                  <div className="message-actions">
                    <FaEdit
                      className="edit-icon"
                      onClick={() => startEditing(message.id, message.text)}
                    />
                    <FaTrash
                      className="delete-icon"
                      onClick={() => deleteMessage(message.id)}
                    />
                  </div>
                )} */}
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          {typing && <div className="typing-indicator">User is typing...</div>}

          <div className="input-container" style={inputContainerStyle}>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onInput={() => socket.emit('typing')}
              placeholder={editingMessageId ? 'Edit your message...' : 'Type a message...'}
            />
            <span className="emoji-icon" onClick={() => setEmojiPickerVisible((prev) => !prev)}>
              😊
            </span>
            {emojiPickerVisible && (
              <div className="emoji-picker-container" ref={emojiPickerRef}>
                <Picker onEmojiSelect={handleEmojiSelect} set="apple" showPreview={false} />
              </div>
            )}
            <button onClick={sendMessage} className="send-icon">
              <FaPaperPlane />
            </button>
            {editingMessageId && (
              <button onClick={cancelEditing} className="cancel-edit-button">
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
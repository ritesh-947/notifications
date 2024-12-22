import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Chat.css';
import { useParams } from 'react-router-dom';
import Picker from '@emoji-mart/react';
import { FaPaperPlane, FaComments, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

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
  const [editingMessageText, setEditingMessageText] = useState('');
  const messageEndRef = useRef(null);
  const emojiPickerRef = useRef(null); // Reference for emoji picker



  useEffect(() => {
    socket.on('messageDeleted', ({ id }) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
    });
  
    return () => {
      socket.off('messageDeleted');
    };
  }, []);

  useEffect(() => {
    socket.on('messageEdited', (editedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === editedMessage.id ? { ...msg, text: editedMessage.text } : msg
        )
      );
    });
  
    return () => {
      socket.off('messageEdited');
    };
  }, []);

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');

    if (!roomId || !sessionId) {
      console.error('[ERROR] Room ID or Session ID is missing.');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:3051/api/auth/session-info', {
          headers: { Authorization: `Bearer ${sessionId}` },
        });
        setCurrentUser({ id: response.data.userId, username: response.data.username });
      } catch (err) {
        console.error('[ERROR] Fetching user info:', err.response?.data || err.message);
      }
    };

    fetchUserInfo();

    socket.emit('joinRoom', { roomId, sessionId });

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

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setEmojiPickerVisible(false); // Close emoji picker
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const sendMessage = () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId || !roomId) {
      console.error('[ERROR] Room ID or Session ID is missing.', { sessionId, roomId });
      return;
    }
  
    if (messageInput.trim()) {
      const message = {
        text: messageInput.trim(),
        roomId,
        senderId: currentUser.id,
        username: currentUser.username,
        timestamp: new Date().toISOString(), // Add timestamp for display
      };
  
      // Optimistically render the message without the `id` field
      setMessages((prevMessages) => [...prevMessages, message]);
  
      // Send message to server
      socket.emit('sendMessage', { text: message.text, roomId, sessionId });
  
      // Clear input field
      setMessageInput('');
    } else {
      console.error('[ERROR] Message text is missing.');
    }
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEmojiSelect = (emoji) => {
    setMessageInput((prevInput) => prevInput + emoji.native);
  };

  const deleteMessage = (id) => {
    if (!id) {
      console.error('[ERROR] Message ID is missing for deletion.');
      return;
    }
    console.log(`[DEBUG] Deleting message with ID: ${id}`);
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
    socket.emit('deleteMessage', { id });
  };
  const startEditing = (id, text) => {
    setEditingMessageId(id);
    setEditingMessageText(text);
  };
  
  const saveEditedMessage = () => {
    if (!editingMessageId || !editingMessageText.trim()) {
      console.error('[ERROR] Missing ID or text for editing message.');
      return;
    }
    console.log(`[DEBUG] Saving edited message with ID: ${editingMessageId}`);
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === editingMessageId ? { ...msg, text: editingMessageText } : msg
      )
    );
    socket.emit('editMessage', { id: editingMessageId, text: editingMessageText });
    setEditingMessageId(null);
    setEditingMessageText('');
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
      {editingMessageId === message.id ? (
        <input
          value={editingMessageText}
          onChange={(e) => setEditingMessageText(e.target.value)}
          onBlur={saveEditedMessage}
          autoFocus
        />
      ) : (
        <div>
          <div className="username">{message.username}</div>
          <div className="message-text">{message.text}</div>
          <div className="sent-time">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
    {message.senderId === currentUser.id && (
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
    )}
  </div>
))}
            <div ref={messageEndRef} />
          </div>

          {typing && <div className="typing-indicator">User is typing...</div>}

        <div className="input-container" style={{ position: 'relative' }}>
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
    <div className="emoji-picker-container"
    ref={emojiPickerRef} >
      <Picker onEmojiSelect={handleEmojiSelect} set="apple" showPreview={false} />
    </div>
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
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faEdit, faTrashAlt, faFlag } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, FormControlLabel, RadioGroup, Radio, FormLabel, Button } from '@mui/material';
import './PublicChat.css';

const socket = io('http://localhost:1001', {
  withCredentials: true,
});

const PublicChat = () => {
  const { community, room_id } = useParams();
  const [roomId, setRoomId] = useState(room_id || `${community}-room`);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const messageEndRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const containerRef = useRef(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (community) {
      joinRoom(roomId);
    }

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('setUser', (userId) => {
      setCurrentUser(userId);
    });

    // Fetch the last 3 messages initially when joining the room
    fetchInitialMessages(roomId);

    // Listen for new messages being sent in real-time
    socket.on('newMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      if (isAutoScrolling) {
        scrollToBottom();
      } else {
        checkAutoScrollOnNewMessage();
      }
    });

    // Listen for deleted messages and remove them from UI
    socket.on('messageDeleted', (messageId) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
    });

    document.addEventListener('click', handleOutsideClick);

    return () => {
      socket.off('connect');
      socket.off('setUser');
      socket.off('newMessage');
      socket.off('messageDeleted');
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [community, roomId]);

  const handleOutsideClick = (e) => {
    if (menuOpen && !e.target.closest('.options-icon') && !e.target.closest('.message-actions')) {
      setMenuOpen(false);
    }
  };

  const fetchInitialMessages = (roomId) => {
    socket.emit('fetchInitialMessages', roomId, (initialMessages) => {
      setMessages(initialMessages);
      scrollToBottom();
    });
  };

  const joinRoom = (id) => {
    socket.emit('joinRoom', id);
    console.log(`Joined room: ${id}`);
  };

  const sendMessage = () => {
    if (!currentUser) {
      alert('Please Log In To Send Your Message.');
      return;
    }

    if (blocked) {
      alert('You are temporarily blocked from sending messages.');
      return;
    }

    if (!messageInput.trim()) {
      alert('Message should not be empty.');
      return;
    }

    if (messageInput.length > 256) {
      alert('Message must be less than 256 characters.');
      return;
    }

    const message = {
      text: messageInput,
      roomId,
    };
    socket.emit('sendMessage', message);
    setMessageInput('');
    scrollToBottom(); // Always scroll to bottom when user sends a message
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    const currentPosition = container.scrollTop + container.clientHeight;
    const threshold = container.scrollHeight - container.clientHeight * 0.15;

    if (currentPosition >= threshold) {
      setIsAutoScrolling(true);
    } else {
      setIsAutoScrolling(false);
    }
  };

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const checkAutoScrollOnNewMessage = () => {
    const container = containerRef.current;
    const totalMessages = messages.length;

    const lastMessageHeight = container.scrollHeight / totalMessages;

    if (container.scrollHeight - container.scrollTop - container.clientHeight <= 3 * lastMessageHeight) {
      scrollToBottom();
    }
  };

  const toggleMenu = (message) => {
    setActiveMessageId(message.id);
    setMenuOpen(!menuOpen);
  };

  const handleEditMessage = (message) => {
    const newText = prompt('Edit your message:', message.text);
    if (newText && newText.length <= 256) {
      socket.emit('editMessage', { messageId: message.id, newText });
    }
    setMenuOpen(false);
  };

  const handleDeleteMessage = (message) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      socket.emit('deleteMessage', { messageId: message.id });
    }
    setMenuOpen(false);
  };

  const handleReportMessage = (message) => {
    setActiveMessageId(message.id);
    setReportDialogOpen(true);
    setMenuOpen(false);
  };

  const handleReportDialogClose = () => {
    setReportDialogOpen(false);
  };

  const handleReportSubmit = () => {
    if (!reportReason) {
      alert('Please Choose A Reason Of Report.');
      return;
    }
    socket.emit('reportMessage', { messageId: activeMessageId, reportReason });
    alert('Message reported');
    setReportDialogOpen(false);
  };

  return (
    <div className="chat-container">
      <h3>{`Community: ${community} Room: ${roomId}`}</h3>

      <div className="messages" ref={containerRef} onScroll={handleScroll}>
        {messages.map((message, index) => (
          <div key={index} className="message">
            <div className="profile-icon">{message.profile_pic}</div>
            <div className="message-content">
              <p className="sender-name">{message.sender}</p>
              <p>{message.text}</p>
              {message.edited && <small>(edited)</small>}

              <FontAwesomeIcon
                icon={faEllipsisV}
                onClick={() => toggleMenu(message)}
                className="options-icon"
              />

              {activeMessageId === message.id && menuOpen && (
                <div className="message-actions">
                  {message.sender_id === currentUser && (
                    <>
                      <button onClick={() => handleEditMessage(message)} className="edit-button">
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
                      <button onClick={() => handleDeleteMessage(message)} className="delete-button">
                        <FontAwesomeIcon icon={faTrashAlt} /> Delete
                      </button>
                    </>
                  )}
                  <button onClick={() => handleReportMessage(message)} className="report-button">
                    <FontAwesomeIcon icon={faFlag} /> Report
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {!isAutoScrolling && (
        <button className="scroll-to-bottom" onClick={scrollToBottom}>
          ⬇️ Scroll to Bottom
        </button>
      )}

      <div className="input-container">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message (max 256 chars)"
          maxLength={256}
          className="message-input"
        />
        <button onClick={sendMessage} disabled={blocked} className="send-button">
          Send
        </button>
      </div>

      <Dialog open={reportDialogOpen} onClose={handleReportDialogClose}>
        <DialogTitle>Report Message</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select Report Reason</FormLabel>
            <RadioGroup
              aria-label="report"
              name="report"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              <FormControlLabel value="sexual content" control={<Radio />} label="Sexual Content" />
              <FormControlLabel value="violent or repulsive content" control={<Radio />} label="Violent or Repulsive Content" />
              <FormControlLabel value="hateful or abusive" control={<Radio />} label="Hateful or Abusive" />
              <FormControlLabel value="harmful or dangerous acts" control={<Radio />} label="Harmful or Dangerous Acts" />
              <FormControlLabel value="misleading" control={<Radio />} label="Misleading" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReportDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReportSubmit} color="primary">
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PublicChat;
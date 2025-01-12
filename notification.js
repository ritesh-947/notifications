import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { 
  Badge,
  IconButton,
  Menu,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, 
  faTrash, 
  faCog, 
  faCheck, 
  faTimes,
  faExclamationTriangle,
  faUserPlus,
  faClock,
  faComment,
  faReply,
  faQuestion,
  faVideo 
} from '@fortawesome/free-solid-svg-icons';

const SOCKET_URL = 'http://localhost:8085';
const API_URL = 'http://localhost:8085/api';

const NotificationItem = ({ notification, onDelete, onClick }) => {
  const handleClick = () => onClick(notification);
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  const getNotificationColor = (type) => {
    const colors = {
      NEW_FOLLOWER: '#2196f3',
      SESSION_REMINDER: '#4caf50',
      QUESTION_ANSWER: '#ff9800',
      QUERY_REPLY: '#9c27b0',
      CREATOR_QUERY: '#f44336',
      NEW_SESSION: '#3f51b5'
    };
    return colors[type] || '#2196f3';
  };

  return (
    <>
      <ListItem
        onClick={handleClick}
        sx={{
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
          transition: 'background-color 0.2s',
          position: 'relative'
        }}
      >
        <ListItemAvatar>
          <Avatar 
            sx={{ 
              bgcolor: getNotificationColor(notification.type),
              fontWeight: 'bold'
            }}
          >
            {notification.sender_username?.charAt(0).toUpperCase() || '?'}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="body1" component="div" sx={{ pr: 4 }}>
              {notification.formatted_message}
            </Typography>
          }
          secondary={
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              {new Date(notification.created_at).toLocaleString()}
            </Typography>
          }
        />
        <IconButton
          size="small"
          onClick={handleDelete}
          sx={{
            position: 'absolute',
            right: 8,
            color: 'text.secondary',
            '&:hover': { color: 'error.main' }
          }}
        >
          <FontAwesomeIcon icon={faTrash} size="sm" />
        </IconButton>
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};

const NotificationPreferences = ({ open, onClose, preferences, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [localPreferences, setLocalPreferences] = useState(preferences);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setLocalPreferences(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(localPreferences);
      onClose();
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <FontAwesomeIcon icon={faCog} style={{ marginRight: '8px' }} />
          Notification Preferences
        </Box>
      </DialogTitle>
      <DialogContent>
        <FormGroup>
          {Object.entries(localPreferences).map(([key, value]) => (
            <FormControlLabel
              key={key}
              control={
                <Switch
                  checked={value}
                  onChange={handleChange}
                  name={key}
                  color="primary"
                />
              }
              label={key.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    session_reminders: true,
    question_answers: true,
    query_replies: true,
    creator_queries: true,
    new_followers: true,
    new_sessions: true,
    email_notifications: true,
    push_notifications: true,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const sessionId = localStorage.getItem('sessionId');
  const socketRef = useRef(null);
  const playNotificationSound = useNotificationSound();

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const initializeSocket = useCallback(() => {
    if (!userId || !sessionId || socketRef.current) return;

    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect_error', (error) => {
      showSnackbar('Connection error: ' + error.message, 'error');
    });

    newSocket.on('connect_timeout', () => {
      showSnackbar('Connection timeout', 'error');
    });

    newSocket.on('connect', () => {
      newSocket.emit('authenticate', { userId, sessionId });
    });

    newSocket.on('authenticated', () => {
      showSnackbar('Connected to notification service');
    });

    newSocket.on('authentication_error', (error) => {
      showSnackbar(error, 'error');
    });

    newSocket.on('newNotification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      playNotificationSound();
      showSnackbar('New notification received');
    });

    newSocket.on('notificationDeleted', (notificationId) => {
      setNotifications(prev => 
        prev.filter(n => n.id !== notificationId)
      );
    });

    newSocket.on('notificationsRead', () => {
      setUnreadCount(0);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  }, [userId, sessionId, playNotificationSound]);

  useEffect(() => {
    initializeSocket();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [initializeSocket]);

  const fetchNotifications = useCallback(async () => {
    // Ensure the user is authenticated before proceeding
    if (!username || !sessionId) return;

    // Set loading state to true while fetching notifications
    setLoading(true);
    try {
        // Send a GET request to fetch notifications for the specified username
        const response = await axios.get(
            `${API_URL}/notifications/${username}`, 
            {
                // Include the session ID in the headers for authorization
                headers: { Authorization: `Session ${sessionId}` }
            }
        );

        // Update the state with the fetched notifications
        setNotifications(response.data);

        // Clear any existing error messages
        setError(null);
    } catch (err) {
        // Log the error to the console for debugging
        console.error('Error fetching notifications:', err);

        // Set an error message in the state and display it in the UI
        setError('Failed to load notifications');
        showSnackbar('Failed to load notifications', 'error');
    } finally {
        // Reset the loading state after the API call is complete
        setLoading(false);
    }
}, [username, sessionId]);


const fetchUnreadCount = useCallback(async () => {
  // Ensure the user is authenticated before proceeding
  if (!username || !sessionId) return;

  try {
      // Send a GET request to fetch the unread notifications count for the specified username
      const response = await axios.get(
          `${API_URL}/notifications/unread/${username}`,
          {
              // Include the session ID in the headers for authorization
              headers: { Authorization: `Session ${sessionId}` }
          }
      );

      // Update the state with the unread notifications count
      setUnreadCount(response.data.count);
  } catch (err) {
      // Log the error to the console for debugging purposes
      console.error('Error fetching unread count:', err);
  }
}, [username, sessionId]);


const fetchPreferences = useCallback(async () => {
  // Ensure the user is authenticated before proceeding
  if (!userId || !sessionId) return;

  try {
      // Send a GET request to fetch the notification preferences for the specified user ID
      const response = await axios.get(
          `${API_URL}/notifications/preferences/${userId}`,
          {
              // Include the session ID in the headers for authorization
              headers: { Authorization: `Session ${sessionId}` }
          }
      );

      // Update the state with the fetched preferences
      setPreferences(response.data);
  } catch (err) {
      // Log the error to the console for debugging purposes
      console.error('Error fetching preferences:', err);

      // Show a user-friendly error message in a snackbar notification
      showSnackbar('Failed to load preferences', 'error');
  }
}, [userId, sessionId]);

useEffect(() => {
  // Fetch all required data (notifications, unread count, preferences) once the session ID is available
  if (sessionId) {
      fetchNotifications(); // Fetch the user's notifications
      fetchUnreadCount();   // Fetch the unread notifications count
      fetchPreferences();   // Fetch the user's notification preferences
  }
}, [sessionId, fetchNotifications, fetchUnreadCount, fetchPreferences]);


  const handleNotificationClick = (notification) => {
    setAnchorEl(null);
    switch (notification.type) {
      case 'NEW_FOLLOWER':
        navigate(`/user/${notification.sender_username}`);
        break;
      case 'QUESTION_ANSWER':
        navigate(`/questions/${notification.question_id}`);
        break;
      case 'QUERY_REPLY':
        navigate(`/queries/${notification.query_id}`);
        break;
      case 'NEW_SESSION':
        navigate(`/sessions/${notification.session_id}`);
        break;
      default:
        break;
    }
  };

  const handleNotificationMenuOpen = async (event) => {
    // Set the anchor element for the notification menu (used for rendering the menu at the correct position)
    setAnchorEl(event.currentTarget);

    // Check if there are any unread notifications
    if (unreadCount > 0) {
        try {
            // Send a PUT request to mark all notifications as read for the current user
            await axios.put(
                `${API_URL}/notifications/read/${username}`, // API endpoint for marking notifications as read
                {}, // Empty request body
                {
                    // Include the session ID in the headers for authorization
                    headers: { Authorization: `Session ${sessionId}` }
                }
            );

            // Update the unread count in the state to 0 since notifications are marked as read
            setUnreadCount(0);
        } catch (err) {
            // Log the error to the console for debugging purposes
            console.error('Error marking notifications as read:', err);

            // Show a user-friendly error message in a snackbar notification
            showSnackbar('Failed to mark notifications as read', 'error');
        }
    }
};


const handleNotificationDelete = async (notificationId) => {
  try {
      // Send a DELETE request to remove a specific notification by its ID
      await axios.delete(
          `${API_URL}/notifications/${notificationId}`, // API endpoint for deleting the notification
          {
              // Include the session ID in the headers for authorization
              headers: { Authorization: `Session ${sessionId}` }
          }
      );

      // Update the notifications state to remove the deleted notification
      setNotifications((prev) => 
          prev.filter(notification => notification.id !== notificationId) // Filter out the deleted notification by ID
      );

      // Show a success message to the user
      showSnackbar('Notification deleted');
  } catch (err) {
      // Log the error to the console for debugging
      console.error('Error deleting notification:', err);

      // Show an error message to the user in a snackbar notification
      showSnackbar('Failed to delete notification', 'error');
  }
};


const handlePreferencesUpdate = async (newPreferences) => {
  // Set the loading state to true to indicate an ongoing operation
  setLoading(true);

  try {
      // Send a PUT request to update the user's notification preferences
      await axios.put(
          `${API_URL}/notifications/preferences/${userId}`, // API endpoint for updating preferences
          newPreferences, // The updated preferences object sent in the request body
          {
              // Include the session ID in the headers for authorization
              headers: { Authorization: `Session ${sessionId}` }
          }
      );

      // Update the local state with the new preferences
      setPreferences(newPreferences);

      // Show a success message to the user indicating the preferences were updated
      showSnackbar('Preferences updated successfully');
  } catch (err) {
      // Log the error to the console for debugging purposes
      console.error('Error updating preferences:', err);

      // Show an error message to the user in a snackbar notification
      showSnackbar('Failed to update preferences', 'error');

      // Re-throw the error in case further error handling is required
      throw err;
  } finally {
      // Reset the loading state to false after the operation is complete
      setLoading(false);
  }
};


  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: '7rem' }}>
        <Tooltip title="Notifications">
          <IconButton 
            onClick={handleNotificationMenuOpen} 
            color="inherit" 
            disabled={loading}
          >
            <Badge 
              badgeContent={unreadCount} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#f44336',
                  color: 'white'
                }
              }}
            >
              <FontAwesomeIcon icon={faBell} />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title="Notification Settings">
          <IconButton 
            onClick={() => setPreferencesOpen(true)} 
            color="inherit"
            sx={{ ml: 1 }}
          >
            <FontAwesomeIcon icon={faCog} />
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            maxHeight: '400px',
            width: '350px',
            overflowX: 'hidden',
            mt: 1,
            '& .MuiList-root': {
              padding: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {error && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="error" variant="body2">
              <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: 8 }} />
              {error}
            </Typography>
          </Box>
        )}
        {!loading && !error && notifications.length === 0 && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="textSecondary">
              No notifications
            </Typography>
          </Box>
        )}

        {!loading && !error && notifications.length > 0 && (
          <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onDelete={handleNotificationDelete}
                onClick={handleNotificationClick}
              />
            ))}
          </List>
        )}
      </Menu>

      <NotificationPreferences
        open={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
        preferences={preferences}
        onUpdate={handlePreferencesUpdate}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            '& .MuiAlert-icon': {
              marginRight: 1
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <style jsx>{`
        .notification-menu {
          max-height: 400px;
          overflow-y: auto;
          scrollbar-width: thin;
        }
        
        .notification-menu::-webkit-scrollbar {
          width: 6px;
        }
        
        .notification-menu::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .notification-menu::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        
        .notification-menu::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .notification-item {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

// Prop Types
Notifications.propTypes = {
  className: PropTypes.string,
};

// Default Props
Notifications.defaultProps = {
  className: '',
};

// Styled Components
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#f44336',
    color: '#fff',
    fontSize: '0.75rem',
    height: '20px',
    minWidth: '20px',
    padding: '0 6px',
    [`${theme.breakpoints.down('sm')}`]: {
      height: '16px',
      minWidth: '16px',
      fontSize: '0.65rem',
      padding: '0 4px',
    },
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    minWidth: 350,
    maxWidth: '90vw',
    boxShadow: theme.shadows[3],
    [`${theme.breakpoints.down('sm')}`]: {
      minWidth: '100vw',
      maxHeight: '80vh !important',
      width: '100vw',
      margin: 0,
      borderRadius: 0,
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
}));

const StyledNotificationItem = styled(ListItem)(({ theme }) => ({
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  padding: theme.spacing(1.5, 2),
  [`${theme.breakpoints.down('sm')}`]: {
    padding: theme.spacing(1, 1.5),
  },
}));

// Custom Hooks
const useNotificationSound = () => {
  const [audio] = useState(new Audio('/notification-sound.mp3'));
  
  const playNotificationSound = useCallback(() => {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Auto-play was prevented, handle if needed
      });
    }
  }, [audio]);

  return playNotificationSound;
};

// Utility Functions
const formatNotificationTime = (date) => {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return notificationDate.toLocaleDateString();
};

const getNotificationIcon = (type) => {
  const icons = {
    NEW_FOLLOWER: faUserPlus,
    SESSION_REMINDER: faClock,
    QUESTION_ANSWER: faComment,
    QUERY_REPLY: faReply,
    CREATOR_QUERY: faQuestion,
    NEW_SESSION: faVideo,
  };
  return icons[type] || faBell;
};

export default Notifications;

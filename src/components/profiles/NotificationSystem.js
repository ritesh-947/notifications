import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  IconButton,
  Snackbar,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const sessionId = localStorage.getItem('sessionId');

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/visitor/notifications', {
        headers: { Authorization: `Session ${sessionId}` },
      });
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error.response?.data || error.message);
    }
  };

  // Mark notifications as read
  const markAsRead = async () => {
    try {
      await axios.post(
        'http://localhost:5050/api/visitor/mark-notifications-read',
        {},
        { headers: { Authorization: `Session ${sessionId}` } }
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error.response?.data || error.message);
    }
  };

  // Toggle notification dropdown
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications) {
      markAsRead();
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ position: 'relative', marginTop: '2rem' }}>
      {/* Notification Icon with Badge */}
      <IconButton onClick={toggleNotifications} color="inherit">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Notification Dropdown */}
      {showNotifications && (
        <Box
          sx={{
            position: 'absolute',
            top: '40px',
            right: 0,
            width: '300px',
            bgcolor: 'background.paper',
            boxShadow: 2,
            borderRadius: '8px',
            zIndex: 10,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              p: 2,
              borderBottom: '1px solid #ddd',
              textAlign: 'center',
            }}
          >
            Notifications
          </Typography>

          <List>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>{notification.creator_name?.charAt(0) || 'C'}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`You have got a reply from @${notification.creator_name}`}
                    secondary={new Date(notification.timestamp).toLocaleString()}
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                No notifications yet.
              </Typography>
            )}
          </List>
        </Box>
      )}

      {/* Snackbar for Notification Alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#f5f5f5',
            p: 1,
            borderRadius: '4px',
            boxShadow: 1,
          }}
        >
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {snackbar.message}
          </Typography>
          <IconButton onClick={() => setSnackbar({ ...snackbar, open: false })}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Snackbar>
    </Box>
  );
};

export default NotificationSystem;
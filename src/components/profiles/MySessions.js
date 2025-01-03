import React, { useState, useEffect } from 'react';
import { CardContent, Typography, Fab, Button, Grid, TextField } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import './MySessions.css'; // Import the CSS file

import {
  AttachMoney, // Icon for price
  Visibility, // Icon for impressions
  Group, // Icon for visitors
  Event // Icon for created at (date)
} from '@mui/icons-material';

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [editing, setEditing] = useState(null); // To track which session is being edited
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showMore, setShowMore] = useState({}); // To track the "Read more" state for each session
  const [error, setError] = useState(null); // To track errors

  // Fetch sessionId from localStorage
  const sessionId = localStorage.getItem('sessionId');

  useEffect(() => {
    if (!sessionId) {
      setError('No sessionId found. Please log in.');
      return;
    }

    const fetchSessions = async () => {
      try {
        const response = await axios.get('https://profile-server-gpoy.onrender.com/api/mysessions', {
        // const response = await axios.get('http://localhost:8081/api/mysessions', {
          headers: {
            Authorization: `Session ${sessionId}`, // Use sessionId in the header
          },
        });

        // Convert the video URLs to embed format
        const formattedSessions = response.data.map((session) => ({
          ...session,
          video_url: convertToEmbedURL(session.video_url),
        }));

        setSessions(formattedSessions);
      } catch (err) {
        console.error('Error fetching sessions:', err.response?.data || err.message);
        setError('Failed to fetch sessions. Please try again.');
      }
    };

    fetchSessions();
  }, [sessionId]);

  const convertToEmbedURL = (url) => {
    let videoId = '';

    if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1];
    } else if (url.includes('youtube.com/watch')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    }

    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleEdit = (session) => {
    setEditing(session.session_id);
    setEditTitle(session.session_title);
    setEditDescription(session.description);
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(
        `https://profile-server-gpoy.onrender.com/api/mysessions/${id}`,
        // `http://localhost:8081/api/mysessions/${id}`,
        {
          title: editTitle,
          description: editDescription,
        },
        {
          headers: {
            Authorization: `Session ${sessionId}`, // Use sessionId in the header
          },
        }
      );

      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.session_id === id
            ? { ...session, session_title: editTitle, description: editDescription }
            : session
        )
      );
      setEditing(null);
    } catch (err) {
      console.error('Error saving edits:', err.response?.data || err.message);
      setError('Failed to save changes. Please try again.');
    }
  };

  const deleteSession = async (id) => {
    try {
      await axios.delete(`https://profile-server-gpoy.onrender.com/api/mysessions/${id}`, {
      // await axios.delete(`http://localhost:8081/api/mysessions/${id}`, {
        headers: {
          Authorization: `Session ${sessionId}`, // Use sessionId in the header
        },
      });

      setSessions((prevSessions) => prevSessions.filter((session) => session.session_id !== id));
    } catch (err) {
      console.error('Error deleting session:', err.response?.data || err.message);
      setError('Failed to delete the session. Please try again.');
    }
  };

  const truncateTitle = (title, id) => {
    if (title.length > 40) {
      return showMore[id] ? title : `${title.slice(0, 40)}...`;
    }
    return title;
  };

  const toggleShowMore = (id) => {
    setShowMore((prevShowMore) => ({
      ...prevShowMore,
      [id]: !prevShowMore[id],
    }));
  };

  return (
    <Grid container justifyContent="center" spacing={3} sx={{ paddingLeft: '20px' }}
    style={{ marginBottom: '4rem' }}>
      {error && (
        <Typography
        variant="body2" // Adjust size
        style={{
          color: 'black', // Change color to black
          marginTop: '10px',
        }}
      >
        {error}
      </Typography>
      )}
      <div className="video-grid">
        {sessions.map((session) => (
          <div key={session.session_id} className="video-card">
            <iframe
              src={session.video_url}
              title={session.session_title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <CardContent sx={{ textAlign: 'left' }}>
              {editing === session.session_id ? (
                <>
                  <TextField
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    label="Edit Title"
                  />
                  <TextField
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    label="Edit Description"
                    rows={1}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => saveEdit(session.session_id)}
                    sx={{ float: 'right' }}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {truncateTitle(session.session_title, session.session_id)}{' '}
                    {session.session_title.length > 40 && (
                      <span
                        onClick={() => toggleShowMore(session.session_id)}
                        className="read-more"
                      >
                        {showMore[session.session_id] ? 'Show less' : 'Read more'}
                      </span>
                    )}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <AttachMoney sx={{ mr: 1 }} /> Price: ₹{session.price}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Visibility sx={{ mr: 1 }} /> Impressions: {session.impressions || 0}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Group sx={{ mr: 1 }} /> Visitors: {session.visitor_count || 0}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Event sx={{ mr: 1 }} /> Created At: {new Date(session.created_at).toLocaleString()}
      </Typography>
                </>
              )}
            </CardContent>
            {editing !== session.session_id && (
              <>
                <Fab
                  color="error"
                  size="small"
                  aria-label="delete"
                  className="delete-button"
                  onClick={() => deleteSession(session.session_id)}
                >
                  <Delete />
                </Fab>
                <Fab
                  color="primary"
                  size="small"
                  aria-label="edit"
                  className="edit-button"
                  onClick={() => handleEdit(session)}
                >
                  <Edit />
                </Fab>
              </>
            )}
          </div>
        ))}
      </div>
    </Grid>
  );
};

export default MySessions;
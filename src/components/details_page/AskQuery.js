import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Checkbox,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AskQuery = () => {
  const { session_id } = useParams();
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSendMessage = async () => {
    if (!message.trim()) {
      return setSnackbar({ open: true, message: 'Message cannot be empty', severity: 'error' });
    }
    setLoading(true);
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      setLoading(false);
      return setSnackbar({ open: true, message: 'You are not authenticated. Please log in.', severity: 'error' });
    }

    try {
      await axios.post(
        'https://promo-server-5iob.onrender.com/api/session_queries',
        // 'http://localhost:5011/api/session_queries',
        { session_id, message, anonymous },
        { headers: { Authorization: `Session ${sessionId}` } }
      );
      setMessage('');
      setAnonymous(false);
      setSnackbar({ open: true, message: 'Your query has been sent successfully!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'An error occurred. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Paper elevation={4} sx={{ maxWidth: 700, margin: 'auto', p: 4, mt: 5, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
        Ask Your Query
      </Typography>
      <TextField
        placeholder="Type your query..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        multiline
        minRows={2}
        maxRows={4}
        disabled={loading}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Checkbox
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          color="primary"
          disabled={loading}
        />
        <Typography variant="body2">Send as Anonymous</Typography>
        <Button
          variant="contained"
          color="success"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AskQuery;
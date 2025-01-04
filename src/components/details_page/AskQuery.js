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
        // 'https://promo-server-5iob.onrender.com/api/session_queries',
        'http://localhost:5011/api/session_queries',
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
    <Paper
      elevation={6}
      sx={{
        maxWidth: 600,
        margin: 'auto',
        p: 0.5,
        mt: 10,
        borderRadius: 4,
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          fontSize:'1.3rem',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#333',
          letterSpacing: '0.8px',
        }}
      >
        Ask Your Query
      </Typography>
      <TextField
        placeholder="Type your query..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        multiline
        minRows={1}
        maxRows={3}
        disabled={loading}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ccc',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#aaa',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4caf50',
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            color="success"
            disabled={loading}
          />
          <Typography variant="body2" sx={{ color: '#555' }}>
            Send as Anonymous
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="success"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={loading}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
              backgroundColor: '#45a049',
            },
          }}
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
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            borderRadius: '8px',
            backgroundColor:
              snackbar.severity === 'success' ? '#4caf50' : snackbar.severity === 'error' ? '#f44336' : undefined,
            color: '#fff',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AskQuery;
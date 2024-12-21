import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { WhatsApp, Facebook, LinkedIn, Twitter } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faTimes } from '@fortawesome/free-solid-svg-icons';
import './ShareModal.css'; // Add your custom styles if needed

const ShareModal = ({ open, handleClose, sessionId }) => {
  const shareUrl = `https://wanloft.com/session/${sessionId}`; // Replace with your session URL

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          margin: 'auto',
          width: '100%',
          maxWidth: '420px',
          borderRadius: '12px',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Share This Session
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <DialogContent style={{ textAlign: 'center' }}>
        <Typography variant="subtitle1" style={{ marginBottom: '20px' }}>
          Share this session with your friends or colleagues.
        </Typography>

        <Box display="flex" justifyContent="center" flexWrap="wrap" gap="15px" marginBottom="20px">
          <Button
            variant="contained"
            color="success"
            startIcon={<WhatsApp />}
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`}
            target="_blank"
          >
            WhatsApp
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Facebook />}
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
          >
            Facebook
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<LinkedIn />}
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
          >
            LinkedIn
          </Button>

          <Button
            variant="contained"
            color="info"
            startIcon={<Twitter />}
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
          >
            Twitter
          </Button>
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center" gap="10px">
          <input
            type="text"
            value={shareUrl}
            readOnly
            style={{
              width: '80%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          />
          <Button
            variant="contained"
            color="default"
            onClick={copyToClipboard}
            startIcon={<FontAwesomeIcon icon={faLink} />}
          >
            Copy Link
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Button, Box, Typography } from '@mui/material';
import { WhatsApp, Facebook, LinkedIn, Twitter, Instagram } from '@mui/icons-material';  // Added Instagram
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faXmark } from '@fortawesome/free-solid-svg-icons';
import './ShareModal.css'; // Custom CSS for ShareModal

const ShareModal = ({ open, handleClose, sessionId }) => {
  const shareUrl = `http://localhost:3345/session/${sessionId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard");
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
      className="custom-dialog"
    >
      <DialogTitle className="custom-dialog-title">
        <Typography variant="h5" className="share-title">
          Share This Session
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </IconButton>
      </DialogTitle>
      <DialogContent className="custom-dialog-content">
        <Typography variant="subtitle1" className="share-description">
          Check Out This Session At WebChat. Click The Link Below To Find More About The Session.
        </Typography>

        <Box className="social-buttons-container">
          <Button
            variant="contained"
            className="whatsapp-btn"
            href={`https://api.whatsapp.com/send?text=${shareUrl}`}
            target="_blank"
            startIcon={<WhatsApp />}
          >
            WhatsApp
          </Button>

          <Button
            variant="contained"
            className="facebook-btn"
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            startIcon={<Facebook />}
          >
            Facebook
          </Button>

          <Button
            variant="contained"
            className="linkedin-btn"
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
            target="_blank"
            startIcon={<LinkedIn />}
          >
            LinkedIn
          </Button>

          <Button
            variant="contained"
            className="twitter-btn"
            href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
            target="_blank"
            startIcon={<Twitter />}
          >
            Twitter
          </Button>

          <Button
            variant="contained"
            className="instagram-btn"
            href={`https://www.instagram.com/?url=${shareUrl}`}
            target="_blank"
            startIcon={<Instagram />}
          >
            Instagram
          </Button>
        </Box>

        <Box className="link-container">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="share-link-input"
          />
          <Button onClick={copyToClipboard} variant="contained" className="copy-btn">
            <FontAwesomeIcon icon={faLink} /> Copy Link
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
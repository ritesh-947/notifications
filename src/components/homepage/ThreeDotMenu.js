import React, { useState, useEffect } from 'react';
import {
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ReportIcon from '@mui/icons-material/Report';
import axios from 'axios';
import './ThreeDotMenu.css';

const ThreeDotMenu = ({ sessionId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isNotInterested, setIsNotInterested] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [loading, setLoading] = useState(false);

  const sessionIdFromStorage = localStorage.getItem('sessionId');

  // Check wishlist status on load
  useEffect(() => {
    if (!sessionId) return;

    const checkWishlistStatus = async () => {
      try {
        const response = await axios.get(`https://threedot-server.onrender.com/api/wishlist/check`, {
        // const response = await axios.get(`http://localhost:6004/api/wishlist/check`, {
          params: { sessionId },
          headers: { Authorization: `Session ${sessionIdFromStorage}` },
        });
        setIsInWishlist(response.data.isInWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error.message);
      }
    };

    checkWishlistStatus();
  }, [sessionId, sessionIdFromStorage]);

  const handleAddOrRemoveFromWishlist = async () => {
    setLoading(true);
    try {
      const endpoint = isInWishlist ? 'remove' : 'add';
      await axios.post(
        `https://threedot-server.onrender.com/api/wishlist/${endpoint}`,
        // `http://localhost:6004/api/wishlist/${endpoint}`,
        { sessionId },
        {
          headers: { Authorization: `Session ${sessionIdFromStorage}` },
        }
      );
      setIsInWishlist(!isInWishlist); // Toggle wishlist state
    } catch (error) {
      console.error(`Error ${isInWishlist ? 'removing from' : 'adding to'} wishlist:`, error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReportDialogOpen = () => {
    setReportDialogOpen(true);
    handleMenuClose();
  };

  const handleReportDialogClose = () => {
    setReportDialogOpen(false);
    setReportReason('');
  };


  const handleMarkNotInterested = async () => {
    try {
      await axios.post(
        'https://threedot-server.onrender.com/api/not-interested/add',
        // 'http://localhost:6004/api/not-interested/add',
        { sessionId },
        {
          headers: { Authorization: `Session ${sessionIdFromStorage}` },
        }
      );
      alert('Session marked as Not Interested.');
      setIsNotInterested(true);
    } catch (error) {
      console.error('Error marking session as Not Interested:', error.message);
      alert('Failed to mark as Not Interested. Please try again.');
    }
  };


  const handleReportSubmit = async () => {
    try {
      await axios.post(
        `https://threedot-server.onrender.com/api/session/${sessionId}/report`,
        // `http://localhost:6004/api/session/${sessionId}/report`,
        { reason: reportReason },
        {
          headers: { Authorization: `Session ${sessionIdFromStorage}` },
        }
      );
      alert('Report submitted successfully.');
      setReportDialogOpen(false);
      setReportReason('');
    } catch (error) {
      console.error('Error submitting report:', error.message);
      alert('Failed to submit the report. Please try again later.');
    }
  };

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleMenuOpen}>
        <MoreVertIcon />
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleAddOrRemoveFromWishlist} disabled={loading}>
          {loading ? (
            'Loading...'
          ) : isInWishlist ? (
            <>
              <FavoriteIcon /> Remove from Wishlist
            </>
          ) : (
            <>
              <FavoriteBorderIcon /> Add to Wishlist
            </>
          )}
        </MenuItem>
      <MenuItem disabled={isNotInterested} onClick={handleMarkNotInterested}>
  <ThumbDownIcon />
  {isNotInterested ? 'Marked as Not Interested' : "Don't Recommend"}
</MenuItem>

        <MenuItem onClick={handleReportDialogOpen}>
          <ReportIcon /> Report
        </MenuItem>
      </Menu>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onClose={handleReportDialogClose}>
        <DialogTitle>Report Session</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select Report Reason</FormLabel>
            <RadioGroup value={reportReason} onChange={(e) => setReportReason(e.target.value)}>
              <FormControlLabel value="spam" control={<Radio />} label="Spam" />
              <FormControlLabel value="inappropriate content" control={<Radio />} label="Inappropriate Content" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReportDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReportSubmit} color="primary" disabled={!reportReason}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ThreeDotMenu;
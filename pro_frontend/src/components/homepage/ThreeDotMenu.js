import React, { useState, useEffect } from 'react';
import { Menu, MenuItem, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ReportIcon from '@mui/icons-material/Report';
import axios from 'axios';
import './ThreeDotMenu.css';

const ThreeDotMenu = ({ sessionId, onShare }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isNotInterested, setIsNotInterested] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper to get sessionId from localStorage
  const getSessionId = () => localStorage.getItem('sessionId');

  // Fetch wishlist status
  const checkWishlistStatus = async () => {
    try {
      const sessionId = getSessionId();
      const response = await axios.get(`http://localhost:6004/api/wishlist/check`, {
        params: { sessionId },
        headers: { Authorization: `Session ${sessionId}` },
      });
      setIsInWishlist(response.data.isInWishlist);
      setLoading(false);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      setLoading(false);
    }
  };

  // Fetch "not interested" status
  const checkNotInterestedStatus = async () => {
    try {
      const sessionId = getSessionId();
      const response = await axios.get(`http://localhost:6004/api/not-interested/check`, {
        params: { sessionId },
        headers: { Authorization: `Session ${sessionId}` },
      });
      setIsNotInterested(response.data.isNotInterested);
    } catch (error) {
      console.error('Error checking "not interested" status:', error);
    }
  };

  useEffect(() => {
    if (sessionId) {
      checkWishlistStatus();
      checkNotInterestedStatus();
    }
  }, [sessionId]);

  const handleAddOrRemoveFromWishlist = async () => {
    const endpoint = isInWishlist ? 'remove' : 'add';
    try {
      const sessionId = getSessionId();
      await axios.post(`http://localhost:6004/api/wishlist/${endpoint}`, { sessionId }, {
        headers: { Authorization: `Session ${sessionId}` },
      });
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error(`Error ${isInWishlist ? 'removing from' : 'adding to'} wishlist:`, error);
    }
  };

  const handleDontRecommend = async () => {
    try {
      const sessionId = getSessionId();
      await axios.post(`http://localhost:6004/api/not-interested/add`, { sessionId }, {
        headers: { Authorization: `Session ${sessionId}` },
      });
      setIsNotInterested(true);
    } catch (error) {
      console.error('Error marking session as not interested:', error);
    }
  };

  const handleReportSubmit = async () => {
    try {
      const sessionId = getSessionId();
      await axios.post(`http://localhost:6004/api/report`, { sessionId, reportReason }, {
        headers: { Authorization: `Session ${sessionId}` },
      });
      setReportDialogOpen(false);
    } catch (error) {
      console.error('Error reporting session:', error);
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleReportDialogOpen = () => {
    handleMenuClose();
    setReportDialogOpen(true);
  };
  const handleReportDialogClose = () => setReportDialogOpen(false);

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleMenuOpen}>
        <MoreVertIcon />
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleAddOrRemoveFromWishlist} disabled={loading}>
          {loading ? 'Loading...' : isInWishlist ? <><FavoriteIcon /> Remove from Wishlist</> : <><FavoriteBorderIcon /> Add to Wishlist</>}
        </MenuItem>
        <MenuItem onClick={handleDontRecommend} disabled={isNotInterested}>
          {isNotInterested ? <><ThumbDownIcon /> Marked as Not Interested</> : <><ThumbDownIcon /> Don't Recommend</>}
        </MenuItem>
        <MenuItem onClick={() => { console.log('Share clicked'); onShare(); }}>
          <ShareIcon /> Share
        </MenuItem>
        <MenuItem onClick={handleReportDialogOpen}>
          <ReportIcon /> Report
        </MenuItem>
      </Menu>

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
          <Button onClick={handleReportDialogClose} color="primary">Cancel</Button>
          <Button onClick={handleReportSubmit} color="primary" disabled={!reportReason}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ThreeDotMenu;
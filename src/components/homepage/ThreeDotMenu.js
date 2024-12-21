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
import ShareModal from './ShareModal'; // Import the ShareModal component
import './ThreeDotMenu.css';

const ThreeDotMenu = ({ sessionId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isNotInterested, setIsNotInterested] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const sessionIdFromStorage = localStorage.getItem('sessionId');

  // Check wishlist status on load
  useEffect(() => {
    if (!sessionId) return;

    const checkWishlistStatus = async () => {
      console.log(`Checking wishlist status for sessionId: ${sessionId}`);
      try {
        const response = await axios.get(`http://localhost:6004/api/wishlist/check`, {
          params: { sessionId },
          headers: { Authorization: `Session ${sessionIdFromStorage}` },
        });
        console.log('Wishlist status:', response.data);
        setIsInWishlist(response.data.isInWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error.message);
      }
    };

    checkWishlistStatus();
  }, [sessionId, sessionIdFromStorage]);

  const handleAddOrRemoveFromWishlist = async () => {
    console.log(`Attempting to ${isInWishlist ? 'remove' : 'add'} sessionId ${sessionId} from/to wishlist`);
    setLoading(true);
    try {
      const endpoint = isInWishlist ? 'remove' : 'add';
      const response = await axios.post(
        `http://localhost:6004/api/wishlist/${endpoint}`,
        { sessionId },
        {
          headers: { Authorization: `Session ${sessionIdFromStorage}` },
        }
      );
      console.log(`Wishlist update successful:`, response.data);
      setIsInWishlist(!isInWishlist); // Toggle wishlist state
    } catch (error) {
      console.error(`Error ${isInWishlist ? 'removing from' : 'adding to'} wishlist:`, error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event) => {
    console.log('Opening menu for sessionId:', sessionId);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    console.log('Closing menu');
    setAnchorEl(null);
  };

  const handleReportDialogOpen = () => {
    console.log('Opening report dialog for sessionId:', sessionId);
    setReportDialogOpen(true);
    handleMenuClose();
  };

  const handleReportDialogClose = () => {
    console.log('Closing report dialog');
    setReportDialogOpen(false);
  };

  const handleReportSubmit = async () => {
    console.log(`Submitting report for sessionId: ${sessionId} with reason: ${reportReason}`);
    try {
      const response = await axios.post(
        `http://localhost:6004/api/report`,
        { sessionId, reportReason },
        {
          headers: { Authorization: `Session ${sessionIdFromStorage}` },
        }
      );
      console.log('Report submitted successfully:', response.data);
      setReportDialogOpen(false);
      setReportReason(''); // Reset the report reason
    } catch (error) {
      console.error('Error submitting report:', error.message);
    }
  };

  const handleShareClick = () => {
    console.log('Opening ShareModal for sessionId:', sessionId);
    setIsShareModalOpen(true);
    handleMenuClose();
  };

  const handleShareModalClose = () => {
    console.log('Closing ShareModal');
    setIsShareModalOpen(false);
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
        <MenuItem
          disabled={isNotInterested}
          onClick={() => {
            console.log(`Marking sessionId ${sessionId} as not interested`);
            setIsNotInterested(true);
          }}
        >
          <ThumbDownIcon />
          {isNotInterested ? 'Marked as Not Interested' : "Don't Recommend"}
        </MenuItem>
        <MenuItem onClick={handleShareClick}>
          <ShareIcon /> Share
        </MenuItem>
        <MenuItem onClick={handleReportDialogOpen}>
          <ReportIcon /> Report
        </MenuItem>
      </Menu>

      {/* Share Modal */}
      <ShareModal open={isShareModalOpen} handleClose={handleShareModalClose} sessionId={sessionId} />

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
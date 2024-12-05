import React, { useState, useEffect } from 'react';
import { Menu, MenuItem, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ReportIcon from '@mui/icons-material/Report';
import apiClient from './apiClient'; // Use the apiClient with token refresh logic
import './ThreeDotMenu.css';  // Assuming you have some CSS file for custom styling

const ThreeDotMenu = ({ sessionId, onShare }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);  // Track if session is in wishlist
  const [loading, setLoading] = useState(true);  // Track loading state
  const [isNotInterested, setIsNotInterested] = useState(false);  // Track if session is not interested
  const [reportReason, setReportReason] = useState('');  // Track the selected report reason
  const [reportDialogOpen, setReportDialogOpen] = useState(false); // Track the state of the report dialog


 // Function to refresh token
 const refreshToken = async () => {
  try {
    const response = await apiClient.post('/api/auth/refresh', {}, {
      baseURL: 'http://localhost:8080',
      withCredentials: true,
    });
    console.log('Token refreshed successfully:', response.data.message);
    return true;
  } catch (error) {
    console.error('Error refreshing token:', error.response?.data || error.message);
    return false;
  }
};
  
  // Fetch wishlist and "not interested" status on component mount
  useEffect(() => {
    if (sessionId) {
      checkWishlistStatus();
      checkNotInterestedStatus();
    } else {
      console.error('Session ID is missing');
    }
  }, [sessionId]);

  const checkWishlistStatus = async () => {
    try {
      console.log(`Checking wishlist status for session ${sessionId}`);
      
      const response = await apiClient.get('/api/wishlist/check', {
        baseURL: 'http://localhost:6004', // Add baseURL dynamically here
        params: { sessionId }, // Pass the session ID
        withCredentials: true, // Ensure cookies are sent
      });
      
      setIsInWishlist(response.data.isInWishlist); // Update wishlist status state
      setLoading(false); // Stop the loading state
  
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn('Access token expired, attempting refresh...');
        const refreshed = await refreshToken();
        
        if (refreshed) {
          console.log('Retrying wishlist status check after token refresh...');
          checkWishlistStatus(); // Retry fetching wishlist status after refreshing the token
        }
      } else {
        console.error('Error checking wishlist status:', error.response?.data || error.message);
        setLoading(false); // Ensure loading stops even if an error occurs
      }
    }
  };


  
  const checkNotInterestedStatus = () => {
    if (!sessionId) {
      console.error('Session ID is missing');
      return;
    }
  
    console.log(`Checking "not interested" status for session ${sessionId}`);
  
    apiClient
      .get(`/api/not-interested/check`, {
        baseURL: 'http://localhost:6004', // Ensure correct baseURL
        params: { sessionId }, // Pass the sessionId as a query parameter
        withCredentials: true, // Include cookies for user authentication
      })
      .then(response => {
        if (response.data?.isNotInterested !== undefined) {
          setIsNotInterested(response.data.isNotInterested); // Update state with response data
        } else {
          console.warn('Unexpected response format:', response.data);
        }
      })
      .catch(async (error) => {
        if (error.response?.status === 401) {
          console.warn('Access token expired, attempting refresh...');
          const refreshed = await refreshToken(); // Refresh token
  
          if (refreshed) {
            // Retry the operation after refreshing the token
            checkNotInterestedStatus(); 
          } else {
            console.error('Token refresh failed. Unable to check "not interested" status.');
          }
        } else {
          console.error('Error checking "not interested" status:', error);
        }
      });
  };
  const handleAddOrRemoveFromWishlist = async () => {
    if (!sessionId) {
      console.error('Session ID is missing');
      return;
    }
  
    const endpoint = isInWishlist ? 'remove' : 'add';
  
    try {
      const response = await apiClient.post(`/api/wishlist/${endpoint}`, 
        { sessionId },
        {
          baseURL: 'http://localhost:6004', // Dynamically added baseURL
          withCredentials: true, // Ensure cookies (including user_id) are sent with the request
        }
      );
  
      console.log(`Session ${endpoint === 'add' ? 'added to' : 'removed from'} wishlist:`, response.data);
      setIsInWishlist(!isInWishlist); // Toggle the local state
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn('Access token expired, attempting refresh...');
        const refreshed = await refreshToken();
  
        if (refreshed) {
          console.log('Token refreshed. Retrying wishlist operation...');
          handleAddOrRemoveFromWishlist(); // Retry after token refresh
        } else {
          console.error('Token refresh failed. Unable to handle wishlist operation.');
        }
      } else {
        console.error(
          `Error ${endpoint === 'add' ? 'adding to' : 'removing from'} wishlist:`,
          error.response || error.message
        );
      }
    }
  };


  const handleDontRecommend = async () => {
    if (!sessionId) {
      console.error('Session ID is missing');
      return;
    }
  
    try {
      const response = await apiClient.post(
        `/api/not-interested/add`,
        { sessionId },
        {
          baseURL: 'http://localhost:6004', // Dynamically add baseURL
          withCredentials: true, // Ensure cookies (including user_id) are sent with the request
        }
      );
  
      console.log('Session marked as not interested:', response.data);
      setIsNotInterested(true); // Update local state
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn('Access token expired, attempting refresh...');
        const refreshed = await refreshToken();
  
        if (refreshed) {
          console.log('Token refreshed. Retrying marking session as not interested...');
          handleDontRecommend(); // Retry operation after token refresh
        } else {
          console.error('Token refresh failed. Unable to mark session as not interested.');
        }
      } else {
        console.error(
          'Error marking session as not interested:',
          error.response || error.message
        );
      }
    }
  };

  // Handle opening and closing menus
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Handle opening and closing of report dialog
  const handleReportMenuOpen = () => {
    handleMenuClose();  // Close the 3-dot menu
    setReportDialogOpen(true);  // Open report dialog
  };
  const handleReportDialogClose = () => setReportDialogOpen(false);

  // Handle report submission
  const handleReportSubmit = () => {
    if (!sessionId || !reportReason) {
      console.error('Session ID or report reason is missing');
      return;
    }

    console.log(`Reporting session ${sessionId} for ${reportReason}`);

    apiClient.post('/api/report', {
      sessionId,
      reportReason // Ensure you're passing the correct report reason
    }, {
      baseURL: 'http://localhost:6004',  // Add baseURL dynamically here
      withCredentials: true // Ensure cookies (including user_id) are sent
    })
    .then(response => {
      console.log('Report submitted successfully:', response.data);
      setReportDialogOpen(false); // Close the report dialog on success
    })
    .catch(error => {
      console.error('Error reporting session:', error.response?.data || error.message);
    });
  };

  // Check if the report reason has been selected before enabling submission
  const isSubmitDisabled = !reportReason;

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
        <MenuItem onClick={handleReportMenuOpen}>
          <ReportIcon /> Report
        </MenuItem>
      </Menu>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onClose={handleReportDialogClose}>
        <DialogTitle>Report Session</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select Report Reason</FormLabel>
            <RadioGroup
              aria-label="report"
              name="report"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)} // Ensure report reason is updated
            >
              <FormControlLabel value="sexual content" control={<Radio />} label="Sexual Content" />
              <FormControlLabel value="violent or repulsive content" control={<Radio />} label="Violent or Repulsive Content" />
              <FormControlLabel value="hateful or abusive" control={<Radio />} label="Hateful or Abusive" />
              <FormControlLabel value="harmful or dangerous acts" control={<Radio />} label="Harmful or Dangerous Acts" />
              <FormControlLabel value="misleading" control={<Radio />} label="Misleading" />
              <FormControlLabel value="threats or violence" control={<Radio />} label="Threats or Violence" />
              <FormControlLabel value="self-harm" control={<Radio />} label="Self-Harm" />
              <FormControlLabel value="misinformation" control={<Radio />} label="Misinformation" />
              <FormControlLabel value="fraud or scam" control={<Radio />} label="Fraud or Scam" />
              <FormControlLabel value="harassment" control={<Radio />} label="Harassment" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReportDialogClose} color="primary">Cancel</Button>
          <Button onClick={handleReportSubmit} color="primary" disabled={isSubmitDisabled}>Submit Report</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ThreeDotMenu;
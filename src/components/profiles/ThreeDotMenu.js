// import React, { useState, useEffect } from 'react';
// import { Menu, MenuItem, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import ShareIcon from '@mui/icons-material/Share';
// import ThumbDownIcon from '@mui/icons-material/ThumbDown';
// import ReportIcon from '@mui/icons-material/Report';
// import './ThreeDotMenu.css';  // Assuming you have some CSS file for custom styling
// // import apiClient from './apiClient';


// const ThreeDotMenu = ({ sessionId, onShare }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [isInWishlist, setIsInWishlist] = useState(false);  // Track if session is in wishlist
//   const [loading, setLoading] = useState(true);  // Track loading state
//   const [isNotInterested, setIsNotInterested] = useState(false);  // Track if session is not interested
//   const [reportReason, setReportReason] = useState('');  // Track the selected report reason
//   const [reportDialogOpen, setReportDialogOpen] = useState(false); // Track the state of the report dialog


//   // Function to refresh tokens
//   const refreshToken = async () => {
//     try {
//       const response = await apiClient.post('/api/auth/refresh', {}, {
//         baseURL: 'http://localhost:8080',
//         withCredentials: true,
//       });
//       console.log('Token refreshed successfully:', response.data.message);
//       return true;
//     } catch (error) {
//       console.error('Error refreshing token:', error.response?.data || error.message);
//       return false;
//     }
//   };




//   // Fetch wishlist and "not interested" status on component mount
//  useEffect(() => {
//     const fetchStatuses = async () => {
//       const retryWishlist = () => checkWishlistStatus();
//       const retryNotInterested = () => checkNotInterestedStatus();

//       await Promise.allSettled([
//         checkWishlistStatus(retryWishlist),
//         checkNotInterestedStatus(retryNotInterested),
//       ]);
//     };

//     if (sessionId) fetchStatuses();
//   }, [sessionId]);


//   const checkWishlistStatus = async (retryFunction) => {
//     try {
//       const response = await apiClient.get(`http://localhost:6004/api/wishlist/check`, {
//         params: { sessionId },
//         withCredentials: true,
//       });
//       setIsInWishlist(response.data.isInWishlist);
//       setLoading(false);
//     } catch (error) {
//       if (error.response?.status === 401) {
//         console.warn('Access token expired, attempting refresh...');
//         const refreshed = await refreshToken();
//         if (refreshed) {
//           checkWishlistStatus(); // Retry fetching videos after refreshing token
//         }
//       } else {
//         console.error('Error fetching videos or user data:', error);
//         setLoading(false);
//       }
//     }
//   };


//   const checkNotInterestedStatus = async (retryFunction) => {
//     try {
//       const response = await apiClient.get(`http://localhost:6004/api/not-interested/check`, {
//         params: { sessionId },
//         withCredentials: true,
//       });
//       setIsNotInterested(response.data.isNotInterested);
//     } catch (error) {
//       if (error.response?.status === 401) {
//         console.warn('Access token expired, attempting refresh...');
//         const refreshed = await refreshToken();
//         if (refreshed) {
//           checkNotInterestedStatus(); // Retry fetching videos after refreshing token
//         }
//       } else {
//         console.error('Error fetching videos or user data:', error);
//         setLoading(false);
//       }
//     }
//   };
    
   
//   const handleAddOrRemoveFromWishlist = async () => {
//     const endpoint = isInWishlist ? 'remove' : 'add';

//     try {
//       const response = await apiClient.post(
//         `http://localhost:6004/api/wishlist/${endpoint}`,
//         { sessionId },
//         { withCredentials: true }
//       );
//       setIsInWishlist(!isInWishlist);
//       console.log(`Session ${endpoint} successfully:`, response.data);
//     } catch (error) {
//       if (error.response?.status === 401) {
//         console.warn('Access token expired, attempting refresh...');
//         const refreshed = await refreshToken();
//         if (refreshed) {
//           handleAddOrRemoveFromWishlist(); // Retry fetching videos after refreshing token
//         }
//       } else {
//         console.error('Error fetching videos or user data:', error);
//         setLoading(false);
//       }
//     }
//   };


//   const handleDontRecommend = async () => {

//     try {
//       const response = await apiClient.post(
//         `http://localhost:6004/api/not-interested/add`,
//         { sessionId },
//         { withCredentials: true }
//       );
//       setIsNotInterested(true);
//       console.log('Marked as not interested:', response.data);
//     } catch (error) {
//       if (error.response?.status === 401) {
//         console.warn('Access token expired, attempting refresh...');
//         const refreshed = await refreshToken();
//         if (refreshed) {
//           handleDontRecommend(); // Retry fetching videos after refreshing token
//         }
//       } else {
//         console.error('Error fetching videos or user data:', error);
//         setLoading(false);
//       }
//     }
//   };

//   // Handle opening and closing menus
//   const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);

//   // Handle opening and closing of report dialog
//   const handleReportMenuOpen = () => {
//     handleMenuClose();  // Close the 3-dot menu
//     setReportDialogOpen(true);  // Open report dialog
//   };
//   const handleReportDialogClose = () => setReportDialogOpen(false);

//   const handleReportSubmit = async () => {

//     try {
//       const response = await apiClient.post(
//         'http://localhost:6004/api/report',
//         { sessionId, reportReason },
//         { withCredentials: true }
//       );
//       console.log('Report submitted successfully:', response.data);
//       setReportDialogOpen(false);
//     } catch (error) {
//       if (error.response?.status === 401) {
//         console.warn('Access token expired, attempting refresh...');
//         const refreshed = await refreshToken();
//         if (refreshed) {
//           handleReportSubmit(); // Retry fetching videos after refreshing token
//         }
//       } else {
//         console.error('Error fetching videos or user data:', error);
//         setLoading(false);
//       }
//     }
//   };
//   // Check if the report reason has been selected before enabling submission
//   const isSubmitDisabled = !reportReason;

//   return (
//     <div>
//       <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleMenuOpen}>
//         <MoreVertIcon />
//       </Button>
//       <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
//         <MenuItem onClick={handleAddOrRemoveFromWishlist} disabled={loading}>
//           {loading ? 'Loading...' : isInWishlist ? <><FavoriteIcon /> Remove from Wishlist</> : <><FavoriteBorderIcon /> Add to Wishlist</>}
//         </MenuItem>
//         <MenuItem onClick={handleDontRecommend} disabled={isNotInterested}>
//           {isNotInterested ? <><ThumbDownIcon /> Marked as Not Interested</> : <><ThumbDownIcon /> Don't Recommend</>}
//         </MenuItem>
//         <MenuItem onClick={() => { console.log('Share clicked'); onShare(); }}>
//           <ShareIcon /> Share
//         </MenuItem>
//         <MenuItem onClick={handleReportMenuOpen}>
//           <ReportIcon /> Report
//         </MenuItem>
//       </Menu>

//       {/* Report Dialog */}
//       <Dialog open={reportDialogOpen} onClose={handleReportDialogClose}>
//         <DialogTitle>Report Session</DialogTitle>
//         <DialogContent>
//           <FormControl component="fieldset">
//             <FormLabel component="legend">Select Report Reason</FormLabel>
//             <RadioGroup
//               aria-label="report"
//               name="report"
//               value={reportReason}
//               onChange={(e) => setReportReason(e.target.value)} // Ensure report reason is updated
//             >
//               <FormControlLabel value="sexual content" control={<Radio />} label="Sexual Content" />
//               <FormControlLabel value="violent or repulsive content" control={<Radio />} label="Violent or Repulsive Content" />
//               <FormControlLabel value="hateful or abusive" control={<Radio />} label="Hateful or Abusive" />
//               <FormControlLabel value="harmful or dangerous acts" control={<Radio />} label="Harmful or Dangerous Acts" />
//               <FormControlLabel value="misleading" control={<Radio />} label="Misleading" />
//               <FormControlLabel value="threats or violence" control={<Radio />} label="Threats or Violence" />
//               <FormControlLabel value="self-harm" control={<Radio />} label="Self-Harm" />
//               <FormControlLabel value="misinformation" control={<Radio />} label="Misinformation" />
//               <FormControlLabel value="fraud or scam" control={<Radio />} label="Fraud or Scam" />
//               <FormControlLabel value="harassment" control={<Radio />} label="Harassment" />
//             </RadioGroup>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleReportDialogClose} color="primary">Cancel</Button>
//           <Button onClick={handleReportSubmit} color="primary" disabled={isSubmitDisabled}>Submit Report</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default ThreeDotMenu;
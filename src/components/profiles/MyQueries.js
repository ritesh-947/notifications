import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, IconButton, Avatar,
  Link, Menu, MenuItem, Button, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axios from 'axios';

import './MyQueries.css';
import ReportQueries from './ReportQueries';

const MyQueries = () => {
  const [queries, setQueries] = useState([]);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedQueryId, setSelectedQueryId] = useState(null);
  const [favorite, setFavorite] = useState({});
  const [showFullReply, setShowFullReply] = useState({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [currentQueryId, setCurrentQueryId] = useState(null);



    // Fetch sessionId from localStorage
    const sessionId = localStorage.getItem('sessionId');

    // Fetch queries
    const fetchVisitorQueries = async () => {
      try {
        const response = await axios.get('https://promo-server-5iob.onrender.com/api/visitor/queries', {
        // const response = await axios.get('http://localhost:5011/api/visitor/queries', {
          headers: {
            Authorization: `Session ${sessionId}`,
          },
        });

        const queriesData = response.data;

        // Fetch like statuses for replies
      
    // Set favorite statuses directly from the response
    const likeStatuses = queriesData.reduce((acc, query) => {
      acc[query.query_id] = query.reply_liked || false;
      return acc;
    }, {});

    setFavorite(likeStatuses);
    setQueries(queriesData); 
  
        if (response.status === 200) {
          return response.data; // Return queries
        } else {
          console.warn('No queries found.');
          return [];
        }
      } catch (error) {
        console.error('[ERROR] Failed to fetch visitor queries:', error.response?.data || error.message);
        return [];
      }
    };
  
    // Fetch replies
    const fetchReplies = async () => {
      try {
        const response = await axios.get('https://promo-server-5iob.onrender.com/api/creator/replies', {
        // const response = await axios.get('http://localhost:5011/api/creator/replies', {
          headers: {
            Authorization: `Session ${sessionId}`,
          },
        });
  
        if (response.status === 200) {
          return response.data; // Return replies
        } else {
          console.warn('No replies found.');
          return [];
        }
      } catch (error) {
        console.error('[ERROR] Failed to fetch replies:', error.response?.data || error.message);
        return [];
      }
    };
  
    // Fetch both queries and replies and merge them
    const fetchData = async () => {
      if (!sessionId) {
        console.error('[ERROR] No sessionId found in localStorage.');
        setLoading(false);
        return;
      }
  
      setLoading(true);
  
      try {
        const [queriesData, repliesData] = await Promise.all([fetchVisitorQueries(), fetchReplies()]);
  
        // Merge replies with their respective queries
        const mergedData = queriesData.map((query) => {
          const reply = repliesData.find((reply) => reply.query_id === query.query_id);
          return { ...query, reply: reply?.reply || null, reply_at: reply?.reply_at || null };
        });
  
        setQueries(mergedData); // Update queries with replies
      } catch (error) {
        console.error('[ERROR] Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  

  const handleReportClick = (queryId) => {
    if (!queryId) {
      console.error('No query ID provided for reporting');
      return;
    }
  
    // Find the specific query object by its ID
    const query = queries.find((q) => q.query_id === queryId);
  
    // Ensure that a reply exists before proceeding with the report dialog
    if (!query || !query.reply) {
      alert('You can only report if a reply exists.');
      return;
    }
  
    setCurrentQueryId(queryId); // Set the current query ID
    setOpenReportDialog(true);  // Open the report dialog
    handleMenuClose();          // Close the menu when reporting starts
  };
  
  const handleReportSubmit = async (reportReason) => {
    // Find the specific query object by its ID
    const query = queries.find((q) => q.query_id === currentQueryId);
  
    // Ensure that a reply exists before proceeding with the submission
    if (!query || !query.reply) {
      alert('You can only report if a reply exists.');
      return;
    }
  
    // Confirm before submitting the report
    const confirmSubmit = window.confirm('Are you sure you want to submit this report?');
  
    if (!confirmSubmit) {
      console.log('Report submission canceled by user');
      return;
    }
  
    // Fetch sessionId from localStorage
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      console.error('[ERROR] No sessionId found in localStorage.');
      alert('You are not logged in. Please log in and try again.');
      return;
    }
  
    try {
      const response = await axios.post(
        'https://promo-server-5iob.onrender.com/api/visitor/report-reply',
        // 'http://localhost:5011/api/visitor/report-reply',
        {
          query_id: currentQueryId,
          reply_reported: true,
          reply_report_reason: reportReason,
        },
        {
          headers: {
            Authorization: `Session ${sessionId}`, // Use sessionId for authentication
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        alert('Report submitted successfully.');
      } else {
        alert('Failed to submit the report.');
      }
    } catch (error) {
      console.error('[ERROR] Failed to submit report:', error.response?.data || error.message);
      alert('An error occurred while submitting the report. Please try again later.');
    } finally {
      setOpenReportDialog(false); // Close the report dialog
      setCurrentQueryId(null); // Reset currentQueryId
    }
  };
  
// Handle query deletion
const handleDeleteQuery = async (queryId) => {
  if (!sessionId) {
    console.error('[ERROR] No sessionId found in localStorage.');
    return;
  }

  const confirmDelete = window.confirm('Are you sure you want to delete this query?');
  if (!confirmDelete) return;

  try {
    const response = await axios.delete(`https://promo-server-5iob.onrender.com/api/visitor/delete-query/${queryId}`, {
    // const response = await axios.delete(`http://localhost:5011/api/visitor/delete-query/${queryId}`, {
      headers: {
        Authorization: `Session ${sessionId}`,
      },
    });

    if (response.status === 200) {
      setQueries((prevQueries) => prevQueries.filter((query) => query.query_id !== queryId));
      alert('Query deleted successfully.');
    } else {
      alert('Failed to delete the query.');
    }
  } catch (error) {
    console.error('[ERROR] Failed to delete query:', error.response?.data || error.message);
  }
};


  const toggleReplyVisibility = (queryId) => {
    setShowFullReply((prev) => ({
      ...prev,
      [queryId]: !prev[queryId],
    }));
  };


   // Fetch favorite status of replies
// Fetch favorite status of replies
useEffect(() => {
  const fetchFavoriteStatuses = async () => {
    const sessionId = localStorage.getItem('sessionId'); // Fetch sessionId from localStorage

    if (!sessionId) {
      console.error('[ERROR] No sessionId found in localStorage.');
      setLoading(false);
      return;
    }

    try {
      const favoriteStatuses = {};

      // Iterate through queries to fetch favorite status for each reply
      for (let query of queries) {
        if (query.reply) {
          const response = await axios.get(
            `https://promo-server-5iob.onrender.com/api/visitor/favorite-reply-status/${query.query_id}`,
            // `http://localhost:5011/api/visitor/favorite-reply-status/${query.query_id}`,
            {
              headers: {
                Authorization: `Session ${sessionId}`, // Use sessionId in Authorization header
              },
            }
          );

          if (response.status === 200) {
            favoriteStatuses[query.query_id] = response.data.reply_liked;
          } else {
            console.warn(
              `[WARN] Unexpected response for query_id ${query.query_id}:`,
              response.status
            );
          }
        }
      }

      setFavorite(favoriteStatuses); // Update favorite statuses in state
    } catch (error) {
      console.error('[ERROR] Failed to fetch favorite statuses:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (queries.length > 0) {
    fetchFavoriteStatuses();
  }
}, [queries]); // Runs whenever 'queries' state changes

    // Toggle favorite status
    const handleFavoriteClick = async (queryId) => {
      if (!sessionId) {
        console.error('[ERROR] No sessionId found in localStorage.');
        return;
      }
  
      const isLiked = !favorite[queryId];
  
      try {
        const response = await axios.post(
          'https://promo-server-5iob.onrender.com/api/visitor/favorite-reply',
          // 'http://localhost:5011/api/visitor/favorite-reply',
          {
            query_id: queryId,
            is_liked: isLiked,
          },
          {
            headers: {
              Authorization: `Session ${sessionId}`,
              'Content-Type': 'application/json',
            },
          }
        );
  
        if (response.status === 200) {
          setFavorite((prev) => ({
            ...prev,
            [queryId]: isLiked,
          }));
        } else {
          console.error('[ERROR] Failed to update favorite status');
        }
      } catch (error) {
        console.error('[ERROR] Failed to toggle favorite status:', error.response?.data || error.message);
      }
    };
  

  const handleMenuClick = (event, queryId) => {
    setSelectedQueryId(queryId);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedQueryId(null);
  };


  // Close confirmation dialog
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (queries.length === 0) {
    return <Typography>No queries found</Typography>;
  }

  return (
    <Box className="responsive-padding"  sx={{ marginTop: '3rem' }}>
      {/* <Typography variant="h6" gutterBottom style={{ paddingTop: '3rem'}} align="center">My Queries</Typography> */}

      {queries.map((query) => (
        <Card  style={{ maxWidth: '500px', margin: '0 auto', marginTop:'0.5rem' }} key={query.query_id} className="my-query-card" sx={{ mb: 1 ,
          backgroundColor: '#f7f7f7', // Set default background color
          '&:hover': {
            backgroundColor: '#f0f0f0', // Change background color on hover
          },
          transition: 'background-color 0.3s', // Smooth transition effect
        }} >
          <CardContent style={{ maxWidth: '500px', margin: '0 auto',marginTop:'0rem' }}>
            <Grid container alignItems="center" justifyContent="space-between"  >
              <Grid item xs>
              {query.reply && (
                 <Typography
                  variant="body1"
                  sx={{
                    position: 'relative',
                    top: '-25px',
                    left: '-20px',
                    marginBottom: '4px',
                    width: '120%',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    color:'#222'
                  
                  }}
                >
                  You Got Reply From     <Link
    href={`https://wanloft.com/user/${query.visitor_id}`}
    underline="none">
@{query.creator_username}</Link> on session "
                  <Link
                    href={`https://wanloft.com/session/${query.session_id}`}
                    
                    color="primary"
                    underline="none"
                  >
                    {query.session_title}
                  </Link>
                  " at {new Date(query.msg_at).toLocaleString()}
                </Typography> 
              )}
                <Box display="flex" alignItems="center" mt={-2}>
                <Link
    href={`http://localhost:3232/`}
    underline="none">

                  <Avatar
                    className="avatar"
                    sx={{
                      bgcolor: query.anonymous ? '#ccc' : '#00bcd4',
                      fontSize: '0.9rem',
                      width: 40,
                      height: 40,
                    }}
                  >
                    {query.anonymous ? 'A' : query.visitor_username?.charAt(0)}
                  </Avatar>
                  </Link>
                  <Typography
                    variant="body2"
                    className="visitor-username"
                    sx={{
                      position: 'relative',
                      top: '-10px',
                      left: '-5px',
                      marginBottom: '2px',
                      opacity: 0.8,
                    }}
                  >
                     <Link
    href={`http://localhost:3232/user/`}
    underline="none"  // Remove underline
    sx={{
      color: 'inherit', // Inherit the color to prevent color change
      textDecoration: 'none', // Ensure no underline appears
      opacity: 0.8, // Default opacity
      '&:hover': {
        opacity: 1, // Increase opacity on hover
      },
    }}
  >
                    {query.anonymous ? 'Anonymous User' : `${query.visitor_username}`}
                    </Link>
                  </Typography>
                </Box>
              </Grid>

              <Grid item>
                {/* <IconButton onClick={(e) => handleMenuClick(e, query.query_id)}>
                  <MoreVertIcon />
                </IconButton> */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && selectedQueryId === query.query_id}
                  onClose={handleMenuClose}
                >
                 <MenuItem onClick={() => handleDeleteQuery(query.query_id)}>Delete</MenuItem>
    
                 <MenuItem onClick={() => handleReportClick(query.query_id)}>
  Report
</MenuItem>
                </Menu>
              </Grid>
            </Grid>
            <ReportQueries
  open={openReportDialog}
  onClose={() => setOpenReportDialog(false)}
  onSubmit={handleReportSubmit}
/>
            {/* Display query message */}
            <Box className="query-container" ml={5} mr={-1} mt={-3.7} >
              <Typography variant="body2"className="query-message" fontSize= "0.9rem" color='#222222'>
                {query.message || 'No message available'}
              </Typography>
            </Box>

 {/* Confirmation dialog for deleting a query */}
 <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this query? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteQuery} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
            {/* Toggle reply visibility */}
            {query.reply && (
              <Box mt={0}>
                <IconButton onClick={() => toggleReplyVisibility(query.query_id)}>
                  {showFullReply[query.query_id] ? (
                    <Box display="flex" alignItems="center">
                      <Typography variant="body1" color="primary" fontSize="0.8rem">View Reply</Typography>
                      <ExpandLessIcon />
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center">
                      <Typography variant="body1" color="green" fontSize="0.8rem">View Reply</Typography>
                      <ExpandMoreIcon />
                    </Box>
                  )}
                </IconButton>

                {/* Display reply content if open */}
                {showFullReply[query.query_id] && (
                  <Box mt={0} ml={0}>
                    <Grid container alignItems="center">
                      <Grid item>
                      <Link
    href={`http://localhost:3232/user/${query.creator_id}`}
    underline="none"
    
  >
    <Avatar sx={{ bgcolor: '#4caf50', mr: 1 }}>
      {query.creator_username?.charAt(0) || 'C'}
    </Avatar>
                        </Link>
                      </Grid>
                      <Grid item>
 
</Grid>
<Link
    href={`http://localhost:3232/user/${query.creator_id}`}
    underline="none"  // Remove underline
    sx={{
      color: 'inherit', // Inherit the color to prevent color change
      textDecoration: 'none', // Ensure no underline appears
      opacity: 0.8, // Default opacity
      '&:hover': {
        opacity: 1, // Increase opacity on hover
      },
    }}
  >
    <Typography
      variant="body2"
      sx={{
        display: 'inline-block', // Ensures it behaves like inline text
        position: 'relative',
        top: '-10px',
        left: '0px',
        margin: 0, // Remove margin to avoid unwanted space
        opacity: 'inherit', // Inherit opacity from Link
      }}
    >
      {query.creator_username}
    </Typography>
  </Link>
</Grid>

                    <Box className="reply-container" sx={{ mt: -3, ml: 2,mr:3, }}>
                      <Typography variant="body2" color="#222222" sx={{ mt: -0.3, ml: 5 }} className="reply-message" >
                        {query.reply}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={2} mt={1}>
    {/* Favorite Button with Feedback */}
    <IconButton
  onClick={() => handleFavoriteClick(query.query_id)}
  aria-label={favorite[query.query_id] ? "Unlike" : "Like"} // Accessibility
  sx={{
    '&:hover': { transform: 'scale(1.1)' }, // Slight zoom on hover for feedback
    transition: 'transform 0.1s ease-in-out', // Smooth transition effect
  }}
>
  {favorite[query.query_id] ? (
    <FavoriteIcon sx={{ color: 'red' }} />
  ) : (
    <FavoriteBorderIcon />
  )}
</IconButton>
  
  {/* View Session Button */}
  <Button 
    variant="outlined" 
    href={`http://localhost:3345/session/${query.session_id}`}
    sx={{
      textTransform: 'none', // Keep original text case
      color: 'primary.main',
      borderColor: 'primary.main',
      '&:hover': { 
        backgroundColor: 'primary.light', 
        borderColor: 'primary.dark',
        color:'white' 
      },
    }}
  >
    View Session
  </Button>
</Box>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default MyQueries;
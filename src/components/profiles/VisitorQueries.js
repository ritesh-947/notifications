// import React, { useState, useEffect, useCallback } from 'react';
// import { Box, Typography, Avatar, Card, CardContent, Grid, Button, TextField, IconButton, Menu, MenuItem, Link, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import ReportIcon from '@mui/icons-material/Report';
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

// import './VisitorQueries.css';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import { Select,  InputLabel } from '@mui/material';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import ReportQueries from './ReportQueries'; // Adjust the path as needed



// const MAX_CHAR_LIMIT = 1024;
// const MAX_LINES_MESSAGE = 30;
// const MAX_LINES_REPLY = 200;


// const VisitorQueries = () => {
//   const [queries, setQueries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [replyData, setReplyData] = useState({});
//   const [replies, setReplies] = useState([]); 
//   const [expanded, setExpanded] = useState({});
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedQueryId, setSelectedQueryId] = useState(null);
//   const [favorite, setFavorite] = useState({});
//   const [reportDialogOpen, setReportDialogOpen] = useState(false);
//   const [reportReason, setReportReason] = useState('');
//   const [blockThisSession, setBlockThisSession] = useState(false);
//   const [blockAllSessions, setBlockAllSessions] = useState(false);
//   const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  
//   const [showFilter, setShowFilter] = useState(false); // Toggle state for filter visibility
//   const [isReply, setIsReply] = useState(false); // State to identify if reporting a reply
// // Add a state for toggling reply visibility
// const [showFullReply, setShowFullReply] = useState({});
// // Add a state for tracking the visibility of the reply input
// const [isReplyOpen, setIsReplyOpen] = useState({});
// const [isEditing, setIsEditing] = useState({}); // NEW state for tracking edit mode
// // Add a new state for sorting
// // States for sorting
// const [sortByDate, setSortByDate] = useState('newest');
// const [sortByReply, setSortByReply] = useState('all');
// const [filteredQueries, setFilteredQueries] = useState([]);


// const debounce = (func, delay) => {
//   let timer;
//   return (...args) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       console.log('Debounced function called with args:', args);
//       func(...args);
//     }, delay);
//   };
// };

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





// // Debounced sorting function
// useEffect(() => {
//   console.log('Debounced sorting useEffect triggered');

//   const debouncedSort = debounce((dateCriteria, replyCriteria) => {
//     console.log('DebouncedSort function executing');
//     console.log('Current Queries:', queries);
//     console.log('Sort by Date:', dateCriteria);
//     console.log('Sort by Reply:', replyCriteria);

//     let sortedQueries = [...queries];

//     // Filter by reply status
//     if (replyCriteria === 'replied') {
//       console.log('Filtering: Replied queries');
//       sortedQueries = sortedQueries.filter((query) => query.reply);
//     } else if (replyCriteria === 'unreplied') {
//       console.log('Filtering: Unreplied queries');
//       sortedQueries = sortedQueries.filter((query) => !query.reply);
//     } else {
//       console.log('Filtering: Showing all queries');
//     }

//     // Sort by date
//     if (dateCriteria === 'newest') {
//       console.log('Sorting by: Newest First');
//       sortedQueries.sort((a, b) => new Date(b.msg_at) - new Date(a.msg_at));
//     } else if (dateCriteria === 'oldest') {
//       console.log('Sorting by: Oldest First');
//       sortedQueries.sort((a, b) => new Date(a.msg_at) - new Date(b.msg_at));
//     }

//     console.log('Sorted and filtered queries:', sortedQueries);
//     setFilteredQueries(sortedQueries);
//   }, 300);

//   debouncedSort(sortByDate, sortByReply);
// }, [queries, sortByDate, sortByReply]);

// const handleFilterToggle = () => {
//   console.log('Filter toggle clicked');
//   setShowFilter((prev) => {
//     if (prev) {
//       console.log('Filter closed, resetting sorting to defaults');
//       setSortByDate('newest');
//       setSortByReply('all');
//       setFilteredQueries(queries);
//     } else {
//       console.log('Filter opened');
//     }
//     return !prev;
//   });
// };

// const handleDateSortChange = (event) => {
//   const newDateSort = event.target.value;
//   console.log('Date sort changed to:', newDateSort);
//   setSortByDate(newDateSort);
// };

// const handleReplySortChange = (event) => {
//   const newReplySort = event.target.value;
//   console.log('Reply sort changed to:', newReplySort);
//   setSortByReply(newReplySort);
// };

// // Handle showing/hiding the reply input field
// const toggleReplyField = (queryId) => {
//   setIsReplyOpen((prevState) => ({
//     ...prevState,
//     [queryId]: !prevState[queryId],
//   }));
  
//   // Reset the reply data if closing the field
//   if (isReplyOpen[queryId]) {
//     setReplyData((prevData) => ({
//       ...prevData,
//       [queryId]: { open: false, reply: '', charactersLeft: MAX_CHAR_LIMIT },
//     }));
//   }
// };

// // Handle displaying "Reply" or "Close Reply" based on the state
// const renderReplyButtonText = (queryId) => {
//   return isReplyOpen[queryId] ? 'Close Reply' : 'Reply';
// };
  

//   useEffect(() => {
//     const fetchDecryptedMessages = async () => {
//       try {
//         const response = await apiClient.get('http://localhost:5011/api/creator/queries', {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' },
//         });
  
//         if (response.status === 200) {
//           const decryptedData = response.data;
//           console.log('Decrypted Messages:', decryptedData);
  
//           // Set the state with decrypted data
//           setQueries(decryptedData);
//           setFilteredQueries(decryptedData);

//           // Fetch like status for each query
//           await fetchLikeStatuses(decryptedData.map(query => query.query_id));
//         } else {
//           console.log('No decrypted queries found.');
//           setQueries([]);

//         }
//       } catch (error) {
//         if (error.response?.status === 401) {
//           console.warn('Access token expired, attempting refresh...');
//           const refreshed = await refreshToken();
//           if (refreshed) {
//             fetchDecryptedMessages(); // Retry fetching videos after refreshing token
//           }
//         } else {
//           console.error('Error fetching videos or user data:', error);
//           setLoading(false);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     // Call fetch function only once when the component mounts
//     fetchDecryptedMessages();
//   }, []); // Empty dependency array means this effect runs only once

// // Function to fetch like statuses when queries load
// const fetchLikeStatuses = async (queryIds) => {
//   try {
//     const statuses = await Promise.all(
//       queryIds.map(async (queryId) => {
//         const response = await apiClient.get(`http://localhost:5011/api/creator/message-like-status/${queryId}`, {
//           withCredentials: true,
//         });
//         return { queryId, messageLiked: response.data.message_liked };
//       })
//     );

//     const newFavorites = {};
//     statuses.forEach(({ queryId, messageLiked }) => {
//       newFavorites[queryId] = messageLiked;
//     });
//     setFavorite(newFavorites); // Update state to reflect current like statuses
//   } catch (error) {
//     if (error.response?.status === 401) {
//       console.warn('Access token expired, attempting refresh...');
//       const refreshed = await refreshToken();
//       if (refreshed) {
//         fetchLikeStatuses(); // Retry fetching videos after refreshing token
//       }
//     } else {
//       console.error('Error fetching videos or user data:', error);
//       setLoading(false);
//     }
//   }
// };

//   // Fetch the replies for the logged-in creator
// useEffect(() => {
//   const fetchReplies = async () => {

//     try {
//       const response = await apiClient.get('http://localhost:5011/api/creator/replies', {
//         withCredentials: true,
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (response.status === 200) {
//         console.log('Replies:', response.data);
//         setReplies(response.data); // Set replies data
//       } else {
//         console.log('No replies found.');
//         setReplies([]);
//       }
//     } catch (error) {
//       if (error.response?.status === 401) {
//         console.warn('Access token expired, attempting refresh...');
//         const refreshed = await refreshToken();
//         if (refreshed) {
//           fetchReplies(); // Retry fetching videos after refreshing token
//         }
//       } else {
//         console.error('Error fetching videos or user data:', error);
//         setLoading(false);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//   // Call fetchReplies once when the component mounts
//   fetchReplies();
// }, []); // Empty dependency array means this effect runs only once

// // Handle showing the reply field for a specific query (Edit or new reply)
// const handleReplyClick = (queryId, isEdit = false) => {
//   const existingReply = replies.find((reply) => reply.query_id === queryId)?.reply || '';

//   // Set reply data and open the field
//   setReplyData((prevData) => ({
//     ...prevData,
//     [queryId]: { 
//       open: true, 
//       reply: isEdit ? existingReply : '', 
//       charactersLeft: MAX_CHAR_LIMIT - existingReply.length 
//     },
//   }));

//   // Set reply field to open
//   setIsReplyOpen((prevState) => ({
//     ...prevState,
//     [queryId]: true,
//   }));

//   // Set the editing mode to true if it's an edit operation
//   setIsEditing((prevState) => ({
//     ...prevState,
//     [queryId]: isEdit,
//   }));
// };
//   // Function to handle canceling the edit
//   const handleCancelEdit = (queryId) => {
//     setIsReplyOpen((prevState) => ({
//       ...prevState,
//       [queryId]: false,
//     }));
  
//     setIsEditing((prevState) => ({
//       ...prevState,
//       [queryId]: false,
//     }));
//   };

// // Handle reply input change with character limit
// const handleReplyChange = (event, queryId) => {
//   const value = event.target.value;
//   if (value.length <= MAX_CHAR_LIMIT) {
//     setReplyData((prevData) => ({
//       ...prevData,
//       [queryId]: { ...prevData[queryId], reply: value, charactersLeft: MAX_CHAR_LIMIT - value.length },
//     }));
//   }
// };




// const handleReplySubmit = async (queryId, isEdit = false) => {
//   const replyMessage = replyData[queryId]?.reply;

//   // Log the reply message and edit status
//   console.log('Submitting Reply for Query ID:', queryId);
//   console.log('Reply Message:', replyMessage);
//   console.log('Is Edit:', isEdit);

//   if (!replyMessage || !replyMessage.trim()) {
//     console.log('No reply message provided or it is empty.');
//     return;
//   }

//   try {
//     const endpoint = isEdit ? `/api/creator/edit-reply/${queryId}` : `/api/creator/reply/${queryId}`;
//     console.log('API Endpoint:', endpoint);

//     const response = await apiClient.post(`http://localhost:5011${endpoint}`, 
//       { reply: replyMessage },
//       {
//         withCredentials: true,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );

//     console.log('Response Status:', response.status);
//     if (response.status === 200) {
//       console.log('Reply Submitted Successfully:', response.data);
//       setQueries((prevQueries) => {
//         const updatedQueries = prevQueries.map((query) => {
//           if (query.query_id === queryId) {
//             console.log('Updating reply for Query ID:', queryId); // Debug log
//             return { 
//               ...query, 
//               reply: response.data.reply || query.reply, 
//               reply_at: response.data.reply_at 
//             };
//           }
//           return query;
//         });

//           // Update the replies state
//       setReplies((prevReplies) => {
//         // If editing, update the existing reply
//         if (isEdit) {
//           return prevReplies.map((reply) =>
//             reply.query_id === queryId
//               ? { ...reply, reply: replyMessage, reply_at: response.data.reply_at }
//               : reply
//           );
//         } else {
//           // If new reply, add it to the replies array
//           const newReply = {
//             query_id: queryId,
//             reply: replyMessage,
//             reply_at: response.data.reply_at,
//           };
//           return [...prevReplies, newReply];
//         }
//       });

      
//         console.log('Updated Queries:', updatedQueries);
//         return updatedQueries;
//       });

//       setReplyData((prevData) => ({
//         ...prevData,
//         [queryId]: { open: false, reply: '', charactersLeft: MAX_CHAR_LIMIT },
//       }));
//     }

//     setIsReplyOpen((prevState) => ({
//       ...prevState,
//       [queryId]: false,
//     }));

//     setIsEditing((prevState) => ({
//       ...prevState,
//       [queryId]: false,
//     }));

//   } catch (error) {
//     if (error.response?.status === 401) {
//       console.warn('Access token expired, attempting refresh...');
//       const refreshed = await refreshToken();
//       if (refreshed) {
//         handleReplySubmit(); // Retry fetching videos after refreshing token
//       }
//     } else {
//       console.error('Error fetching videos or user data:', error);
//       setLoading(false);
//     }
  
//   }
// };



//   // Handle deleting a reply with confirmation
//   const handleDeleteReply = async (queryId) => {
//     const confirmDelete = window.confirm('Are you sure you want to delete this reply? This action cannot be undone.');
//     if (!confirmDelete) return;

//     try {
//       const response = await apiClient.delete(`http://localhost:5011/api/creator/delete-reply/${queryId}`, {
//         withCredentials: true,
//       });

//       if (response.status === 200) {
//         setQueries((prevQueries) =>
//           prevQueries.map((query) =>
//             query.query_id === queryId ? { ...query, reply: null, reply_at: null } : query
//           )
//         );
//            // Update the replies state to remove the deleted reply
//       setReplies((prevReplies) => prevReplies.filter((reply) => reply.query_id !== queryId));
//       }
//     } catch (error) {
//       if (error.response?.status === 401) {
//         console.warn('Access token expired, attempting refresh...');
//         const refreshed = await refreshToken();
//         if (refreshed) {
//           handleDeleteReply(); // Retry fetching videos after refreshing token
//         }
//       } else {
//         console.error('Error fetching videos or user data:', error);
//         setLoading(false);
//       }
//     }
//   };
  
//  // Toggle like status of a message
//  const handleFavoriteClick = async (queryId) => {
//   const newFavoriteStatus = !favorite[queryId];

//   try {
//     await apiClient.post('http://localhost:5011/api/creator/toggle-message-like', {
//       query_id: queryId,
//       is_liked: newFavoriteStatus,
//     }, {
//       withCredentials: true,
//     });

//     setFavorite((prev) => ({
//       ...prev,
//       [queryId]: newFavoriteStatus,
//     }));
//   } catch (error) {
//     if (error.response?.status === 401) {
//       console.warn('Access token expired, attempting refresh...');
//       const refreshed = await refreshToken();
//       if (refreshed) {
//         handleFavoriteClick(); // Retry fetching videos after refreshing token
//       }
//     } else {
//       console.error('Error fetching videos or user data:', error);
//       setLoading(false);
//     }
//   }
// };

//   // Handle opening and closing the three-dot menu
//   const handleMenuClick = (event, queryId) => {
//     console.log('queryId', queryId);
//     setSelectedQueryId(queryId);
//     setAnchorEl(event.currentTarget);
//   };
 


//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedQueryId(null);
//   };


 
//   // Close report dialog
//   const handleReportDialogClose = () => {
//     setReportDialogOpen(false);
//     setReportReason('');
//     setBlockThisSession(false);
//     setBlockAllSessions(false);
//     setIsSubmitDisabled(true);
//   };

//    // Handle opening the report dialog
//    const handleReportClick = (queryId, isReply = false) => {
//     setSelectedQueryId(queryId);
//     setIsReply(isReply); // Set if reporting a reply
//     setReportDialogOpen(true);
//   };

//   // Handle submitting the report
//   const handleReportSubmit = async (reason) => {
//     if (!selectedQueryId) {
//       alert('Query ID is missing!');
//       return;
//     }
//     try {
//       const response = await apiClient.post(
//         'http://localhost:5011/api/visitor/report-query',
//         {
//           query_id: selectedQueryId,
//           is_reply: isReply,
//           report_reason: reason,
//         },
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );

//       if (response.status === 200) {
//         alert('Report submitted successfully.');
//       } else {
//         alert('Failed to submit the report.');
//       }
//     } catch (error) {
//       if (error.response?.status === 401) {
//         console.warn('Access token expired, attempting refresh...');
//         const refreshed = await refreshToken();
//         if (refreshed) {
//           handleReplySubmit(); // Retry fetching videos after refreshing token
//         }
//       } else {
//         console.error('Error fetching videos or user data:', error);
//         setLoading(false);
//       }
//     } finally {
//       setReportDialogOpen(false); // Close the dialog after submission
//     }
//   };
//   // Enable or disable the submit button
//   useEffect(() => {
//     setIsSubmitDisabled(!reportReason);
//   }, [reportReason]);

//   // Helper to format date and time
//   const formatDateTime = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleString();
//   };
//     // Function to find a reply for a specific query
//     const getReplyForQuery = (queryId) => {
//       return replies.find((reply) => reply.query_id === queryId);
//     };

//     // Handle expanding/collapsing text for long messages
//     const toggleExpanded = (queryId) => {
//       setExpanded((prev) => ({
//         ...prev,
//         [queryId]: !prev[queryId],
//       }));
//     };
//   // Helper to render truncated text with "Read More" functionality
//   const renderTextWithReadMore = (text, queryId, maxLines) => {
//     const isExpanded = expanded[queryId];
//     const truncatedText = isExpanded ? text : text.slice(0, 300) + (text.length > 300 ? '...' : '');
  
    
//     return (
//       <>
//         <Typography 
//           variant="body1" 
//            className="message-text"
//             fontSize="0.9rem"
//             color='#222222'
//           style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word', wordWrap: 'break-word', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: maxLines, overflow: 'hidden' }}
//         >
//           {truncatedText}
//         </Typography>
//         {text.length > 300 && (
//           <Button variant="text" color="primary" onClick={() => toggleExpanded(queryId)}>
//             {isExpanded ? 'Read Less' : 'Read More'}
//           </Button>
//         )}
//       </>
//     );
//   };


//   const toggleReplyVisibility = (queryId) => {
//     setShowFullReply((prevState) => ({
//       ...prevState,
//       [queryId]: !prevState[queryId],
//     }));
//   };
//   if (loading) {
//     return <Typography>Loading queries...</Typography>;
//   }

//   if (queries.length === 0) {
//     return <Typography>No messages found.</Typography>;
//   }



//   return (
//     <Box className="responsive-padding">
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="h5" gutterBottom>Visitors' Queries</Typography>
//         <IconButton onClick={handleFilterToggle} sx={{ color: showFilter ? 'blue' : 'inherit' }}>
//           <FilterListIcon />
//         </IconButton>
//       </Box>

//       {showFilter && (
//         <Box display="flex" gap={2} mb={2}>
//           <FormControl variant="outlined" sx={{ minWidth: 150 }}>
//             <InputLabel>Sort by Date</InputLabel>
//             <Select
//               value={sortByDate}
//               onChange={handleDateSortChange}
//               label="Sort by Date"
//               sx={{ fontSize: '0.9rem', height: 45 }}
//             >
//               <MenuItem value="newest">Newest First</MenuItem>
//               <MenuItem value="oldest">Oldest First</MenuItem>
//             </Select>
//           </FormControl>

//           <FormControl variant="outlined" sx={{ minWidth: 150 }}>
//             <InputLabel>Sort by Reply</InputLabel>
//             <Select
//               value={sortByReply}
//               onChange={handleReplySortChange}
//               label="Sort by Reply"
//               sx={{ fontSize: '0.9rem', height: 45 }}
//             >
//               <MenuItem value="all">All</MenuItem>
//               <MenuItem value="replied">Replied</MenuItem>
//               <MenuItem value="unreplied">Unreplied</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>
//       )}

//    {filteredQueries.map((query) => {
//         const reply = getReplyForQuery(query.query_id);

//         return (
          
//           <Card key={query.query_id}  className="my-query-card"
//           sx={{
//             mb: 1,
//             backgroundColor: '#f7f7f7', // Set default background color
//             '&:hover': {
//               backgroundColor: '#f0f0f0', // Change background color on hover
//             },
//             transition: 'background-color 0.3s', // Smooth transition
//           }}
//           >
//             <CardContent  sx={{ marginBottom: '-15px' , marginTop: '-1px' }}>
//               <Grid container alignItems="center"  sx={{ marginBottom: '-20px' }}>
//                 <Grid item ms  className="myquery-card" >
//                   <Box ml={-3.5} mt={-5.5} display="flex" alignItems="center" fontWeight="Bold">
//                     <Typography variant="body1" color="#000000" gutterBottom fontWeight="Bold" fontSize="0.9rem">
//                       <p>
//                         Message from 
//                         {query.anonymous ? (
//   "a Visitor"
// ) : (
//   <Link
//     href={`http://localhost:3232/user/${query.visitor_id}`}
//     underline="none"
//     sx={{
//       display: 'inline-block',


//       '&:hover': {
//        // Change color to #111111 on hover
//       },
//     }}
//   >
// &nbsp; {`@${query.visitor_username}`}&nbsp;
//   </Link>
// )}
//                          on your session "
//                         <Link
//                           href={`http://localhost:3345/session/${query.session_id}`}
//                            underline="none"
//                           color="primary"
//                         >
//                           {query.session_title}
//                         </Link>
//                         <Typography
//   variant="body2"
//   color="textSecondary"
  
//   sx={{
//     fontStyle: 'italic',
//     display: 'inline',
//     color:'#000000'
//   }}
// >
//   <b>{` at ${formatDateTime(query.msg_at)}`} </b>
// </Typography>
//                       </p>
//                     </Typography>
//                   </Box>

//                   <Grid container alignItems="center" ml={-3} mt={-1.5}>
//   <Grid item>
//     {query.anonymous ? (
//       <Avatar sx={{ fontSize: '1.5rem', bgcolor: '#00bcd4', color: 'white' }}>
//         An
//       </Avatar>
//     ) : (
//       <Link
//         href={`http://localhost:3232/`}
//         underline="none"
//         sx={{
//           display: 'inline-block',
//           '&:hover': {
//             opacity: 0.9, // Slight increase in opacity on hover
//           },
//         }}
//       >
//         <Avatar
//           sx={{
//             fontSize: '1.5rem',
//             bgcolor: '#00bcd4',
//             color: 'white',
//             cursor: 'pointer', // Makes it clear that it's clickable
//           }}
//         >
//           {query.visitor_full_name
//             ? query.visitor_full_name.charAt(0)
//             : query.visitor_username.charAt(0) || "0"}
//         </Avatar>
//       </Link>
//     )}
//   </Grid>

                    
                    


//                     <Grid item>
//                       <Box display="flex" flexDirection="column" ml={1}>
//                       <Typography variant="body2" color="textSecondary" sx={{ mt: -3 }}>
//   {query.anonymous ? (
//     "Anonymous User"
//   ) : (
//     <Link
//       href={`http://localhost:3232/`}
//       underline="none"
//       sx={{
//         display: 'inline-block',
//         color: 'inherit', // Maintain the original text color
//         '&:hover': {
//           color:'#111111', // Slight increase in opacity on hover
//         },
//       }}
//     >
//       {query.visitor_full_name || query.visitor_username}
//     </Link>
//   )}
// </Typography>
//                       </Box>
//                     </Grid>
//                   </Grid>

//                   <Box display="flex" flexDirection="column" ml={4} mt={-3} mr={4}>
//                     {renderTextWithReadMore(query.message, query.query_id, MAX_LINES_MESSAGE)}
//                   </Box>

                  
//                 </Grid>

                

//                 <Grid item>

// <IconButton
//   onClick={() => handleFavoriteClick(query.query_id)}
//   sx={{ mr: 1 }}
// >
//   {favorite[query.query_id] ? (
//     <FavoriteIcon sx={{ color: 'red' }} />  // Shows liked icon
//   ) : (
//     <FavoriteBorderIcon />                 // Shows unliked icon
//   )}
// </IconButton>

//                   <IconButton onClick={(e) => handleMenuClick(e, query.query_id)}>
//                     <MoreVertIcon />
//                   </IconButton>

//                   <Menu
//                     anchorEl={anchorEl}
//                     open={Boolean(anchorEl) && selectedQueryId === query.query_id}
//                     onClose={handleMenuClose}
//                   >
//                     <MenuItem onClick={handleMenuClose}>
//                       <RemoveCircleOutlineIcon sx={{ mr: 1 }} /> Remove from MyQueries
//                     </MenuItem>

//                     <MenuItem onClick={() => { handleReportClick(query.query_id); handleMenuClose(); }}>
//                       <ReportIcon sx={{ mr: 1 }} /> Report
//                     </MenuItem>
//                   </Menu>
//                 </Grid>
//               </Grid>

//               {/* Display reply if it exists */}
//               {reply ? (
//                 <Box mt={2}>
                 
//                    {/* V Button for toggling reply visibility */}
     
               
//  <IconButton onClick={() => toggleReplyVisibility(query.query_id)} 
//  sx={{
//   color: 'inherit', // Maintain the original text color
//     '&:hover': {
//       backgroundColor: 'transparent', // Remove hover background
//     },
//   }}>
//         {showFullReply[query.query_id] ?   
//         <Box display="flex" alignItems="center" gap={1}>
//   <Typography variant="body1" color="primary" gutterBottom>
//     Your Reply
//   </Typography>
//   <ExpandLessIcon />
  
// </Box>

//  : 
//                 <Box display="flex" alignItems="center" gap={1}>
//                 <Typography variant="body1" color="primary" gutterBottom fontSize="0.8rem"> 
//                   Your Reply
//                 </Typography>
//                 <ExpandMoreIcon />
//               </Box>
            
//                     }
//       </IconButton>
      

//        {/* Show reply only when expanded */}
//             {showFullReply[query.query_id] &&  !isEditing[query.query_id] && (
              
//               <Typography variant="body1" color="black" gutterBottom ml={5} mt={-3}>
//                 {/* Creator Avatar and Name */}
//   <Box mt={2}>
//   <Grid container alignItems="flex-start" ml={-6.5}>
//   {/* Creator Avatar */}
//   <Grid item>
//   <Link
//         href={`http://localhost:3232/user/${query.creator_id}`}
//         underline="none"
//         sx={{
//           display: 'inline-block',
//           '&:hover': {
//             opacity: 0.9, // Slight increase in opacity on hover
//           },
//         }}
//       >
//     <Avatar
//       sx={{
//         fontSize: '1.5rem',
//         bgcolor: '#4caf50',
//         color: 'white',
//         width: 40,
//         height: 40,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}
//     >
//       {reply.creator_username?.charAt(0) || 'C'}
//     </Avatar>
//     </Link>
//   </Grid>
 
//   <Typography
//         variant="body2"
  
//         sx={{
//           // fontWeight: 'bold',
//           color: '#555555',
//           ml:1
//         }}
//       > <Link
//       href={`http://localhost:3232/user/${query.creator_id}`}
//       underline="none"
      
//       sx={{
//         display: 'inline-block',
//         color: 'inherit', 
//         '&:hover': {
//            color:"#111111"
         
//         },
//       }}
//     >
//        {reply.creator_fullname || reply.creator_username || 'You'}
//        </Link>
//       </Typography> 
     
//       <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ mt: -3, ml: 1, width: '100%' }}>
//        <Typography
//         variant="caption"
//         color="textSecondary"
        
//         sx={{ fontStyle: 'italic', mt:-1.8,}}
//       >
        
      
//         {reply.reply_at ? `Replied at: ${formatDateTime(reply.reply_at)}` : ''}
//       </Typography>
//       </Box>

//   {/* Creator Name/Username and Reply Timestamp */}
//   <Grid item>
//     <Box display="flex" flexDirection="row" alignItems="center" ml={1}>
     

     
//     </Box>

//     {/* Reply Message - always starts on a new line */}
//     <Box sx={{ mt:0, ml: 5.5, maxWidth: '100%' }}>

//  {/* Reply Message */}
//  <Typography
//         variant="body2"
//         color="textPrimary"
//         sx={{
//           whiteSpace: 'pre-wrap',
//           overflowWrap: 'break-word',
//           // display: 'inline-block',
//       mt:-2,
//           marginLeft: '10px', // Aligns reply text closer to username
//         }}
//       >
//         {reply?.reply}
//       </Typography>
//     </Box>
//   </Grid>

//   </Grid>
// </Box>
             
//               </Typography>
//             )}

//        {/* Edit and Delete buttons (visible when reply is expanded and not editing) */}
// {showFullReply[query.query_id] && !isEditing[query.query_id] && (
//   <Box display="flex" gap={1} mt={1}>
//     <Button
//       variant="outlined"
//       color="primary"
//       onClick={() => handleReplyClick(query.query_id, true)}
//       startIcon={<EditIcon />}
//     >
//       Edit
//     </Button>
//     <Button
//       variant="outlined"
//       color="error"
//       onClick={() => handleDeleteReply(query.query_id)}
//       startIcon={<DeleteIcon />}
//     >
//       Delete
//     </Button>
//   </Box>
// )}

//                 </Box>
//               ) : (
             
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={() => toggleReplyField(query.query_id)}
//                   sx={{ mt: 3 }}
//                 >
//                   {renderReplyButtonText(query.query_id)}
//                 </Button>
//               )}

//               {/* Show the reply input if open */}
              
//              {/* Show the reply input if open */}
//              {isReplyOpen[query.query_id] && (
//               <Box mt={1}>
//                 <TextField
//                   fullWidth
//                   variant="outlined"
//                   placeholder="Write your reply"
//                   value={replyData[query.query_id]?.reply}
//                   onChange={(event) => handleReplyChange(event, query.query_id)}
//                   helperText={`${replyData[query.query_id]?.charactersLeft || MAX_CHAR_LIMIT} characters left`}
//                   multiline
//                   minRows={4}
//                   InputProps={{
//                     sx: {
//                       resize: 'vertical',
//                       overflow: 'auto',
//                       alignItems: 'flex-start',
//                     },
//                   }}
//                 />
//                <Button
//       variant="contained"
//       color="secondary"
//       onClick={() => handleReplySubmit(query.query_id, !!reply)}
//       sx={{ mt: 1, mr: 1 }}
//     >
//       {reply ? 'Save Edit' : 'Send Reply'}
//     </Button>
//                 <Button
//               variant="outlined"
//               color="error"
//               onClick={() => handleCancelEdit(query.query_id)}
//               sx={{ mt: 1 }}
//             >
//               Cancel
//             </Button>
//               </Box>
//             )}
//             </CardContent>
//           </Card>
//         );
//       })}

//       <Dialog open={reportDialogOpen} onClose={handleReportDialogClose}>
//         <DialogTitle>Report Session</DialogTitle>
//         <DialogContent>
//           <FormControl component="fieldset">
//             <FormLabel component="legend">Select Report Reason</FormLabel>
//             <RadioGroup
//               aria-label="report"
//               name="report"
//               value={reportReason}
//               onChange={(e) => setReportReason(e.target.value)}
//             >
//               <FormControlLabel value="sexual content" control={<Radio />} label="Sexual Content" />
//               <FormControlLabel value="violent or repulsive content" control={<Radio />} label="Violent or Repulsive Content" />
//               <FormControlLabel value="harmful or dangerous acts" control={<Radio />} label="Harmful or Dangerous Acts" />
//               <FormControlLabel value="harassment" control={<Radio />} label="Harassment" />
//             </RadioGroup>

//             <FormControlLabel
//               control={<Checkbox checked={blockThisSession} onChange={(e) => setBlockThisSession(e.target.checked)} />}
//               label="Block for this session"
//             />
//             <FormControlLabel
//               control={<Checkbox checked={blockAllSessions} onChange={(e) => setBlockAllSessions(e.target.checked)} />}
//               label="Block for all sessions"
//             />
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleReportDialogClose} color="primary">Cancel</Button>
//           <Button onClick={() => handleReportSubmit(selectedQueryId)} color="primary" disabled={isSubmitDisabled}>
//             Submit
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default VisitorQueries;
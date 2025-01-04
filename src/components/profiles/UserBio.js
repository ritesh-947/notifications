import React from 'react';
import { Typography, Box } from '@mui/material';

const UserBio = ({ bio }) => {
  return (
    <Box
      sx={{
        mt: 0,
        p: 2,
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: 1,
        width: '100%', // Default width
        maxWidth: '500px', // Limit the width on larger screens
        mx: 'auto', // Center horizontally
        '@media (max-width: 500px)': {
          maxWidth: '100%', // Full width on small screens
        },
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
        About Me
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {bio || 'This user has not added a bio yet.'}
      </Typography>
    </Box>
  );
};

export default UserBio;
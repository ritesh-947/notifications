import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BookIcon from '@mui/icons-material/Book';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const BottomNav = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  return (
    <Paper 
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: '#f7f7f7',
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction 
          label="Home" 
          icon={<HomeIcon />} 
          onClick={() => navigate('/homepage')}
        />
        <BottomNavigationAction 
          label="Queries" 
          icon={<QuestionAnswerIcon />} 
          onClick={() => navigate('/my-queries')}
        />
        <BottomNavigationAction 
          label="Upload" 
          icon={<AddCircleIcon />} 
          onClick={() => navigate('/upload')}
        />
        <BottomNavigationAction 
          label="Bookings" 
          icon={<BookIcon />} 
          onClick={() => navigate('/booked-sessions')}
        />
        <BottomNavigationAction 
          label="Profile" 
          icon={<AccountCircleIcon />} 
          onClick={() => navigate('/my-profile')}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Questions from './components/Questions'; // Questions component
import Answers from './components/Answers'; // Answers component
import PostQuestion from './components/PostQuestion'; // PostQuestion component
import axios from 'axios';
import LiveQuestions from './components/LiveQuestions';
import CommunitySelection from './components/CommunitySelection';
import PublicChat from './components/PublicChat';
const App = () => {
  const [userInfo, setUserInfo] = useState(null); // Stores the user info
  const [isLoading, setIsLoading] = useState(true); // Loading state for checking login

  // Check if the user is logged in by verifying the token from cookies (or session check from backend)
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Axios call to the backend to check login status
        const res = await axios.get('http://localhost:1000/check-login', { withCredentials: true });
        setUserInfo(res.data); // Set user info if the response confirms authentication
      } catch (err) {
        console.error('Not logged in:', err);
        // Redirect to login page if not logged in
        // window.location.href = 'http://localhost:3002/login'; // Redirect to external login page
      } finally {
        setIsLoading(false); // Mark loading as done
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <div className="App">

        <Routes>

          <Route path="/post-question" element={<PostQuestion />} />
          <Route path="/questions" element={<div> <Questions /> </div>}/>
        <Route path="/public" exact element={<CommunitySelection/>} />
        <Route path="/public/:community/room" element={<PublicChat/>} />
          {/* Route for displaying answers of a specific question */}
          <Route path="/questions/:id/answers" element={<Answers />} />
          {/* Redirect all unknown paths to questions */}
          <Route path="*" element={<Navigate to="/post-question" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
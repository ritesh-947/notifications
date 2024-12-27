import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes,useParams } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Alert from './components/Alert'; //
import ResetPasswordForm from './components/ResetPasswordForm';
import HomePage from './components/homepage/HomePage';
import Sidebar from './components/Sidebar';


import Header from './components/Header';
import PostQuestion from './components/public/PostQuestion';
import Questions from './components/public/Questions';
import Identifier from './components/Identifier';
import PromoCard from './components/aboutpage/PromoCard';
import CourseCard from './components/aboutpage/CourseCard';
import SmallCard from './components/aboutpage/SmallCard';
import Header2 from './components/Header2';
import UploadSession from './components/firstpage/UploadSession';
import BecomeCreatorPage from './components/firstpage/BecomeCreatorPage';
import Payment from './components/payment/Payment';
import SessionSetup from './components/bookings/SessionSetup';
import SessionBook from './components/bookings/SessionBook';
import BookedSessions from './components/awaitings/BookedSessions';
import Ratings from './components/awaitings/Ratings';
import Reviews from './components/aboutpage/Reviews';

import WebRTCVideoCall from './components/call/WebRTCVideoCall';
import Chat from './components/call/Chat';
import CreatorBookedSessions from './components/awaitings/CreatorBookedSessions';
import MyProfile from './components/profiles/MyProfile';
import EditProfile from './components/profiles/EditProfile';
import ProfileDescription from './components/profiles/ProfileDescription';
import SessionSelector from './components/profiles/SessionSelector';
import MyQueries from './components/profiles/MyQueries';
import VisitorQueries from './components/profiles/VisitorQueries';
import SessionDescription from './components/details_page/SessionDescription.js';
import AskQuery from './components/details_page/AskQuery.js';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 800); // Screen width detection
  const [setupData, setSetupData] = useState(null); // State to hold the session setup data

  // Detect screen resize and update the state
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 800);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

 // Combined RoomPage for Video Call and Chat
const RoomPage = () => {
  const { roomId } = useParams(); // Extract room ID from the URL

  return (
    <div className="app-container">
      {/* WebRTC Video Call Component */}
      <div className="video-call-section">
        <WebRTCVideoCall roomId={roomId} />
      </div>

      {/* Chat Component */}
      <div className="chat-section">
        <Chat />
      </div>
    </div>
  );
};

const SessionPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <SessionDescription />
      <AskQuery/>
    </div>
  );
};




  return (
    <Router>
      <div className="App">
      {isSmallScreen ? (
          <Header2 onSearch={handleSearch} />
        ) : (
          <Header onSearch={handleSearch} />
        )}
          <Sidebar />
        <Alert />
        <Routes>
      
        <Route path="/payment" element={<Payment />} />
          <Route path="/" element={<Login />} />
          <Route path="/become-creator" element={<BecomeCreatorPage />} />
          <Route path="/identifier" element={<Identifier />} />
          <Route path="/homepage" element={<HomePage searchQuery={searchQuery} />}/>
          <Route path="/chat/:room_id" element={<Chat />} />
          <Route path="/upload" element={<UploadSession />} />
          <Route 
            path="/session/:session_id" 
            element={
              <>
               <SmallCard /> 
                <PromoCard />
                <CourseCard />
                <Reviews />
             
                {/* <InstructorCard />   */}
                {/* <ViewSimilar /> */}
               
              </>
            } 
          />      

          
          {/* <Route path="/sessions/:session_id" element={<SessionDescription />}/> */}
          <Route path="/sessions/:session_id" element={<SessionPage />} />

          <Route path="/post-question" element={<PostQuestion />} />
          
          <Route path="/questions" element={<Questions />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/resetpassword" element={<ResetPasswordForm />} />
          <Route path="/session/:session_id/book" element={<SessionBook />} />
          <Route path="/booked-sessions" element={<BookedSessions />} />
          <Route path="/creator-sessions" element={<CreatorBookedSessions />} />
          <Route path="/session/:session_id/rate" element={<Ratings />} />
          <Route path="/my-profile" element={
  <>
    <MyProfile />
    <ProfileDescription />
    <SessionSelector />
  </>
} />
          <Route path="/edit-profile" element={<EditProfile />} />

          <Route path="/my-queries" element={<MyQueries />} />
          <Route path="/visitor-queries" element={<VisitorQueries />} />
        
          <Route path="/room/:roomId" element={<RoomPage />} />
          
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
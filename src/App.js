import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Alert from './components/Alert'; //
import ResetPasswordForm from './components/ResetPasswordForm';
import HomePage from './components/homepage/HomePage';
import Chat from './components/Message/Chat'
import SimpleForm from './components/upload/SimpleForm'
import Header from './components/Header';
import PostQuestion from './components/public/PostQuestion';
import Questions from './components/public/Questions';


const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
const handleSearch = (query) => {
  setSearchQuery(query);
};


  return (
    <Router>
      <div className="App">
        <Alert />
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/upload" element={<SimpleForm />} />
          <Route path="/homepage" element={<HomePage searchQuery={searchQuery} />}/>
          <Route path="/chat/:room_id" element={<Chat />} />
          <Route path="/post-question" element={<PostQuestion />} />
          <Route path="/questions" element={<Questions />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/resetpassword" element={<ResetPasswordForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
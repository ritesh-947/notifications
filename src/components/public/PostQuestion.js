import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopicsSelector from './TopicsSelector'; // Assuming TopicsSelector is in the same folder
import { FaCheckCircle, FaPaperPlane } from 'react-icons/fa'; // Importing icons from react-icons

const PostQuestions = () => {
  const [questionInput, setQuestionInput] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false); // Default is not anonymous
  const [charCount, setCharCount] = useState(0);
  const [userInfo, setUserInfo] = useState({
    sessionId: null,
    username: null,
    user_id: null,
  });

  // Fetch user info from localStorage
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    const username = localStorage.getItem('username');
    const user_id = localStorage.getItem('user_id');
    setUserInfo({ sessionId, username, user_id });
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Retrieve session_id from localStorage
  const sessionId = localStorage.getItem('sessionId');

  // Check if sessionId is available
  if (!sessionId) {
    alert('You must be logged in to post a question.');
    return;
  }

  const questionData = {
    question: questionInput,
    topics: selectedTopics,
    is_anonymous: isAnonymous,
  };

  try {
    const response = await axios.post(
      // 'https://public-server-lbev.onrender.com/questions',
      'http://localhost:1000/questions',
      questionData,
      {
        headers: {
          Authorization: `Session ${sessionId}`, // Pass session_id in Authorization header
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Question submitted:', response.data);
    setQuestionInput('');
    setSelectedTopics([]);
    setIsAnonymous(false);
    setCharCount(0);
  } catch (err) {
    console.error('Error submitting question:', err);
    if (err.response) {
      console.error('Response data:', err.response.data);
    }
  }
};

  return (
    <div
      className="question-form-container"
      style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '1rem auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
      }}
    >
      <h3 style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
  Post Question
  <FaCheckCircle style={{ color: '#27ae60', fontSize: '18px' }} />
</h3>

      <small>{charCount}/512</small>
      {/* Question Input */}
      <textarea
        placeholder="Ask your question here.."
        value={questionInput}
        onChange={(e) => {
          setQuestionInput(e.target.value);
          setCharCount(e.target.value.length);
        }}
        maxLength={512}
        rows={2}
        required
        style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', marginBottom: '10px' }}
      />

      {/* Topics Selector */}
      <TopicsSelector selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics} />

      {/* Post Anonymously */}
    {/* Post Anonymously */}
{/* Post Anonymously */}
<div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
  <label style={{ cursor: 'pointer' }}>Post anonymously?</label>
  <input
    type="checkbox"
    checked={isAnonymous}
    onChange={() => setIsAnonymous(!isAnonymous)}
    style={{
      cursor: 'pointer',
      width: '1rem', // Restrict width to 1.5rem
      height: '1rem', // Ensure height matches for a square appearance
      marginTop:'1rem',
    }}
  />
</div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: '#27ae60',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '20px',
        }}
      >
        Post Question <FaPaperPlane style={{ fontSize: '16px' }} />
      </button>
    </div>
  );
};

export default PostQuestions;
import React, { useState } from 'react';
import axios from 'axios';
import TopicsSelector from './TopicsSelector'; // Assuming TopicsSelector is in the same folder
import { FaCheckCircle, FaPaperPlane } from 'react-icons/fa'; // Importing tick and send icons
import { useNavigate } from 'react-router-dom'; // Import React Router's navigate

const PostQuestions = () => {
  const [questionInput, setQuestionInput] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [charCount, setCharCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState(''); // For displaying the success message
  const navigate = useNavigate(); // React Router's navigation function

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if question input is not empty
    if (questionInput.trim() === '') {
      alert('Question must not be empty.');
      return;
    }

    // Validation: Check if at least one topic is selected
    if (selectedTopics.length === 0) {
      alert('Please select at least one topic.');
      return;
    }

    // Validation: Ensure that the question input is within the limit
    if (questionInput.length > 128) {
      alert('Question must not exceed 128 characters.');
      return;
    }

    // Prepare data to send to backend
    const questionData = {
      question: questionInput,
      topics: selectedTopics,
      is_anonymous: isAnonymous,
    };

    try {
      // Send question to backend
      const response = await axios.post('http://localhost:1000/questions', questionData, { withCredentials: true });
      console.log('Question submitted:', response.data);

      // Clear the form after submission
      setQuestionInput('');
      setSelectedTopics([]);
      setIsAnonymous(true);
      setCharCount(0);

      // Display success message and redirect
      setSuccessMessage('Your question has been posted successfully!');
      setTimeout(() => {
        // navigate('/homepage'); // Redirect to homepage after 2 seconds
      }, 2000);
    } catch (err) {
      console.error('Error submitting question:', err);
    }
  };

  return (
    <div
      className="question-form-container"
      style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
      }}
    >
      <h3>
        Post Question Anonymously{' '}
        <FaCheckCircle style={{ color: '#27ae60', marginRight: '8px', fontSize: '18px' }} />
      </h3>

      <small>{charCount}/128</small>
      {/* Question Input */}
      <textarea
        placeholder="Ask your question here (max 128 characters)..."
        value={questionInput}
        onChange={(e) => {
          setQuestionInput(e.target.value);
          setCharCount(e.target.value.length);
        }}
        maxLength={128}
        rows={2}
        required
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          borderRadius: '5px',
          marginBottom: '10px',
        }}
      />

      {/* Topics Selector */}
      <TopicsSelector selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics} />

      {/* Success Message */}
      {successMessage && (
        <p
          style={{
            color: 'green',
            textAlign: 'center',
            fontWeight: 'bold',
            marginTop: '20px',
          }}
        >
          {successMessage}
        </p>
      )}

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
          marginTop: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px', // Spacing between text and icon
        }}
      >
        Post Question <FaPaperPlane style={{ fontSize: '16px' }} />
      </button>
    </div>
  );
};

export default PostQuestions;
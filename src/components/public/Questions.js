import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './QuestionsModified.css';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null); // For answering
  const [answerInput, setAnswerInput] = useState(''); // For the answer input
  const [charCount, setCharCount] = useState(0); // To track the character count for the answer input
  const [filter, setFilter] = useState('mostRecent'); // Default filter

  // Fetch questions based on the selected filter
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        const url = `http://localhost:1000/questions?filter=${filter}`; // Updated API endpoint with filter query param

        const res = await axios.get(url, {
          headers: sessionId ? { Authorization: `Session ${sessionId}` } : {},
        });

        setQuestions(res.data);
      } catch (err) {
        console.error('Failed to fetch questions:', err);
      }
    };

    fetchQuestions();
  }, [filter]);

  const handleViewAnswers = (questionId) => {
    window.location.href = `/questions/${questionId}/answers`;
  };

  const handleAnswerSubmit = async (questionId) => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      alert('You need to be logged in to perform this action.');
      return;
    }

    if (!answerInput.trim()) {
      alert('Answer must not be empty.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:1000/questions/${questionId}/answers`,
        { answer: answerInput },
        { headers: { Authorization: `Session ${sessionId}` } }
      );
      alert('Answer submitted successfully!');
      setAnswerInput('');
      setCharCount(0); // Reset character count
      setSelectedQuestion(null);
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  };

  const formatAnswerCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k answers`;
    }
    return count === 1 ? '1 answer' : `${count} answers`;
  };

  return (
    <div className="questions-container-mod">
      <h2>Questions Section</h2>

      {/* Filter Buttons */}
      <div className="filters-mod">
        <button
          className={`filter-button ${filter === 'mostRecent' ? 'active' : ''}`}
          onClick={() => setFilter('mostRecent')}
        >
          Most Recent
        </button>
        <button
          className={`filter-button ${filter === 'mostAnswered' ? 'active' : ''}`}
          onClick={() => setFilter('mostAnswered')}
        >
          Most Answered
        </button>
      </div>

      {questions.length ? (
        questions.map((question) => (
          <div key={question.id} className="question-card-mod">
            <div className="profile-section-mod">
              <div className="profile-pic-circle-mod">
                {question.username
                  ? question.username.charAt(0).toUpperCase()
                  : 'A'}
              </div>
              <div className="username-mod">
                {question.username || 'Anonymous'}
              </div>
            </div>

            <div className="question-section-mod">
              <h3 className="question-header-mod">{question.question || 'No question content'}</h3>
              <div className="topics-mod">
                {question.topics && question.topics.length
                  ? question.topics.map((topic) => (
                      <span key={topic} className="topic-tag-mod">
                        {topic}
                      </span>
                    ))
                  : 'No topics'}
              </div>

              <p className="posted-time-mod">
                Posted {formatDistanceToNow(new Date(question.created_at))} ago
              </p>

              <div className="action-buttons-mod">
                <button
                  className="view-answers-button-mod"
                  onClick={() => handleViewAnswers(question.id)}
                >
                  <FontAwesomeIcon icon={faComment} /> {formatAnswerCount(question.answer_count)}
                </button>
                <button
                  className="answer-button-mod"
                  onClick={() => setSelectedQuestion(question.id)}
                >
                  <FontAwesomeIcon icon={faPaperPlane} /> Answer
                </button>
              </div>

              {selectedQuestion === question.id && (
                <div className="answer-input-mod">
                  <textarea
                    value={answerInput}
                    onChange={(e) => {
                      setAnswerInput(e.target.value);
                      setCharCount(e.target.value.length); // Update character count
                    }}
                    maxLength={1024} // Enforce the max character limit
                    placeholder="Write your answer here (max 1024 characters)..."
                  ></textarea>
                  <small>{charCount}/1024 characters</small> {/* Character counter */}
                  <button onClick={() => handleAnswerSubmit(question.id)}>
                    <FontAwesomeIcon icon={faPaperPlane} /> Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No questions found.</p>
      )}
    </div>
  );
};

export default Questions;
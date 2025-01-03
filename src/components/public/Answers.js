import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt, faPaperPlane, faEdit } from '@fortawesome/free-solid-svg-icons';
import './Answers.css';

const Answers = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [charCountAnswer, setCharCountAnswer] = useState(0);
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        const res = await axios.get(`http://localhost:1000/questions/${id}/answers`, {
          headers: sessionId ? { Authorization: `Session ${sessionId}` } : {},
        });
        setQuestion(res.data.question);
        setAnswers(res.data.answers);
      } catch (err) {
        console.error('Failed to fetch answers:', err);
      }
    };

    fetchQuestionAndAnswers();
  }, [id]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (newAnswer.trim() === '') {
      alert('Answer must not be empty.');
      return;
    }

    if (newAnswer.length > 1024) {
      alert('Answer must not exceed 1024 characters.');
      return;
    }

    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        alert('You need to be logged in to perform this action.');
        return;
      }

      const response = await axios.post(
        `http://localhost:1000/questions/${id}/answers`,
        {
          answer: newAnswer,
          is_anonymous: false,
        },
        { headers: { Authorization: `Session ${sessionId}` } }
      );

      if (response.status === 200 || response.status === 201) {
        alert('Answer submitted successfully!');

        // Refresh answers after submission
        const res = await axios.get(`http://localhost:1000/questions/${id}/answers`, {
          headers: { Authorization: `Session ${sessionId}` },
        });
        setAnswers(res.data.answers);

        setNewAnswer('');
        setCharCountAnswer(0);
        setShowAnswerForm(false);
      }
    } catch (err) {
      console.error('Failed to submit the answer:', err);
      alert('An error occurred while submitting your answer. Please try again.');
    }
  };

  const handleLike = async (answerId) => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        alert('You need to be logged in to perform this action.');
        return;
      }

      await axios.post(
        `http://localhost:1000/answers/${answerId}/like`,
        {},
        { headers: { Authorization: `Session ${sessionId}` } }
      );

      const res = await axios.get(`http://localhost:1000/questions/${id}/answers`, {
        headers: { Authorization: `Session ${sessionId}` },
      });
      setAnswers(res.data.answers);
    } catch (err) {
      console.error('Failed to like the answer:', err);
    }
  };

  const getInitials = (name, isAnonymous) => {
    if (isAnonymous) return 'An';
    return name ? name.charAt(0).toUpperCase() : 'A';
  };

  return (
    <div className="container" style={{ marginTop: '3rem' }}>
      <div className="answers-container">
      <div className="question-container">
      <div className="profile-circle-question">
      {getInitials(question.username, question.is_anonymous)}
    </div>
  <div className="profile-section">
   
    <div className="username-and-question">
      <p className="username">
        <strong>{question.username || 'Anonymous'}</strong>
      </p>
      <p className="question-text">{question.question}</p>
    </div>
  </div>
  <div className="topics">
    {question.topics?.map((topic) => (
      <span key={topic} className="topic-tag">
        {topic}
      </span>
    ))}
  </div>
  <p className="timestamp">Posted {moment(question.created_at).fromNow()}</p>
</div>

        <div>
          <button
            className="answer-button"
            onClick={() => setShowAnswerForm(!showAnswerForm)}
          >
            <FontAwesomeIcon icon={faEdit} /> {showAnswerForm ? 'Cancel' : 'Provide Answer'}
          </button>
        </div>

        {showAnswerForm && (
          <div className="answer-form">
            <form onSubmit={handleSubmitAnswer}>
              <textarea
                placeholder="Write your answer here (max 1024 characters)..."
                value={newAnswer}
                onChange={(e) => {
                  setNewAnswer(e.target.value);
                  setCharCountAnswer(e.target.value.length);
                }}
                maxLength={1024}
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '5px',
                  marginBottom: '10px',
                }}
              />
              <small className="char-count">{charCountAnswer}/1024</small>
              <button type="submit" className="submit-answer-button">
                <FontAwesomeIcon icon={faPaperPlane} /> Submit your answer
              </button>
            </form>
          </div>
        )}

        <div>
          <h3>
            <FontAwesomeIcon icon={faCommentAlt} /> Answers
          </h3>
          {answers.length ? (
            answers.map((answer) => (
              <div key={answer.id} className="answer-card">
                <div className="profile-section">
                  <div className="profile-circle-answer">
                    {getInitials(answer.username, answer.is_anonymous)}
                  </div>
                  <div className="username-and-answer">
                    <p className="username">
                      <strong>{answer.username || 'Anonymous'}</strong>
                    </p>
                    <p>{answer.answer}</p>
                  </div>
                </div>
                <p className="timestamp" style={{ fontSize: '0.85rem', color: 'grey' }}>
                  Answered {moment(answer.created_at).fromNow()}
                </p>
              </div>
            ))
          ) : (
            <p>No answers yet. Be the first to answer!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Answers;
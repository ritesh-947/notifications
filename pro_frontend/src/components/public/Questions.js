import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { FaLock, FaPencilAlt } from 'react-icons/fa'; // Import icons
import TopicsSelector from './TopicsSelector'; // Import TopicsSelector component
import './QuestionsModified.css';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [answers, setAnswers] = useState({}); // Stores answers for each question
  const [showAnswers, setShowAnswers] = useState({}); // Tracks which question's answers are visible
  const [writeAnswer, setWriteAnswer] = useState({}); // Tracks which question has an active answer input
  const [answerInputs, setAnswerInputs] = useState({}); // Stores input values for answers

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const url = 'http://localhost:1000/questions'; // Replace with your endpoint
        console.log('Fetching questions from:', url);
        const res = await axios.get(url);
        console.log('Questions fetched:', res.data);
        setQuestions(res.data);
        setFilteredQuestions(res.data); // Initially display all questions
      } catch (err) {
        console.error('Failed to fetch questions:', err);
      }
    };

    fetchQuestions();
  }, []);

  // Filter questions based on selected topics
  useEffect(() => {
    if (selectedTopics.length > 0) {
      const filtered = questions.filter((question) =>
        selectedTopics.some((topic) => question.topics.includes(topic))
      );
      setFilteredQuestions(filtered);
    } else {
      setFilteredQuestions(questions); // Show all questions if no topic is selected
    }
  }, [selectedTopics, questions]);

  // Toggle visibility of answers for a question and fetch answers if not already fetched
  const toggleAnswers = async (questionId) => {
    setShowAnswers((prevState) => ({
      ...prevState,
      [questionId]: !prevState[questionId],
    }));

    if (!answers[questionId]) {
      try {
        const url = `http://localhost:1000/questions/${questionId}`; // Fetch question with answers
        const res = await axios.get(url);
        setAnswers((prevState) => ({
          ...prevState,
          [questionId]: res.data.answers,
        }));
      } catch (err) {
        console.error(`Failed to fetch answers for question ${questionId}:`, err);
      }
    }
  };

  // Toggle input box for writing an answer
  const toggleWriteAnswer = (questionId) => {
    setWriteAnswer((prevState) => ({
      ...prevState,
      [questionId]: !prevState[questionId],
    }));
    setAnswerInputs((prevState) => ({
      ...prevState,
      [questionId]: '', // Clear input when toggling
    }));
  };

  // Submit an answer to the backend
  const handleSubmitAnswer = async (questionId) => {
    const answer = answerInputs[questionId];
    if (!answer || answer.trim() === '') {
      alert('Answer cannot be empty!');
      return;
    }

    try {
      const url = `http://localhost:1000/questions/${questionId}/answers`;
      const response = await axios.post(url, { answer });
      console.log('Answer submitted:', response.data);

      // Update the answers state with the new answer
      setAnswers((prevState) => ({
        ...prevState,
        [questionId]: [...(prevState[questionId] || []), response.data.answer],
      }));

      // Reset the input and hide the answer input box
      setWriteAnswer((prevState) => ({ ...prevState, [questionId]: false }));
      setAnswerInputs((prevState) => ({ ...prevState, [questionId]: '' }));
    } catch (err) {
      console.error('Failed to submit answer:', err);
      alert('Failed to submit answer. Please try again.');
    }
  };

  return (
    <div className="questions-container-mod">
      <h3>Questions Section</h3>

      {/* Topics Selector */}
      <TopicsSelector selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics} />

      {filteredQuestions.length ? (
        filteredQuestions.map((question) => (
          <div key={question.id} className="question-card-mod">
            <div className="profile-section-mod">
<div className="profile-icon">
  <span>Q</span>
</div>
             
              <div className="username-mod">{question.username || 'Anonymous'}</div>
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
              <div className="button-container-mod">
                {/* View Answers Button */}
                <button
                  className="view-answers-btn"
                  onClick={() => toggleAnswers(question.id)}
                  style={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  {showAnswers[question.id] ? 'Hide' : 'Answers'}
                </button>

                {/* Write Answer Button */}
                <button
                  className="write-answer-btn"
                  onClick={() => toggleWriteAnswer(question.id)}
                  style={{
                    backgroundColor: '#27ae60',
                    color: 'white',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  Answer
                  <FaPencilAlt />
                </button>
              </div>

       {/* Display Answers Below Question */}
{showAnswers[question.id] && (
  <div className="answers-section" style={{ marginTop: '10px' }}>
    {/* <h4>Answers:</h4> */}
    {answers[question.id] && answers[question.id].length > 0 ? (
      answers[question.id].map((answerObj, index) => (
        <p
          key={answerObj.id}
          className="answer-item"
          style={{
            marginLeft: '-6rem',
            padding: '5px',
            borderRadius: '5px',
            backgroundColor: index % 2 === 0 ? '#f0f8ff' : '#e6ffe6', // Alternate row colors
          }}
        >
          <strong style={{ color: '#3498db' }}>{index + 1}.</strong> {/* Serial number */}
          {' '}
          {answerObj.answer}
        </p>
      ))
    ) : (
      <p>No answers yet.</p>
    )}
  </div>
)}

              {/* Display Write Answer Input */}
              {writeAnswer[question.id] && (
                <div className="write-answer-section" style={{ marginTop: '10px', marginLeft: '-5rem,',marginRight: '1rem' }}>
                  <textarea
                    placeholder="Write your answer here..."
                    rows={2}

                    value={answerInputs[question.id] || ''}
                    onChange={(e) =>
                      setAnswerInputs((prevState) => ({
                        ...prevState,
                        [question.id]: e.target.value,
                      }))
                    }
                    style={{
                      width: '140%',
                      padding: '10px',
                      fontSize: '14px',
                      borderRadius: '5px',
                      marginBottom: '10px',
                      marginLeft: '-6rem', // Adjust this value as needed
                    }}
                  />
                  <button
                    onClick={() => handleSubmitAnswer(question.id)}
                    style={{
                      backgroundColor: '#e67e22',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                        marginLeft: '-6rem',
                         marginTop: '-10px',
                    }}
                  >
                    Submit Answer
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
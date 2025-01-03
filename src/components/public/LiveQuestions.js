import React, { useEffect, useState, useRef } from 'react';
import './LiveQuestions.css';

const LiveQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true); // Track if auto-scrolling should happen
  const [fetchInterval, setFetchInterval] = useState(1000); // Default fetching interval
  const containerRef = useRef(null);

  useEffect(() => {
    // Fetch questions at the specified interval
    const intervalId = setInterval(() => {
      const newQuestion = {
        id: questions.length + 1,
        question_header: `New question New Question New Question New Question New Question ${questions.length + 1}?`,
        username: 'User' + (questions.length + 11),
      };
      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    }, fetchInterval);

    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, [questions.length, fetchInterval]);

  useEffect(() => {
    if (isAutoScrolling && containerRef.current) {
      const container = containerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [questions, isAutoScrolling]);

  const handleScroll = () => {
    const container = containerRef.current;
    const currentPosition = container.scrollTop + container.clientHeight;
    const threshold = container.scrollHeight - container.clientHeight * 0.15;

    // If the user is near the bottom, auto-scroll should resume
    if (currentPosition >= threshold) {
      setIsAutoScrolling(true);
    } else {
      setIsAutoScrolling(false);
    }
  };

  // Function to set fetching to faster (700ms)
  const loadFaster = () => {
    setFetchInterval(700);
  };

  // Function to set fetching to slower (3500ms)
  const loadSlower = () => {
    setFetchInterval(3500);
  };

  // Function to scroll all the way down
  const scrollToBottom = () => {
    setIsAutoScrolling(true); // Enable auto-scroll
  };

  return (
    <div className="live-questions-wrapper">
      <div className="controls">
        <button className="control-button" onClick={loadFaster}>Load Faster</button>
        <button className="control-button" onClick={loadSlower}>Load Slower</button>
        <button className="control-button" onClick={scrollToBottom}>Scroll Full Down</button>
      </div>

      <div
        className="live-questions-container"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {questions.map((question) => (
          <div key={question.id} className="question-card">
            <div className="profile-section">
              <div className="profile-pic">
                {question.username.charAt(0).toUpperCase()}
              </div>
              <div className="username">{question.username}</div>
            </div>
            <div className="question-section">
              <h3 className="question-header">{question.question_header}</h3>
            </div>
          </div>
        ))}
        {!isAutoScrolling && (
          <button className="scroll-to-bottom" onClick={scrollToBottom}>
            ⬇️ Scroll
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveQuestions;
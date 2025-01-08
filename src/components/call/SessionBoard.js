import React, { useState, useEffect } from 'react';
import './SessionBoard.css';
import axios from 'axios';
import { FaBook, FaPencilAlt, FaCheck, FaTimes, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import moment from 'moment-timezone';

const SessionBoard = () => {
  const [items, setItems] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isBoardVisible, setIsBoardVisible] = useState(false);
  const [error, setError] = useState(null);

  const timezone = 'Asia/Kolkata';

  const apiClient = axios.create({
    baseURL: 'http://localhost:7170',
  });

  apiClient.interceptors.request.use((config) => {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      config.headers['Authorization'] = `Session ${sessionId}`;
    }
    return config;
  });

  useEffect(() => {
    if (isBoardVisible) fetchSessionBoard();
  }, [isBoardVisible]);

  const fetchSessionBoard = async () => {
    try {
      const response = await apiClient.get('/session-board');
      const dataWithConvertedTimes = response.data.map((item) => ({
        ...item,
        created_at: moment.utc(item.created_at).tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
        edited_at: moment.utc(item.edited_at).tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
      }));
      setItems(dataWithConvertedTimes);
    } catch (error) {
      console.error('Error fetching session board:', error);
      setError('Failed to fetch session board. Please try again later.');
    }
  };

  const addItem = () => {
    if (items.length < 24) {
      const newItem = { spec_id: '1', title: '', description: '', isExpanded: false };
      setItems([...items, newItem]);
    }
  };

  const saveItem = async (index) => {
    const item = items[index];
    try {
      if (item.id) {
        await apiClient.put(`/session-board/${item.id}`, item);
        alert('Title and description saved!');
      } else {
        const response = await apiClient.post('/session-board', item);
        const updatedItems = [...items];
        updatedItems[index] = response.data;
        setItems(updatedItems);
        alert('New item created!');
      }
    } catch (error) {
      console.error('Error saving session board item:', error);
      setError('Failed to save item. Please try again.');
    }
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const toggleDescription = (index) => {
    const updatedItems = [...items];
    updatedItems[index].isExpanded = !updatedItems[index].isExpanded;
    setItems(updatedItems);
  };

  const removeDescription = (index) => {
    const confirmDelete = window.confirm('Do you want to remove the description?');
    if (confirmDelete) {
      updateItem(index, 'description', '');
    }
  };

  const removeItem = async (index) => {
    const confirmDelete = window.confirm('Do you want to remove the title and description?');
    if (confirmDelete) {
      try {
        const deletedItem = items[index];
        if (deletedItem.id) {
          await apiClient.delete(`/session-board/${deletedItem.id}`);
        }
        setItems(items.filter((_, i) => i !== index));
      } catch (error) {
        console.error('Error deleting session board item:', error);
        setError('Failed to delete item. Please try again.');
      }
    }
  };

  const toggleBoardVisibility = () => {
    setIsBoardVisible(!isBoardVisible);
  };

  return (
    <>
      {/* Floating Book Button */}
      {!isBoardVisible && (
        <div
          className="floating-button"
          onClick={toggleBoardVisibility}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#007BFF',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 1000,
          }}
        >
          <FaBook size={20} />
        </div>
      )}

      {/* Session Board */}
      {isBoardVisible && (
        <div className="recall-board">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Session Board</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* Pencil Icon */}
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                style={{
                  backgroundColor: '#007BFF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                }}
              >
                {isEditMode ? <FaBook size={18} /> : <FaPencilAlt size={18} />}
              </button>

              {/* Close Button */}
              <button
                onClick={toggleBoardVisibility}
                style={{
                  backgroundColor: '#FF4D4D',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                }}
              >
                <FaTimes size={18} />
              </button>
            </div>
          </div>
          {error && <div className="error">{error}</div>}
          {items.map((item, index) => (
            <div key={index} className="recall-item">
              <div className="title-container">
                <span className="serial-number">{index + 1}.</span>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                  placeholder={`Enter title ${index + 1}`}
                  maxLength={44}
                  className="title-input"
                  disabled={!isEditMode}
                />
                <button className="chevron-button" onClick={() => toggleDescription(index)}>
                  {item.isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {isEditMode && (
                  <button className="save-button" onClick={() => saveItem(index)}>
                    <FaCheck />
                  </button>
                )}
                {isEditMode && (
                  <button className="remove-button" onClick={() => removeItem(index)}>
                    X
                  </button>
                )}
              </div>
              {item.isExpanded && (
                <div className="description-container">
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder={`Enter description for title ${index + 1}`}
                    rows={6}
                    maxLength={272}
                    className="description-input"
                    disabled={!isEditMode}
                  />
                  {isEditMode && (
                    <button className="save-button" onClick={() => saveItem(index)}>
                      <FaCheck />
                    </button>
                  )}
                  {isEditMode && (
                    <button className="remove-description-button" onClick={() => removeDescription(index)}>
                      -
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
          {isEditMode && items.length < 24 && (
            <button className="add-item-button" onClick={() => addItem()}>
              + Add Title
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default SessionBoard;
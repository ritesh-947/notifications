import React, { useState } from 'react';
import './SimpleForm.css'; // Add custom CSS for this form

const SimpleForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    videoUrl: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { title, description, videoUrl } = formData;
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    } else if (title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters.';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required.';
    } else if (description.length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters.';
    }

    const youtubeUrlPattern = /^https:\/\/www\.youtube\.com\/watch\?v=|^https:\/\/youtu\.be\//;
    if (!videoUrl.match(youtubeUrlPattern)) {
      newErrors.videoUrl = 'Please provide a valid YouTube URL.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:3052/api/session-pro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_title: formData.title,
            description: formData.description,
            video_url: formData.videoUrl,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setSuccessMessage('Session created successfully!');
          console.log('Backend Response:', data);
          setFormData({ title: '', description: '', videoUrl: '' }); // Reset form
          setErrors({}); // Clear any existing errors
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error || 'Failed to create session.'}`);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while creating the session. Please try again later.');
      }
    }
  };

  return (
    <form className="simple-form" onSubmit={handleSubmit}>
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="form-group">
        <label htmlFor="title">Title (Max 100 characters):</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          maxLength="100"
          required
        />
        {errors.title && <p className="error-message">{errors.title}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Blog (Max 2000 characters):</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength="500"
          required
        />
        {errors.description && (
          <p className="error-message">{errors.description}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="videoUrl">YouTube URL:</label>
        <input
          type="url"
          id="videoUrl"
          name="videoUrl"
          value={formData.videoUrl}
          onChange={handleChange}
          placeholder="https://youtu.be/your-video-id"
          required
        />
        {errors.videoUrl && (
          <p className="error-message">{errors.videoUrl}</p>
        )}
      </div>

      <button type="submit" className="submit-button">
        Upload
      </button>
    </form>
  );
};

export default SimpleForm;
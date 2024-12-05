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
    } else if (description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters.';
    }

    const youtubeUrlPattern = /^https:\/\/www\.youtube\.com\/watch\?v=|^https:\/\/youtu\.be\//;
    if (!videoUrl.match(youtubeUrlPattern)) {
      newErrors.videoUrl = 'Please provide a valid YouTube URL.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Form Data:', formData);
      alert('Form submitted successfully!');
      // Handle form submission logic here (e.g., API call)
    }
  };

  return (
    <form className="simple-form" onSubmit={handleSubmit}>
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
        <label htmlFor="description">Description (Max 500 characters):</label>
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
        Submit
      </button>
    </form>
  );
};

export default SimpleForm;
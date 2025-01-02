import React, { useState } from 'react';
import './ProductUploadForm.css'; // Assuming you have some CSS for this component

const ProductUploadForm = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [languages, setLanguages] = useState('');
  const [visibility, setVisibility] = useState('18plusNo');

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleLanguagesChange = (event) => {
    setLanguages(event.target.value);
  };

  const handleVisibilityChange = (event) => {
    setVisibility(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Selected Category:', selectedCategory);
    console.log('Languages:', languages.split(',').map(lang => lang.trim()));
    console.log('Visibility:', visibility);
    // Handle the form submission logic
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
  <option value="">Select a category</option>
  <option value="Career Development and Job Solutions">Career Development and Job Solutions</option>
  <option value="Book Discussions and Recommendations">Book Discussions and Recommendations</option>
  <option value="Health and Wellness">Health and Wellness</option>
  <option value="Technology and Innovation">Technology and Innovation</option>
  <option value="Entrepreneurship and Business Growth">Entrepreneurship and Business Growth</option>
  <option value="Creative Arts and Hobbies">Creative Arts and Hobbies</option>
  <option value="Education and Skill Development">Education and Skill Development</option>
  <option value="Legal Advice and Rights">Legal Advice and Rights</option>
  <option value="Financial Literacy and Investments">Financial Literacy and Investments</option>
  <option value="Travel and Cultural Exchange">Travel and Cultural Exchange</option>
</select>
      </div>

      <div className="form-group">
        <label htmlFor="languages">Languages:</label>
        <input
          type="text"
          id="languages"
          value={languages}
          onChange={handleLanguagesChange}
          placeholder="Enter languages separated by commas"
        />
      </div>

      <div className="form-group">
        <label>Is this content suitable for 18+ only?</label><br />
        <input
          type="radio"
          id="18plusYes"
          name="visibility"
          value="18plusYes"
          checked={visibility === '18plusYes'}
          onChange={handleVisibilityChange}
        />
        <label htmlFor="18plusYes">Yes</label><br />
        <input
          type="radio"
          id="18plusNo"
          name="visibility"
          value="18plusNo"
          checked={visibility === '18plusNo'}
          onChange={handleVisibilityChange}
        />
        <label htmlFor="18plusNo">No</label><br />
      </div>

      <button type="submit" className="submit-button">Upload Product</button>
    </form>
  );
};

export default ProductUploadForm;
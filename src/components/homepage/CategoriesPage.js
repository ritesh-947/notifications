import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoriesPage.css';

const categories = [
  { value: 'Career Development and Job Solutions', label: '💼 Career Development and Job Solutions' },
  { value: 'Book Discussions and Recommendations', label: '📚 Book Discussions and Recommendations' },
  { value: 'Health and Wellness', label: '💪 Health and Wellness' },
  { value: 'Technology and Innovation', label: '💻 Technology and Innovation' },
  { value: 'Entrepreneurship and Business Growth', label: '🚀 Entrepreneurship and Business Growth' },
  { value: 'Creative Arts and Hobbies', label: '🎨 Creative Arts and Hobbies' },
  { value: 'Education and Skill Development', label: '🎓 Education and Skill Development' },
  { value: 'Legal Advice and Rights', label: '⚖️ Legal Advice and Rights' }, // Corrected here
  { value: 'Financial Literacy and Investments', label: '💰 Financial Literacy and Investments' },
  { value: 'Travel and Cultural Exchange', label: '✈️ Travel and Cultural Exchange' },
];

const CategoriesPage = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`); // Navigate to the category page
  };

  return (
    <div className="categories-page">
      <h4>Explore Categories</h4>
      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.value}
            className="category-card"
            onClick={() => handleCategoryClick(category.value)}
          >
            <span className="category-icon">{category.label.split(' ')[0]}</span>
            <span className="category-label">{category.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
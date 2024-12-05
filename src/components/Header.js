import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { FaHome, FaUpload } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();

  return (
    
    <div className="header">
        
      <div className="overlay">
        
        <button className="header-button" onClick={() => navigate('/homepage')}>
          <FaHome className="icon" />
          Homepage
        </button>
        <button className="header-button" onClick={() => navigate('/upload')}>
          <FaUpload className="icon" />
          Upload
        </button>
         <div class="description-text">
  
</div>

       
        
      </div>
    </div>
    

  );
};

export default Header;